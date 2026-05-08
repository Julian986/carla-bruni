/**
 * Reglas de agenda por tratamiento (slots públicos).
 * Las entradas del mapa son tratamientos con restricción de último inicio en ciertos días.
 * Si el mapa está vacío, no se aplican restricciones adicionales por ID.
 */

// ─── Horarios de corte (legacy; reservados por si el salón vuelve a pedir reglas) ─

/** Último inicio permitido para trabajos con regla martes–viernes. */
export const TECH_LATEST_START_TUE_FRI = "14:00";

/** Minutos del día en que terminan los trabajos técnicos los sábados (13:00). */
const SAT_TECH_END_MINUTES = 13 * 60; // 780

// ─── Tratamientos con reglas especiales (id → durationMinutes) ─────────────────

const TECHNICAL_TREATMENTS = new Map<string, number>();

// ─── Keratina (legacy; sin ID en catálogo actual no aplica) ────────────────────

export const KERATINA_ONLY_TIME_LOCAL = "15:00";

// ─── Helpers internos ─────────────────────────────────────────────────────────

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isSaturday(dateKey: string): boolean {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return false;
  return new Date(y, m - 1, d).getDay() === 6;
}

function saturdayTechLastStart(durationMinutes: number): string {
  const lastStartMins = Math.floor((SAT_TECH_END_MINUTES - durationMinutes) / 30) * 30;
  if (lastStartMins <= 0) return "00:00";
  return `${pad2(Math.floor(lastStartMins / 60))}:${pad2(lastStartMins % 60)}`;
}

// ─── API pública ──────────────────────────────────────────────────────────────

export function isTechnicalTreatment(treatmentId: string): boolean {
  return TECHNICAL_TREATMENTS.has(treatmentId);
}

export function treatmentIsKeratinaOnly1530(treatmentId: string): boolean {
  return treatmentId === "keratina";
}

/**
 * Filtra los slots según las reglas de negocio del tratamiento.
 */
export function filterPublicSlotsByTreatmentRules(
  treatmentId: string | undefined,
  slots: string[],
  dateKey?: string,
): string[] {
  if (!treatmentId) return slots;

  if (treatmentIsKeratinaOnly1530(treatmentId)) {
    return slots.filter((t) => t === KERATINA_ONLY_TIME_LOCAL);
  }

  const duration = TECHNICAL_TREATMENTS.get(treatmentId);
  if (duration === undefined) return slots;

  if (dateKey && isSaturday(dateKey)) {
    const lastStart = saturdayTechLastStart(duration);
    return slots.filter((t) => t <= lastStart);
  }

  return slots.filter((t) => t <= TECH_LATEST_START_TUE_FRI);
}

export const REFLEJOS_BALAYAGE_LATEST_START = TECH_LATEST_START_TUE_FRI;
export function treatmentRequiresStartNoLaterThan14(treatmentId: string): boolean {
  return TECHNICAL_TREATMENTS.has(treatmentId);
}
