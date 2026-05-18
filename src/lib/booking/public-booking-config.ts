/**
 * Reserva online pública (Mercado Pago / confirmación en web).
 * El valor habitual lo define Mongo (`salon_settings.public_booking`), editable desde el panel.
 * `PUBLIC_BOOKING_FORCE_ENABLED` puede pisar la DB en emergencias.
 */
export {
  getPublicBookingSettings,
  invalidatePublicBookingSettingsCache,
  isPublicOnlineBookingEnabled,
  setPublicOnlineBookingEnabled,
  PublicBookingSettingsEnvForcedError,
  type PublicBookingSettingsSnapshot,
} from "@/lib/booking/public-booking-settings";

export const PUBLIC_BOOKING_DISABLED_MESSAGE =
  "La reserva online está pausada. Consultá disponibilidad por WhatsApp.";
