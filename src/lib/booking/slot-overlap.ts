import type { Db, ObjectId } from "mongodb";
import { formatInTimeZone } from "date-fns-tz";

import { RESERVATION_TZ } from "@/lib/booking/public-slot-lead";
import { findSalonTreatmentById } from "@/lib/treatments/catalog";

const COLLECTION = "reservations";
const ACTIVE_STATUSES = ["confirmed"] as const;

/** Máximo de turnos confirmados que pueden solaparse en el mismo instante (todo el horario). */
export const SALON_MAX_CONCURRENT_RESERVATIONS = 1;

export type IntervalMs = { startMs: number; endMs: number };

export function intervalsOverlap(a: IntervalMs, b: IntervalMs): boolean {
  return a.startMs < b.endMs && a.endMs > b.startMs;
}

/** Inicio/fin del turno en epoch ms (misma convención que `computeStartsAtUtc`, ART -03:00). */
export function slotIntervalMs(
  dateKey: string,
  timeLocal: string,
  durationMinutes: number,
): IntervalMs | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !/^\d{2}:\d{2}$/.test(timeLocal)) {
    return null;
  }
  const d = new Date(`${dateKey}T${timeLocal}:00-03:00`);
  if (Number.isNaN(d.getTime())) return null;
  const startMs = d.getTime();
  const endMs = startMs + durationMinutes * 60_000;
  return { startMs, endMs };
}

/** Capacidad del salón en ese instante (mismo `dateKey` en ART); fuera del día, 1. */
export function salonConcurrentCapAtInstant(dateKey: string, instantMs: number): number {
  const dayKey = formatInTimeZone(new Date(instantMs), RESERVATION_TZ, "yyyy-MM-dd");
  if (dayKey !== dateKey) return SALON_MAX_CONCURRENT_RESERVATIONS;
  return SALON_MAX_CONCURRENT_RESERVATIONS;
}

export function reservationDurationMinutesFromDoc(r: {
  durationMinutes?: unknown;
  treatmentId?: unknown;
}): number {
  if (typeof r.durationMinutes === "number" && Number.isFinite(r.durationMinutes) && r.durationMinutes > 0) {
    return r.durationMinutes;
  }
  const tid = String(r.treatmentId ?? "").trim();
  return findSalonTreatmentById(tid)?.durationMinutes ?? 60;
}

function durationForReservationRow(r: {
  durationMinutes?: unknown;
  treatmentId?: unknown;
  startsAt?: unknown;
}): number {
  return reservationDurationMinutesFromDoc(r);
}

export async function loadBusyIntervalsMs(
  db: Db,
  dateKey: string,
  excludeReservationId?: ObjectId,
): Promise<IntervalMs[]> {
  const filter: Record<string, unknown> = {
    dateKey,
    reservationStatus: { $in: [...ACTIVE_STATUSES] },
  };
  if (excludeReservationId) {
    filter._id = { $ne: excludeReservationId };
  }
  const rows = await db
    .collection(COLLECTION)
    .find(filter, { projection: { startsAt: 1, durationMinutes: 1, treatmentId: 1 } })
    .toArray();

  return rows.map((r) => {
    const startsAt = r.startsAt instanceof Date ? r.startsAt : new Date(String(r.startsAt));
    const startMs = startsAt.getTime();
    const dur = durationForReservationRow(r as { durationMinutes?: unknown; treatmentId?: unknown });
    return { startMs, endMs: startMs + dur * 60_000 };
  });
}

/**
 * ¿Se puede agregar este intervalo sin superar la capacidad del salón?
 * Con cupo 1: ningún turno puede solaparse con otro confirmado.
 * `getEffectiveCap` permite reducir a 0 por bloqueos de agenda (silla / salón).
 */
export function canPlaceReservationSlot(
  dateKey: string,
  candidate: IntervalMs,
  busy: IntervalMs[],
  getEffectiveCap?: (instantMs: number) => number,
): boolean {
  const relevant = busy.filter((b) => intervalsOverlap(b, candidate));
  const points = new Set<number>([candidate.startMs, candidate.endMs]);
  for (const b of relevant) {
    const s = Math.max(b.startMs, candidate.startMs);
    const e = Math.min(b.endMs, candidate.endMs);
    if (s < e) {
      points.add(s);
      points.add(e);
    }
  }
  const sorted = [...points].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 1; i++) {
    const t0 = sorted[i];
    const t1 = sorted[i + 1];
    if (t1 <= t0) continue;
    const lo = Math.max(t0, candidate.startMs);
    const hi = Math.min(t1, candidate.endMs);
    if (hi <= lo) continue;
    const mid = (lo + hi) / 2;
    const cap = getEffectiveCap ? getEffectiveCap(mid) : salonConcurrentCapAtInstant(dateKey, mid);
    let depth = 0;
    for (const b of relevant) {
      if (b.startMs < hi && b.endMs > lo) depth++;
    }
    if (depth + 1 > cap) return false;
  }
  return true;
}

export function filterSlotsBySalonCapacity(
  slots: string[],
  dateKey: string,
  durationMinutes: number,
  busy: IntervalMs[],
  getEffectiveCap?: (instantMs: number) => number,
): string[] {
  return slots.filter((timeLocal) => {
    const slot = slotIntervalMs(dateKey, timeLocal, durationMinutes);
    if (!slot) return false;
    return canPlaceReservationSlot(dateKey, slot, busy, getEffectiveCap);
  });
}

export async function reservationWouldExceedSalonCapacity(
  db: Db,
  dateKey: string,
  candidate: IntervalMs,
  getEffectiveCap?: (instantMs: number) => number,
  excludeReservationId?: ObjectId,
): Promise<boolean> {
  const busy = await loadBusyIntervalsMs(db, dateKey, excludeReservationId);
  return !canPlaceReservationSlot(dateKey, candidate, busy, getEffectiveCap);
}
