"use client";

import { Globe, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type SettingsResponse = {
  publicOnlineBookingEnabled?: boolean;
  updatedAt?: string | null;
  envForced?: boolean;
  error?: string;
  code?: string;
};

export function PanelPublicBookingMode() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [envForced, setEnvForced] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedPulse, setSavedPulse] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/panel-turnos/settings/public-booking", { cache: "no-store" });
      const data = (await res.json()) as SettingsResponse;
      if (!res.ok) {
        setLoadError(data.error ?? "No se pudo cargar el modo de reserva.");
        return;
      }
      setEnabled(data.publicOnlineBookingEnabled === true);
      setEnvForced(data.envForced === true);
    } catch {
      setLoadError("Sin conexión al cargar el modo de reserva.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!settingsOpen) {
      setConfirmTarget(null);
      setSaveError(null);
    }
  }, [settingsOpen]);

  useEffect(() => {
    if (!savedPulse) return;
    const t = window.setTimeout(() => setSavedPulse(false), 2800);
    return () => window.clearTimeout(t);
  }, [savedPulse]);

  const applyMode = async (target: boolean) => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/panel-turnos/settings/public-booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicOnlineBookingEnabled: target }),
      });
      const data = (await res.json()) as SettingsResponse;
      if (!res.ok) {
        setSaveError(data.error ?? "No se pudo guardar.");
        return;
      }
      setEnabled(data.publicOnlineBookingEnabled === true);
      setEnvForced(data.envForced === true);
      setConfirmTarget(null);
      setSettingsOpen(false);
      setSavedPulse(true);
    } catch {
      setSaveError("Sin conexión. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const isConsultMode = enabled === false;
  const isBookingMode = enabled === true;

  const closeSettings = () => {
    if (saving || confirmTarget !== null) return;
    setSettingsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className={`relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border bg-[#171717] shadow-[0_6px_22px_rgba(0,0,0,0.35)] transition hover:bg-[#1d1d1d] ${
          savedPulse
            ? "border-emerald-500/50 text-emerald-300/95"
            : "border-white/12 text-[var(--soft-gray)]/88"
        }`}
        aria-label="Configurar reservas en la web"
      >
        <Globe className="h-5 w-5" strokeWidth={2} aria-hidden />
        {isConsultMode ? (
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#25D366] ring-2 ring-[#171717]"
            aria-hidden
          />
        ) : null}
      </button>

      {settingsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:px-4"
          onClick={closeSettings}
        >
          <div
            className="w-full max-w-sm rounded-t-[24px] border border-white/12 bg-[#171717] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.5)] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-[20px] text-[var(--soft-gray)]">Reservas en la web</h3>
                <p className="mt-1 text-[12px] text-[var(--soft-gray)]/55">Qué ven los clientes en /turnos</p>
              </div>
              <button
                type="button"
                onClick={closeSettings}
                disabled={saving}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--soft-gray)]/70 hover:bg-white/5 disabled:opacity-50"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            {enabled === null ? (
              <p className="text-[13px] text-[var(--soft-gray)]/55">Cargando…</p>
            ) : (
              <>
                <p className="text-[14px] font-medium text-[var(--soft-gray)]">
                  Modo actual:{" "}
                  <span className={isBookingMode ? "text-emerald-300/95" : "text-[#25D366]"}>
                    {isBookingMode ? "Reserva online" : "Consulta por WhatsApp"}
                  </span>
                </p>
                {envForced ? (
                  <p className="mt-2 text-[11px] leading-snug text-amber-200/85">
                    Fijado por el servidor (variable de entorno). Quiten la variable en Vercel para controlarlo desde
                    acá.
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] leading-snug text-[var(--soft-gray)]/50">
                    {isBookingMode
                      ? "Confirman el turno en la web; el horario queda en la agenda (sin pago online por ahora)."
                      : "Eligen horario en la agenda y consultan por WhatsApp."}
                  </p>
                )}
              </>
            )}

            {loadError ? <p className="mt-3 text-[11px] text-red-300/90">{loadError}</p> : null}

            {enabled !== null && !envForced ? (
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={saving || isConsultMode}
                  onClick={() => {
                    setSaveError(null);
                    setConfirmTarget(false);
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition ${
                    isConsultMode
                      ? "border-[#25D366]/45 bg-[#25D366]/12 text-[#7dffb0]"
                      : "border-white/10 bg-black/20 text-[var(--soft-gray)]/75 hover:border-white/18 hover:bg-white/5"
                  } disabled:cursor-default`}
                >
                  Consulta por WhatsApp
                </button>
                <button
                  type="button"
                  disabled={saving || isBookingMode}
                  onClick={() => {
                    setSaveError(null);
                    setConfirmTarget(true);
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition ${
                    isBookingMode
                      ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-200/95"
                      : "border-white/10 bg-black/20 text-[var(--soft-gray)]/75 hover:border-white/18 hover:bg-white/5"
                  } disabled:cursor-default`}
                >
                  Reserva online
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {confirmTarget !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4"
          onClick={() => {
            if (!saving) setConfirmTarget(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/12 bg-[#171717] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-[20px] text-[var(--soft-gray)]">
              {confirmTarget ? "Activar reserva online" : "Activar consulta por WhatsApp"}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--soft-gray)]/78">
              {confirmTarget ? (
                <>
                  En <span className="text-[var(--premium-gold)]">/turnos</span> los clientes podrán confirmar su
                  turno en la web. El horario queda reservado en la agenda (sin pago online por ahora).
                </>
              ) : (
                <>
                  En <span className="text-[var(--premium-gold)]">/turnos</span> no habrá confirmación ni pago:
                  verán la agenda y un botón para consultar por WhatsApp con el horario elegido.
                </>
              )}
            </p>
            {saveError ? (
              <p className="mt-3 rounded-xl border border-red-500/35 bg-red-950/35 px-3 py-2 text-[12px] text-red-200/95">
                {saveError}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                disabled={saving}
                className="inline-flex h-9 items-center rounded-xl border border-white/15 px-3 text-[12px] font-semibold text-[var(--soft-gray)]/85 transition hover:bg-white/5 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void applyMode(confirmTarget)}
                disabled={saving}
                className="inline-flex h-9 items-center rounded-xl border border-[var(--premium-gold)]/45 bg-[var(--premium-gold)]/15 px-3 text-[12px] font-semibold text-[var(--premium-gold)] transition hover:bg-[var(--premium-gold)]/22 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Sí, cambiar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
