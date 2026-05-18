import {
  SALON_TREATMENTS,
  TREATMENT_CATEGORIES,
  type TreatmentCategory,
} from "@/lib/treatments/catalog";
import { isArgentinaPublicHoliday } from "@/lib/booking/argentina-holidays";

export type SalonTreatmentOption = {
  id: string;
  name: string;
  subtitle: string;
  category: TreatmentCategory;
};

export const SALON_TREATMENT_CATEGORIES: TreatmentCategory[] = [...TREATMENT_CATEGORIES];

export const SALON_TREATMENT_OPTIONS: SalonTreatmentOption[] = SALON_TREATMENTS.map((t) => ({
  id: t.id,
  name: t.name,
  subtitle: t.subtitle,
  category: t.category,
}));

/** Tope de duración en catálogo (min); usado solo en calendarios con `availableTimesByDateOverride`. */
const SALON_MAX_SERVICE_DURATION_MINUTES = 90;

const SLOT_STEP_MINUTES = 30;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function minutesToHhmm(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Minuto del día en que deben haber terminado los servicios (cierre), por día de semana; null = cerrado. */
function closingMinutesForWeekday(weekday: number): number | null {
  switch (weekday) {
    case 1: // lunes (habitualmente bloqueado en agenda; horario base si se desbloquea)
    case 2: // martes
    case 3: // miércoles (idem lunes)
      return 16 * 60 + 30;
    case 4: // jueves
    case 5: // viernes
      return 18 * 60;
    case 6: // sábado
      return 15 * 60;
    default:
      return null;
  }
}

/**
 * Cierre del salón en minutos desde medianoche (ART, mismo dateKey): el servicio debe terminar a esta hora o antes.
 * Feriados: null. Días con override: último inicio listado + duración máxima de servicio.
 */
export function getSalonClosingMinutesForDateKey(dateKey: string): number | null {
  if (isArgentinaPublicHoliday(dateKey)) return null;
  const override = availableTimesByDateOverride[dateKey];
  if (override && override.length > 0) {
    const maxStart = Math.max(...override.map(hhmmToMinutes));
    return maxStart + SALON_MAX_SERVICE_DURATION_MINUTES;
  }
  return closingMinutesForWeekday(parseDateKey(dateKey).getDay());
}

/** Inicio del primer turno posible y duración hasta el cierre de servicios (p. ej. bloqueo “todo el día”). */
export function getSalonWorkDayBlockRange(dateKey: string): { timeLocal: string; durationMinutes: number } | null {
  const slots = getAvailableTimesForDate(dateKey);
  if (slots.length === 0) return null;
  const startMins = hhmmToMinutes(slots[0]);
  const endMins = getSalonClosingMinutesForDateKey(dateKey);
  if (endMins == null || endMins <= startMins) return null;
  return { timeLocal: slots[0], durationMinutes: endMins - startMins };
}

/**
 * Igual que `getSalonWorkDayBlockRange` pero usa la grilla semanal fija (no descarta fechas pasadas).
 * Sirve para sembrar bloqueos recurrentes con anclas en el pasado.
 */
export function getSalonScheduleBlockRangeForWeekday(
  weekday: number,
): { timeLocal: string; durationMinutes: number } | null {
  const slots = availableTimesByWeekday[weekday] ?? [];
  if (slots.length === 0) return null;
  const endMins = closingMinutesForWeekday(weekday);
  if (endMins == null) return null;
  const startMins = hhmmToMinutes(slots[0]);
  if (endMins <= startMins) return null;
  return { timeLocal: slots[0], durationMinutes: endMins - startMins };
}

/** Inicios de turno cada `SLOT_STEP_MINUTES`, con `open` inclusive y `close` exclusive (ej. 9:00–18:00 → último inicio 17:30). */
function buildStepSlots(openH: number, openM: number, closeH: number, closeM: number): string[] {
  let t = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  const out: string[] = [];
  while (t < end) {
    out.push(minutesToHhmm(t));
    t += SLOT_STEP_MINUTES;
  }
  return out;
}

/**
 * Horarios base (ART): lun y mié 8:30–16:30 (cierre habitual vía bloqueos de agenda semanales);
 * mar igual; jue y vie 9–18; sáb 9–15; dom cerrado.
 * Grilla cada 30 min (cierre exclusivo en `buildStepSlots`: último inicio media hora antes del cierre).
 */
const availableTimesByWeekday: Record<number, string[]> = {
  0: [],
  1: buildStepSlots(8, 30, 16, 30),
  2: buildStepSlots(8, 30, 16, 30),
  3: buildStepSlots(8, 30, 16, 30),
  4: buildStepSlots(9, 0, 18, 0),
  5: buildStepSlots(9, 0, 18, 0),
  6: buildStepSlots(9, 0, 15, 0),
};

/** Quita inicios donde el servicio pasaría del cierre del salón ese día (`dateKey`). */
export function filterSlotsServiceEndsOnOrBeforeClose(
  slots: string[],
  durationMinutes: number,
  dateKey: string,
): string[] {
  const lastServiceEndMinutes = getSalonClosingMinutesForDateKey(dateKey);
  if (lastServiceEndMinutes == null) return [];
  return slots.filter((t) => hhmmToMinutes(t) + durationMinutes <= lastServiceEndMinutes);
}

/**
 * Excepciones manuales por fecha (prioridad sobre `availableTimesByWeekday`).
 * Vacío: las entradas previas no tenían origen documentado; sumar acá `yyyy-mm-dd` → horarios cuando haya agenda confirmada.
 *
 * Copia de respaldo (no activa):
 * - 2026-03-30: 09:00, 16:30, 18:15
 * - 2026-03-31: 10:00, 17:00, 18:00
 * - 2026-04-01: 08:00, 10:00, 11:00, 12:00, 17:00
 * - 2026-04-04: 09:00, 10:00, 11:00, 12:00
 * - 2026-04-07: 10:00, 11:00, 15:00, 16:00, 17:30, 18:30
 * - 2026-04-08: 08:00, 09:00, 10:00, 10:30, 15:00, 16:00
 * - 2026-04-09: 08:00, 09:00, 10:00
 * - 2026-04-10: 11:00, 15:00, 16:00, 17:30, 18:30
 * - 2026-04-11: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00
 */
const availableTimesByDateOverride: Record<string, string[]> = {};

export const salonWeekdayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const salonWeekdayLong = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const salonMonthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function formatSalonDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getAvailableTimesForDate(value: string) {
  const date = parseDateKey(value);
  const today = startOfDay(new Date());

  if (startOfDay(date) < today) {
    return [];
  }
  if (isArgentinaPublicHoliday(value)) {
    return [];
  }

  const override = availableTimesByDateOverride[value];
  if (override) {
    return override;
  }

  return availableTimesByWeekday[date.getDay()] ?? [];
}

export type SalonCalendarItem = {
  value: string;
  dayNumber: number;
  weekday: string;
  isCurrentMonth: boolean;
  isAvailable: boolean;
};

export function buildSalonCalendarItems(year: number, monthIndex: number): SalonCalendarItem[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const gridStartDate = new Date(year, monthIndex, 1 - startWeekday);

  return Array.from({ length: 35 }, (_, index) => {
    const currentDate = new Date(gridStartDate);
    currentDate.setDate(gridStartDate.getDate() + index);

    const value = formatSalonDateKey(currentDate);

    return {
      value,
      dayNumber: currentDate.getDate(),
      weekday: salonWeekdayLabels[currentDate.getDay()],
      isCurrentMonth: currentDate.getMonth() === monthIndex,
      isAvailable: getAvailableTimesForDate(value).length > 0,
    };
  });
}

export function formatSalonDisplayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "Elegí día";

  const date = new Date(year, month - 1, day);
  return `${salonWeekdayLabels[date.getDay()]}, ${day} ${salonMonthNames[month - 1].slice(0, 3).toLowerCase()}`;
}

/** Fecha legible para mensajes de consulta por WhatsApp (ej. «Jueves 21 de mayo»). */
export function formatSalonConsultWhatsAppDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "—";

  const date = new Date(year, month - 1, day);
  const weekday = salonWeekdayLong[date.getDay()];
  const monthName = salonMonthNames[month - 1].toLowerCase();
  return `${weekday} ${day} de ${monthName}`;
}

/** Solo dígitos, para cruzar reservas con el mismo WhatsApp aunque el formato varíe. */
export function normalizePhoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isLikelyWhatsappNumber(raw: string): boolean {
  const digits = normalizePhoneDigits(raw);
  return digits.length >= 10 && digits.length <= 15;
}
