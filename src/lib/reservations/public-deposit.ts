/**
 * Tratamientos para los que la reserva pública exige seña (Mercado Pago).
 * El resto se confirma al instante con `paymentStatus: not_required`.
 */
const IDS = [
  "freyja-consulta-analisis-primera-piel",
  "freyja-hifu-25d-facial",
  "freyja-hifu-25d-corporal",
  "freyja-peeling-acidos",
  "freyja-exosomas",
  "freyja-pdrn",
  "freyja-bioestimulacion-hifu-12d",
] as const;

const SET = new Set<string>(IDS);

export function treatmentRequiresPublicDeposit(treatmentId: string): boolean {
  return SET.has(treatmentId.trim());
}
