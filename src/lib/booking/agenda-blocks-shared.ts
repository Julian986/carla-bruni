/**
 * Reglas de bloqueo de agenda sin dependencias de Node/Mongo (seguro para Client Components).
 */

import { isSystemWeekdayClosureBlock } from "@/lib/booking/weekday-closure-blocks-shared";

export type AgendaBlockScope = "salon" | "chair_1" | "chair_2";

export type AgendaBlockRecurrence =
  | null
  | {
      type: "weekly";
      untilDateKey?: string | null;
    };

/** Campos mínimos para saber si un bloqueo aplica a un `dateKey`. */
export type AgendaBlockRule = {
  anchorDateKey: string;
  recurrence: AgendaBlockRecurrence;
};

export function parseDateKeyLocal(dateKey: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;
  return dt;
}

function sameWeekday(aKey: string, bKey: string): boolean {
  const a = parseDateKeyLocal(aKey);
  const b = parseDateKeyLocal(bKey);
  if (!a || !b) return false;
  return a.getDay() === b.getDay();
}

export function agendaBlockAppliesToDateKey(doc: AgendaBlockRule, dateKey: string): boolean {
  if (!doc.recurrence) {
    return doc.anchorDateKey === dateKey;
  }
  if (doc.recurrence.type !== "weekly") return false;
  if (dateKey < doc.anchorDateKey) return false;
  if (!sameWeekday(doc.anchorDateKey, dateKey)) return false;
  const until = doc.recurrence.untilDateKey?.trim();
  if (until && dateKey > until) return false;
  return true;
}

function minutesToHhmmLocal(totalMinutes: number): string {
  const m = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Rango legible para bloqueos (ej. `08:30 – 16:30`). */
export function formatAgendaBlockTimeRange(timeLocal: string, durationMinutes: number): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeLocal.trim());
  if (!match || !Number.isFinite(durationMinutes) || durationMinutes <= 0) return timeLocal.trim();
  const startM = Number(match[1]) * 60 + Number(match[2]);
  const endM = startM + Math.round(durationMinutes);
  return `${minutesToHhmmLocal(startM)} – ${minutesToHhmmLocal(endM)}`;
}

/** Clave para agrupar bloqueos que se ven iguales en el detalle de un día. */
export function agendaBlockVisualGroupKey(block: {
  timeLocal: string;
  durationMinutes: number;
  scope: string;
  blockedTreatmentIds?: string[] | null;
  createdBy?: string | null;
  notes?: string | null;
}): string {
  const ids = [...(block.blockedTreatmentIds ?? [])].filter(Boolean).sort();
  const habitual = isSystemWeekdayClosureBlock(block);
  return `${block.timeLocal}|${block.durationMinutes}|${block.scope}|${ids.join(",")}|${habitual ? "habitual" : "block"}`;
}

export type AgendaBlockDisplayGroup<T extends { id: string }> = {
  representative: T;
  members: T[];
};

function pickAgendaBlockRepresentative<T extends { id: string; recurrence: AgendaBlockRecurrence; createdBy?: string | null; notes?: string | null }>(
  members: T[],
): T {
  const habitual = members.find((m) => isSystemWeekdayClosureBlock(m));
  if (habitual) return habitual;
  const weekly = members.filter((m) => m.recurrence?.type === "weekly");
  if (weekly.length > 0) {
    const openEnded = weekly.find((m) => !m.recurrence?.untilDateKey?.trim());
    if (openEnded) return openEnded;
    return [...weekly].sort((a, b) =>
      (a.recurrence?.untilDateKey ?? "").localeCompare(b.recurrence?.untilDateKey ?? ""),
    )[0]!;
  }
  return members[0]!;
}

/** Varias reglas en DB que aplican igual ese día → una tarjeta en el panel. */
export function groupAgendaBlocksForDayDisplay<T extends {
  id: string;
  timeLocal: string;
  durationMinutes: number;
  scope: string;
  blockedTreatmentIds?: string[] | null;
  recurrence: AgendaBlockRecurrence;
  createdBy?: string | null;
  notes?: string | null;
}>(blocks: T[]): AgendaBlockDisplayGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const b of blocks) {
    const key = agendaBlockVisualGroupKey(b);
    const list = map.get(key) ?? [];
    list.push(b);
    map.set(key, list);
  }
  return [...map.values()].map((members) => ({
    members,
    representative: pickAgendaBlockRepresentative(members),
  }));
}

/** Etiqueta de recurrencia cuando hay varios bloqueos agrupados. */
export function agendaBlockGroupedRecurrenceLabel(
  members: { recurrence: AgendaBlockRecurrence }[],
): string | null {
  const weekly = members.filter((m) => m.recurrence?.type === "weekly");
  if (weekly.length === 0) return null;
  const untilKeys = new Set(
    weekly.map((m) => m.recurrence?.untilDateKey?.trim() ?? "").filter((u) => u.length > 0),
  );
  if (untilKeys.size === 0) return "Semanal";
  if (untilKeys.size === 1) {
    const until = [...untilKeys][0]!;
    return `Semanal hasta ${until}`;
  }
  return "Semanal · varias reglas";
}
