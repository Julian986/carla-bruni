import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  PublicBookingSettingsEnvForcedError,
  getPublicBookingSettings,
  setPublicOnlineBookingEnabled,
} from "@/lib/booking/public-booking-settings";
import { verifyPanelCookie } from "@/lib/panel-turnos-auth";

export const dynamic = "force-dynamic";

async function requirePanel() {
  const cookieStore = await cookies();
  if (!verifyPanelCookie(cookieStore.get("panel_turnos_auth")?.value)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await requirePanel();
  if (unauthorized) return unauthorized;

  try {
    const settings = await getPublicBookingSettings();
    return NextResponse.json(settings);
  } catch (e) {
    console.error("[panel-turnos/settings/public-booking GET]", e);
    return NextResponse.json({ error: "No se pudo leer la configuración." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requirePanel();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const enabled =
    body !== null &&
    typeof body === "object" &&
    "publicOnlineBookingEnabled" in body &&
    typeof (body as { publicOnlineBookingEnabled: unknown }).publicOnlineBookingEnabled === "boolean"
      ? (body as { publicOnlineBookingEnabled: boolean }).publicOnlineBookingEnabled
      : null;

  if (enabled === null) {
    return NextResponse.json(
      { error: "Falta publicOnlineBookingEnabled (boolean)." },
      { status: 400 },
    );
  }

  try {
    const settings = await setPublicOnlineBookingEnabled(enabled, "panel");
    return NextResponse.json(settings);
  } catch (e) {
    if (e instanceof PublicBookingSettingsEnvForcedError) {
      return NextResponse.json({ error: e.message, code: "ENV_FORCED" }, { status: 409 });
    }
    console.error("[panel-turnos/settings/public-booking PATCH]", e);
    return NextResponse.json({ error: "No se pudo guardar la configuración." }, { status: 500 });
  }
}
