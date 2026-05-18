import { formatSalonConsultWhatsAppDate } from "@/lib/booking/salon-availability";

/** Mismo número que contacto / promos (E.164 sin +). */
const DEFAULT_WHATSAPP_E164 = "5492236164271";

/**
 * Escalares Unicode explícitos: wa.me y algunos clientes de WhatsApp Web corrompen
 * pictogramas UTF-8 en el query `text` (aparece). Ver panel-turnos-dashboard.
 */
const WA_CONSULT_EMOJI = {
  sparkles: String.fromCodePoint(0x2728),
  calendar: String.fromCodePoint(0x1f4c5),
  clock: String.fromCodePoint(0x1f550),
} as const;

export function publicBookingWhatsAppE164(): string {
  const raw = process.env.PUBLIC_WHATSAPP_E164?.trim();
  if (!raw) return DEFAULT_WHATSAPP_E164;
  return raw.replace(/\D/g, "");
}

export type PublicBookingConsultMessageInput = {
  serviceLabel: string;
  /** `YYYY-MM-DD` — preferido para formatear la fecha en el mensaje. */
  dateKey?: string;
  /** Respaldo si no hay `dateKey`. */
  dateLabel?: string;
  timeLocal: string;
};

/** Quita prefijos de catálogo («FREYJA · …») para el texto del chat. */
function prettifyConsultServiceNames(raw: string): string[] {
  return raw
    .split(/\s*\+\s*/)
    .map((part) => part.trim().replace(/^[^·]+\s*·\s*/, "").trim())
    .filter((name) => name.length > 0);
}

function formatConsultTime(timeLocal: string): string {
  const time = timeLocal.trim();
  if (!time) return "—";
  if (/\bhs\b/i.test(time)) return time;
  return `${time} hs`;
}

export function buildPublicBookingConsultMessage(input: PublicBookingConsultMessageInput): string {
  const { sparkles, calendar, clock } = WA_CONSULT_EMOJI;
  const services = prettifyConsultServiceNames(input.serviceLabel);
  const serviceLines =
    services.length > 0
      ? services.map((name) => `${sparkles} *${name}*`).join("\n")
      : `${sparkles} *—*`;

  const date =
    input.dateKey?.trim()
      ? formatSalonConsultWhatsAppDate(input.dateKey.trim())
      : input.dateLabel?.trim() || "—";

  const time = formatConsultTime(input.timeLocal);

  return [
    "¡Hola! Vi la app de *Espacio Freyja* y quería consultar disponibilidad para:",
    "",
    serviceLines,
    `${calendar} ${date}`,
    `${clock} ${time}`,
    "",
    "¿Tienen ese turno disponible?",
  ].join("\n");
}

/** api.whatsapp.com evita corrupción de `text` frente a wa.me en escritorio / WhatsApp Web. */
export function buildPublicBookingConsultWhatsAppUrl(input: PublicBookingConsultMessageInput): string {
  const phone = publicBookingWhatsAppE164();
  const text = buildPublicBookingConsultMessage(input);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}
