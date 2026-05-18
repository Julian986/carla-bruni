import type { Collection, Db } from "mongodb";

import {
  AGENDA_BLOCKS_COLLECTION,
  type SalonAgendaBlockDoc,
} from "@/lib/booking/agenda-blocks";
import {
  formatSalonDisplayDate,
  getSalonScheduleBlockRangeForWeekday,
} from "@/lib/booking/salon-availability";
import { parseDateKeyLocal } from "@/lib/booking/agenda-blocks-shared";
import {
  SYSTEM_WEEKDAY_CLOSURE_CREATED_BY,
  WEEKDAY_CLOSURE_NOTE_LUNES,
  WEEKDAY_CLOSURE_NOTE_MIERCOLES,
} from "@/lib/booking/weekday-closure-blocks-shared";

export { SYSTEM_WEEKDAY_CLOSURE_CREATED_BY } from "@/lib/booking/weekday-closure-blocks-shared";

/** Marca en `salon_settings`: migración lun/mié ejecutada (no impide reparar bloqueos faltantes). */
const WEEKDAY_CLOSURE_SEED_SETTINGS_ID = "weekday_closure_seed";

/** Anclas fijas (lunes y miércoles) para recurrencia semanal. */
const WEEKDAY_CLOSURE_ANCHORS: Record<1 | 3, string> = {
  1: "2026-01-05",
  3: "2026-01-07",
};

const WEEKDAY_CLOSURE_NOTES: Record<1 | 3, string> = {
  1: WEEKDAY_CLOSURE_NOTE_LUNES,
  3: WEEKDAY_CLOSURE_NOTE_MIERCOLES,
};

const WEEKDAYS_TO_SEED = [1, 3] as const;

async function findWeekdayClosureBlock(blocksCol: Collection<SalonAgendaBlockDoc>, weekday: 1 | 3) {
  return blocksCol.findOne({
    scope: "salon",
    "recurrence.type": "weekly",
    $or: [
      { createdBy: SYSTEM_WEEKDAY_CLOSURE_CREATED_BY, anchorWeekday: weekday },
      { notes: WEEKDAY_CLOSURE_NOTES[weekday] },
    ],
  });
}

async function insertWeekdayClosureBlock(
  blocksCol: Collection<SalonAgendaBlockDoc>,
  weekday: 1 | 3,
  now: Date,
): Promise<boolean> {
  const anchorDateKey = WEEKDAY_CLOSURE_ANCHORS[weekday];
  const range = getSalonScheduleBlockRangeForWeekday(weekday);
  if (!range) {
    console.warn(`[weekday-closure-blocks] Sin grilla base para weekday ${weekday}.`);
    return false;
  }

  const anchorDt = parseDateKeyLocal(anchorDateKey);
  if (!anchorDt) return false;

  const startsAt = new Date(`${anchorDateKey}T${range.timeLocal}:00-03:00`);
  if (Number.isNaN(startsAt.getTime())) return false;

  await blocksCol.insertOne({
    anchorDateKey,
    anchorWeekday: anchorDt.getDay(),
    timeLocal: range.timeLocal,
    durationMinutes: range.durationMinutes,
    startsAt,
    displayDate: formatSalonDisplayDate(anchorDateKey),
    scope: "salon",
    recurrence: { type: "weekly", untilDateKey: null },
    notes: WEEKDAY_CLOSURE_NOTES[weekday],
    createdAt: now,
    createdBy: SYSTEM_WEEKDAY_CLOSURE_CREATED_BY,
  } as SalonAgendaBlockDoc);

  return true;
}

/**
 * Garantiza bloqueos semanales de salón para lunes y miércoles.
 * Si Carla elimina un bloqueo, no se vuelve a crear (solo faltantes tras migración).
 */
export async function ensureDefaultWeekdayClosureBlocks(db: Db): Promise<void> {
  const blocksCol = db.collection<SalonAgendaBlockDoc>(AGENDA_BLOCKS_COLLECTION);
  const settingsCol = db.collection<{ _id: string; seededAt: Date }>("salon_settings");
  const now = new Date();

  let insertedAny = false;
  for (const weekday of WEEKDAYS_TO_SEED) {
    const existing = await findWeekdayClosureBlock(blocksCol, weekday);
    if (existing) continue;
    const ok = await insertWeekdayClosureBlock(blocksCol, weekday, now);
    if (ok) insertedAny = true;
  }

  const mon = await findWeekdayClosureBlock(blocksCol, 1);
  const wed = await findWeekdayClosureBlock(blocksCol, 3);
  if (mon && wed) {
    await settingsCol.updateOne(
      { _id: WEEKDAY_CLOSURE_SEED_SETTINGS_ID },
      { $setOnInsert: { seededAt: now } },
      { upsert: true },
    );
  } else if (insertedAny) {
    console.warn("[weekday-closure-blocks] Bloqueos lun/mié incompletos tras semilla.");
  }
}
