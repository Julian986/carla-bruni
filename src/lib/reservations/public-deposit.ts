/**
 * Seña vía Mercado Pago en la reserva pública.
 *
 * **Desactivada por ahora:** ningún tratamiento exige pago para reservar;
 * todas las reservas pasan directo a confirmadas (`insertPublicConfirmedReservationWithoutPayment`).
 *
 * Para volver a exigir seña en algunos servicios, cambiá `DEPOSIT_DISABLED`
 * a `false` y usá de nuevo la lista `IDS` con `SET.has(treatmentId.trim())`.
 */
const DEPOSIT_DISABLED = true;

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
  if (DEPOSIT_DISABLED) return false;
  return SET.has(treatmentId.trim());
}
