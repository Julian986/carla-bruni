/** Identificador de bloqueos sembrados (lun/mié cerrados). Sin dependencias de servidor. */
export const SYSTEM_WEEKDAY_CLOSURE_CREATED_BY = "system_weekday_closure";

export const WEEKDAY_CLOSURE_NOTE_LUNES = "Lunes cerrado (habitual)";
export const WEEKDAY_CLOSURE_NOTE_MIERCOLES = "Miércoles cerrado (habitual)";

export function isSystemWeekdayClosureBlock(block: {
  createdBy?: string | null;
  notes?: string | null;
}): boolean {
  if (block.createdBy === SYSTEM_WEEKDAY_CLOSURE_CREATED_BY) return true;
  const n = block.notes?.trim() ?? "";
  return n === WEEKDAY_CLOSURE_NOTE_LUNES || n === WEEKDAY_CLOSURE_NOTE_MIERCOLES;
}
