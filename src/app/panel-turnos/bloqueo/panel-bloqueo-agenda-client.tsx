"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { BookingPicker } from "@/components/booking/booking-picker";
import {
  PANEL_WEEK_LETTERS,
  buildPanelMonthGrid,
  panelMonthTitle,
} from "@/lib/booking/panel-month-grid";
import { parseDateKeyLocal } from "@/lib/booking/agenda-blocks-shared";
import { formatSalonDisplayDate, getAvailableTimesForDate, getSalonWorkDayBlockRange, SALON_TREATMENT_OPTIONS } from "@/lib/booking/salon-availability";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseYmdToYearMonth(ymd: string): { y: number; m: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  }
  return { y: Number(m[1]), m: Number(m[2]) };
}

function hhmmToMinutes(hhmm: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

/** Un solo espacio de trabajo: los bloqueos son siempre de todo el salón/cabina. */
const BLOCK_SCOPE = "salon" as const;

export function PanelBloqueoAgendaClient() {
  const router = useRouter();
  const anchorInit = todayYmd();
  const { y: initY, m: initM } = parseYmdToYearMonth(anchorInit);

  const [anchorDateKey, setAnchorDateKey] = useState(anchorInit);
  const [calYear, setCalYear] = useState(initY);
  const [calMonth, setCalMonth] = useState(initM);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarWrapRef = useRef<HTMLDivElement>(null);
  const [untilCalYear, setUntilCalYear] = useState(initY);
  const [untilCalMonth, setUntilCalMonth] = useState(initM);
  const [untilCalendarOpen, setUntilCalendarOpen] = useState(false);
  const untilCalendarWrapRef = useRef<HTMLDivElement>(null);
  const untilCalendarPanelRef = useRef<HTMLDivElement>(null);

  const [timeLocal, setTimeLocal] = useState("14:00");
  const [endTimeLocal, setEndTimeLocal] = useState("15:30");
  const [blockKind, setBlockKind] = useState<"salon" | "services">("salon");
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<string[]>([]);
  /** Id “activo” para el picker (categoría del modal, etc.); la lista bloqueada es `selectedTreatmentIds`. */
  const [pickerTreatmentId, setPickerTreatmentId] = useState("");
  /** Se incrementa al elegir “Solo algunos tratamientos” para abrir el modal del picker al instante. */
  const [treatmentPickerOpenNonce, setTreatmentPickerOpenNonce] = useState(0);
  const [timeMode, setTimeMode] = useState<"all_day" | "custom">("custom");
  const [recurrenceType, setRecurrenceType] = useState<"once" | "weekly">("once");
  const [untilDateKey, setUntilDateKey] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grid = useMemo(() => buildPanelMonthGrid(calYear, calMonth), [calYear, calMonth]);
  const untilGrid = useMemo(() => buildPanelMonthGrid(untilCalYear, untilCalMonth), [untilCalYear, untilCalMonth]);

  useEffect(() => {
    if (!calendarOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (calendarWrapRef.current && !calendarWrapRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [calendarOpen]);

  useEffect(() => {
    if (!untilCalendarOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (untilCalendarWrapRef.current && !untilCalendarWrapRef.current.contains(e.target as Node)) {
        setUntilCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [untilCalendarOpen]);

  useEffect(() => {
    if (!untilCalendarOpen) return;
    const t = window.setTimeout(() => {
      untilCalendarPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 0);
    return () => window.clearTimeout(t);
  }, [untilCalendarOpen]);

  useEffect(() => {
    if (recurrenceType === "once") {
      setUntilDateKey("");
      setUntilCalendarOpen(false);
    }
  }, [recurrenceType]);

  useEffect(() => {
    const u = untilDateKey.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(u)) return;
    if (u < anchorDateKey) setUntilDateKey("");
  }, [anchorDateKey, untilDateKey]);

  const durationMinutes = useMemo(() => {
    const start = hhmmToMinutes(timeLocal);
    const end = hhmmToMinutes(endTimeLocal);
    if (start === null || end === null) return 0;
    if (end <= start) return 0;
    return end - start;
  }, [timeLocal, endTimeLocal]);

  const workDayRange = useMemo(() => getSalonWorkDayBlockRange(anchorDateKey), [anchorDateKey]);

  const anchorWeekdayLong = useMemo(() => {
    const d = parseDateKeyLocal(anchorDateKey);
    if (!d) return "";
    const raw = d.toLocaleDateString("es-AR", { weekday: "long" });
    return raw ? raw.charAt(0).toLocaleUpperCase("es-AR") + raw.slice(1) : "";
  }, [anchorDateKey]);

  const cuandoResumen = useMemo(() => {
    const fecha = formatSalonDisplayDate(anchorDateKey);
    if (recurrenceType === "once") {
      return `Solo el ${fecha}.`;
    }
    const hasta = untilDateKey.trim();
    const hastaOk = /^\d{4}-\d{2}-\d{2}$/.test(hasta);
    if (!hastaOk) {
      return `Cada ${anchorWeekdayLong || "ese día"} desde el ${fecha} (sin fin).`;
    }
    return `Cada ${anchorWeekdayLong || "ese día"}, del ${fecha} al ${formatSalonDisplayDate(hasta)}.`;
  }, [anchorDateKey, recurrenceType, untilDateKey, anchorWeekdayLong]);

  const selectedServices = useMemo(
    () =>
      selectedTreatmentIds.flatMap((id) => {
        const o = SALON_TREATMENT_OPTIONS.find((x) => x.id === id);
        return o ? [o] : [];
      }),
    [selectedTreatmentIds],
  );
  const selectedServicesSummary = useMemo(() => selectedServices.map((s) => s.name).join(" + "), [selectedServices]);

  useEffect(() => {
    if (blockKind !== "services") return;
    if (selectedTreatmentIds.length === 0) {
      setPickerTreatmentId("");
      return;
    }
    if (!pickerTreatmentId.trim() || !selectedTreatmentIds.includes(pickerTreatmentId)) {
      setPickerTreatmentId(selectedTreatmentIds[0] ?? "");
    }
  }, [blockKind, selectedTreatmentIds, pickerTreatmentId]);

  useEffect(() => {
    if (blockKind === "salon") {
      setSelectedTreatmentIds([]);
      setPickerTreatmentId("");
    }
  }, [blockKind]);

  const canSubmit = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(anchorDateKey)) return false;
    if (blockKind === "services" && selectedTreatmentIds.length === 0) return false;
    if (timeMode === "all_day") {
      if (!workDayRange) return false;
    } else {
      if (!/^\d{2}:\d{2}$/.test(timeLocal) || !/^\d{2}:\d{2}$/.test(endTimeLocal)) return false;
      if (durationMinutes < 15 || durationMinutes > 12 * 60) return false;
    }
    if (recurrenceType === "weekly" && untilDateKey.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(untilDateKey.trim())) {
      return false;
    }
    return true;
  }, [
    anchorDateKey,
    blockKind,
    selectedTreatmentIds,
    timeMode,
    workDayRange,
    timeLocal,
    endTimeLocal,
    durationMinutes,
    recurrenceType,
    untilDateKey,
  ]);

  function openCalendar() {
    setUntilCalendarOpen(false);
    const { y, m } = parseYmdToYearMonth(anchorDateKey);
    setCalYear(y);
    setCalMonth(m);
    setCalendarOpen(true);
  }

  function toggleCalendar() {
    if (calendarOpen) {
      setCalendarOpen(false);
    } else {
      openCalendar();
    }
  }

  function openUntilCalendar() {
    setCalendarOpen(false);
    const u = untilDateKey.trim();
    const uOk = /^\d{4}-\d{2}-\d{2}$/.test(u) && u >= anchorDateKey;
    const base = uOk ? u : anchorDateKey;
    const { y, m } = parseYmdToYearMonth(base);
    setUntilCalYear(y);
    setUntilCalMonth(m);
    setUntilCalendarOpen(true);
  }

  function toggleUntilCalendar() {
    if (untilCalendarOpen) {
      setUntilCalendarOpen(false);
    } else {
      openUntilCalendar();
    }
  }

  function prevCalMonth() {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
      return;
    }
    setCalMonth((mo) => mo - 1);
  }

  function nextCalMonth() {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
      return;
    }
    setCalMonth((mo) => mo + 1);
  }

  function prevUntilCalMonth() {
    if (untilCalMonth === 1) {
      setUntilCalMonth(12);
      setUntilCalYear((y) => y - 1);
      return;
    }
    setUntilCalMonth((mo) => mo - 1);
  }

  function nextUntilCalMonth() {
    if (untilCalMonth === 12) {
      setUntilCalMonth(1);
      setUntilCalYear((y) => y + 1);
      return;
    }
    setUntilCalMonth((mo) => mo + 1);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/panel-turnos/agenda-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          anchorDateKey,
          timeLocal: timeMode === "all_day" ? (workDayRange?.timeLocal ?? "09:00") : timeLocal,
          durationMinutes: timeMode === "all_day" ? (workDayRange?.durationMinutes ?? 1) : durationMinutes,
          scope: BLOCK_SCOPE,
          recurrenceType,
          untilDateKey: recurrenceType === "weekly" && untilDateKey.trim() ? untilDateKey.trim() : null,
          notes: notes.trim() || null,
          blockedTreatmentIds: blockKind === "services" ? selectedTreatmentIds : null,
          timeMode,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar.");
        return;
      }
      router.push("/panel-turnos");
    } catch {
      setError("Error de red. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] pb-24 text-[var(--soft-gray)]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/panel-turnos"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#171717] text-[var(--soft-gray)]/80 hover:bg-[#1d1d1d]"
            aria-label="Volver al panel"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/90 to-orange-700/90 text-white shadow-[0_8px_22px_rgba(180,83,9,0.35)]">
              <Lock className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-[20px] leading-tight text-[var(--premium-gold)]">Bloqueo de agenda</h1>
              <p className="text-[12px] text-[var(--soft-gray)]/55">Profesional ausente o cabina ocupada</p>
            </div>
          </div>
        </header>

        <section className="space-y-4 overflow-visible rounded-[28px] border border-white/8 bg-[#171717] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.38)]">
          <fieldset>
            <legend className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55">Tipo de bloqueo</legend>
            <div className="mt-2 space-y-2">
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition ${
                  blockKind === "salon" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="blockKind"
                    checked={blockKind === "salon"}
                    onChange={() => setBlockKind("salon")}
                    className="accent-[var(--premium-gold)]"
                  />
                  <span className="text-[14px] font-medium text-[var(--soft-gray)]">Todos los tratamientos</span>
                </div>
                <span className="mt-1 pl-6 text-[11px] leading-snug text-[var(--soft-gray)]/50">
                  Nadie puede reservar ningún tratamiento en esa franja.
                </span>
              </label>
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition ${
                  blockKind === "services" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="blockKind"
                    checked={blockKind === "services"}
                    onChange={() => {
                      setBlockKind("services");
                      setTreatmentPickerOpenNonce((n) => n + 1);
                    }}
                    className="accent-[var(--premium-gold)]"
                  />
                  <span className="text-[14px] font-medium text-[var(--soft-gray)]">Solo algunos tratamientos</span>
                </div>
                <span className="mt-1 pl-6 text-[11px] leading-snug text-[var(--soft-gray)]/50">
                  El resto de servicios sigue disponible en el mismo horario.
                </span>
              </label>
            </div>
          </fieldset>

          {blockKind === "services" ? (
            <div className="rounded-xl border border-white/10 bg-[#141414] px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55">Tratamientos afectados</p>
                  {selectedServices.length > 0 ? (
                    <>
                      <p
                        className="mt-1 line-clamp-3 text-[13px] font-medium leading-snug text-[var(--soft-gray)]"
                        title={selectedServicesSummary}
                      >
                        {selectedServicesSummary}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--soft-gray)]/48">
                        {selectedServices.length} seleccionado{selectedServices.length === 1 ? "" : "s"}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-[12px] leading-snug text-[var(--soft-gray)]/55">
                      Abrí la lista para indicar qué tratamientos quedan bloqueados en esta franja.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setTreatmentPickerOpenNonce((n) => n + 1)}
                  className="shrink-0 rounded-lg border border-amber-500/35 bg-gradient-to-br from-amber-500/18 to-orange-800/15 px-3 py-2 text-[12px] font-semibold tracking-tight text-amber-100/95 shadow-[0_6px_16px_rgba(0,0,0,0.25)] transition hover:from-amber-500/28 hover:to-orange-800/25"
                >
                  Lista
                </button>
              </div>
              <BookingPicker
                showDateAndTimePickers={false}
                hideTreatmentTriggerButton
                treatmentModalVariant="panel"
                openTreatmentModalRequestId={treatmentPickerOpenNonce}
                selectedTreatmentId={pickerTreatmentId}
                onTreatmentIdChange={setPickerTreatmentId}
                selectedDate=""
                onDateChange={() => {}}
                selectedTime=""
                onTimeChange={() => {}}
                bookingContext="panel"
                treatmentFirstHintVisible={false}
                onTreatmentFirstHintVisible={() => {}}
                monthAvailabilityServiceIds={selectedTreatmentIds}
                multiSelect
                selectedTreatmentIds={selectedTreatmentIds}
                onToggleTreatmentId={(id) => {
                  setSelectedTreatmentIds((prev) =>
                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                  );
                }}
                onClearTreatmentIds={() => {
                  setSelectedTreatmentIds([]);
                  setPickerTreatmentId("");
                }}
                summaryTitle={selectedServices.length > 0 ? selectedServicesSummary : undefined}
                comboHintText="Misma lista que en reservas: categorías y resumen arriba."
              />
            </div>
          ) : null}

          <section
            className="space-y-3 rounded-xl border border-white/10 bg-[#141414]/70 p-3.5"
            aria-labelledby="cuando-bloqueo-heading"
          >
            <div>
              <h2 id="cuando-bloqueo-heading" className="text-[13px] font-semibold tracking-tight text-[var(--premium-gold)]">
                Cuándo
              </h2>
              <p className="mt-1 text-[11px] leading-snug text-[var(--soft-gray)]/55">
                Fecha y repetición. En <span className="font-medium text-[var(--soft-gray)]/70">/turnos</span> se ocultan
                cupos en la misma franja que elijas en Horario.
              </p>
            </div>

            <fieldset>
              <legend className="sr-only">Recurrencia</legend>
              <div className="space-y-2">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
                    recurrenceType === "once" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="recurrence"
                    checked={recurrenceType === "once"}
                    onChange={() => setRecurrenceType("once")}
                    className="accent-[var(--premium-gold)]"
                  />
                  <div className="min-w-0">
                    <span className="text-[14px] font-medium text-[var(--soft-gray)]">Una sola vez</span>
                    <p className="mt-0.5 text-[11px] text-[var(--soft-gray)]/48">Solo el día que elijas.</p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 transition ${
                    recurrenceType === "weekly" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="recurrence"
                    checked={recurrenceType === "weekly"}
                    onChange={() => setRecurrenceType("weekly")}
                    className="accent-[var(--premium-gold)]"
                  />
                  <div className="min-w-0">
                    <span className="text-[14px] font-medium text-[var(--soft-gray)]">Cada semana</span>
                    <p className="mt-0.5 text-[11px] text-[var(--soft-gray)]/48">Mismo día de la semana que la fecha.</p>
                  </div>
                </label>
              </div>
            </fieldset>

            <div ref={calendarWrapRef} className="relative border-t border-white/8 pt-3">
              <p className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55" id="fecha-bloqueo-label">
                {recurrenceType === "once" ? "Fecha" : "Primera fecha"}
              </p>
              <button
                type="button"
                id="fecha-bloqueo-trigger"
                aria-labelledby="fecha-bloqueo-label"
                aria-expanded={calendarOpen}
                aria-haspopup="dialog"
                onClick={toggleCalendar}
                className="mt-1.5 flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-left text-[15px] text-[var(--soft-gray)] outline-none transition hover:border-white/16 focus:border-[var(--premium-gold)]/55"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[var(--premium-gold)]/85" strokeWidth={1.85} />
                  <span className="truncate">{formatSalonDisplayDate(anchorDateKey)}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--soft-gray)]/55 transition ${calendarOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              {calendarOpen ? (
                <div
                  role="dialog"
                  aria-label="Elegir fecha"
                  className="absolute z-50 mt-2 w-full rounded-[28px] border border-white/8 bg-[#171717] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                >
                  <div className="relative mb-3 flex items-center justify-center px-10">
                    <button
                      type="button"
                      onClick={prevCalMonth}
                      className="absolute left-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[var(--soft-gray)]/70 hover:bg-white/5 hover:text-[var(--soft-gray)]"
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-center text-[15px] font-semibold capitalize tracking-tight text-[var(--soft-gray)]">
                      {panelMonthTitle(calYear, calMonth)}
                    </span>
                    <button
                      type="button"
                      onClick={nextCalMonth}
                      className="absolute right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[var(--soft-gray)]/70 hover:bg-white/5 hover:text-[var(--soft-gray)]"
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold tracking-wide text-[var(--soft-gray)]/45">
                    {PANEL_WEEK_LETTERS.map((L) => (
                      <div key={L} className="py-2">
                        {L}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-2 text-center">
                    {grid.map((cell) => {
                      const sel = cell.dateKey === anchorDateKey;
                      const hasSlots = getAvailableTimesForDate(cell.dateKey).length > 0;
                      const isDisabled = !cell.inMonth || !hasSlots;
                      return (
                        <button
                          key={`${cell.dateKey}-${cell.inMonth}-${cell.day}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            setAnchorDateKey(cell.dateKey);
                            const { y, m } = parseYmdToYearMonth(cell.dateKey);
                            setCalYear(y);
                            setCalMonth(m);
                            setCalendarOpen(false);
                          }}
                          className="flex w-full flex-col items-center py-1 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <span
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold leading-none transition",
                              cell.inMonth ? "text-[var(--soft-gray)]" : "text-[var(--soft-gray)]/30",
                              sel
                                ? "bg-gradient-to-br from-[var(--accent-coral)] to-[var(--accent-orange)] text-white shadow-[0_8px_24px_rgba(201,169,106,0.35)]"
                                : isDisabled
                                  ? "opacity-40"
                                  : "hover:bg-white/5",
                            ].join(" ")}
                          >
                            {cell.day}
                          </span>
                          <span className="mt-0.5 block h-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {recurrenceType === "weekly" ? (
              <div className="space-y-2">
                {anchorWeekdayLong ? (
                  <p className="text-[11px] leading-snug text-amber-200/88">
                    Cada <span className="font-semibold">{anchorWeekdayLong}</span> desde{" "}
                    {formatSalonDisplayDate(anchorDateKey)}. Igual en /turnos.
                  </p>
                ) : (
                  <p className="text-[11px] text-[var(--soft-gray)]/50">Elegí la primera fecha arriba.</p>
                )}
                <div className="rounded-lg border border-white/8 bg-black/20 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] text-[var(--soft-gray)]/55" id="hasta-fecha-label">
                      Hasta (opcional)
                    </p>
                    {untilDateKey.trim() && /^\d{4}-\d{2}-\d{2}$/.test(untilDateKey.trim()) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setUntilDateKey("");
                          setUntilCalendarOpen(false);
                        }}
                        className="shrink-0 cursor-pointer text-[11px] font-medium text-amber-200/90 underline-offset-2 hover:underline"
                      >
                        Quitar
                      </button>
                    ) : null}
                  </div>
                  <div ref={untilCalendarWrapRef} className="relative mt-1.5">
                    <button
                      type="button"
                      aria-labelledby="hasta-fecha-label"
                      aria-expanded={untilCalendarOpen}
                      aria-haspopup="dialog"
                      onClick={toggleUntilCalendar}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-left text-[15px] text-[var(--soft-gray)] outline-none transition hover:border-white/16 focus:border-[var(--premium-gold)]/55"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[var(--premium-gold)]/85" strokeWidth={1.85} />
                        <span className="truncate">
                          {untilDateKey.trim() && /^\d{4}-\d{2}-\d{2}$/.test(untilDateKey.trim())
                            ? formatSalonDisplayDate(untilDateKey.trim())
                            : "Sin fecha de fin"}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[var(--soft-gray)]/55 transition ${untilCalendarOpen ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>

                    {untilCalendarOpen ? (
                      <div
                        ref={untilCalendarPanelRef}
                        role="dialog"
                        aria-label="Elegir última fecha de la serie"
                        className="absolute z-50 mt-2 w-full rounded-[28px] border border-white/8 bg-[#171717] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                      >
                        <div className="relative mb-3 flex items-center justify-center px-10">
                          <button
                            type="button"
                            onClick={prevUntilCalMonth}
                            className="absolute left-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[var(--soft-gray)]/70 hover:bg-white/5 hover:text-[var(--soft-gray)]"
                            aria-label="Mes anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <span className="text-center text-[15px] font-semibold capitalize tracking-tight text-[var(--soft-gray)]">
                            {panelMonthTitle(untilCalYear, untilCalMonth)}
                          </span>
                          <button
                            type="button"
                            onClick={nextUntilCalMonth}
                            className="absolute right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[var(--soft-gray)]/70 hover:bg-white/5 hover:text-[var(--soft-gray)]"
                            aria-label="Mes siguiente"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold tracking-wide text-[var(--soft-gray)]/45">
                          {PANEL_WEEK_LETTERS.map((L) => (
                            <div key={`until-h-${L}`} className="py-2">
                              {L}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-2 text-center">
                          {untilGrid.map((cell) => {
                            const uOk = untilDateKey.trim() && /^\d{4}-\d{2}-\d{2}$/.test(untilDateKey.trim());
                            const sel = uOk && cell.dateKey === untilDateKey.trim();
                            const hasSlots = getAvailableTimesForDate(cell.dateKey).length > 0;
                            const beforeAnchor = cell.dateKey < anchorDateKey;
                            const isDisabled = !cell.inMonth || !hasSlots || beforeAnchor;
                            return (
                              <button
                                key={`until-${cell.dateKey}-${cell.inMonth}-${cell.day}`}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => {
                                  setUntilDateKey(cell.dateKey);
                                  const { y, m } = parseYmdToYearMonth(cell.dateKey);
                                  setUntilCalYear(y);
                                  setUntilCalMonth(m);
                                  setUntilCalendarOpen(false);
                                }}
                                className="flex w-full flex-col items-center py-1 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <span
                                  className={[
                                    "flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold leading-none transition",
                                    cell.inMonth ? "text-[var(--soft-gray)]" : "text-[var(--soft-gray)]/30",
                                    sel
                                      ? "bg-gradient-to-br from-[var(--accent-coral)] to-[var(--accent-orange)] text-white shadow-[0_8px_24px_rgba(201,169,106,0.35)]"
                                      : isDisabled
                                        ? "opacity-40"
                                        : "hover:bg-white/5",
                                  ].join(" ")}
                                >
                                  {cell.day}
                                </span>
                                <span className="mt-0.5 block h-2" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[10px] leading-snug text-[var(--soft-gray)]/45">
                    Mismo calendario que arriba; no podés elegir antes de la primera fecha. Vacío = sin fin.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[var(--soft-gray)]/52">Solo ese día; el resto no cambia.</p>
            )}

            <p
              className="rounded-md border border-white/8 bg-black/25 px-2.5 py-1.5 text-[11px] leading-snug text-[var(--soft-gray)]/68"
              role="status"
            >
              {cuandoResumen}
            </p>
          </section>

          <fieldset>
            <legend className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55">Horario</legend>
            <div className="mt-2 space-y-2">
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition ${
                  timeMode === "all_day" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeMode"
                    checked={timeMode === "all_day"}
                    onChange={() => setTimeMode("all_day")}
                    className="accent-[var(--premium-gold)]"
                  />
                  <span className="text-[14px] font-medium text-[var(--soft-gray)]">Todo el día laboral</span>
                </div>
                <span className="mt-1 pl-6 text-[11px] leading-snug text-[var(--soft-gray)]/50">
                  Desde el primer turno del día hasta el cierre de agenda (misma regla que los turnos online).
                </span>
              </label>
              <label
                className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition ${
                  timeMode === "custom" ? "border-[var(--premium-gold)]/55 bg-black/25" : "border-white/8 bg-black/15"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeMode"
                    checked={timeMode === "custom"}
                    onChange={() => setTimeMode("custom")}
                    className="accent-[var(--premium-gold)]"
                  />
                  <span className="text-[14px] font-medium text-[var(--soft-gray)]">Franja personalizada</span>
                </div>
              </label>
            </div>
          </fieldset>

          {timeMode === "all_day" ? (
            <div className="rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-[13px] text-[var(--soft-gray)]/85">
              {workDayRange ? (
                <p>
                  Se bloqueará desde <span className="font-semibold text-[var(--soft-gray)]">{workDayRange.timeLocal}</span>{" "}
                  durante <span className="font-semibold text-[var(--soft-gray)]">{workDayRange.durationMinutes} min</span>{" "}
                  (hasta el fin de jornada configurado en la agenda).
                </p>
              ) : (
                <p className="text-amber-200/90">Ese día no tiene horario de atención; elegí otra fecha o usá franja personalizada.</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55" htmlFor="startTime">
                  Hora de inicio
                </label>
                <input
                  id="startTime"
                  type="time"
                  step={900}
                  value={timeLocal}
                  onChange={(e) => setTimeLocal(e.target.value)}
                  className="mt-1.5 w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-[15px] outline-none focus:border-[var(--premium-gold)]/55"
                />
              </div>

              <div>
                <label className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55" htmlFor="endTime">
                  Hora de fin
                </label>
                <input
                  id="endTime"
                  type="time"
                  step={900}
                  value={endTimeLocal}
                  onChange={(e) => setEndTimeLocal(e.target.value)}
                  className="mt-1.5 w-full cursor-pointer rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-[15px] outline-none focus:border-[var(--premium-gold)]/55"
                />
                {durationMinutes > 0 && durationMinutes < 15 ? (
                  <p className="mt-1 text-[11px] text-amber-200/90">La franja debe durar al menos 15 minutos.</p>
                ) : null}
                {durationMinutes === 0 && hhmmToMinutes(timeLocal) !== null && hhmmToMinutes(endTimeLocal) !== null ? (
                  <p className="mt-1 text-[11px] text-amber-200/90">La hora de fin tiene que ser posterior a la de inicio.</p>
                ) : null}
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] tracking-[0.12em] text-[var(--soft-gray)]/55" htmlFor="notes">
              Nota interna (opcional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Capacitación / cierre administrativo"
              className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-[#141414] px-3 py-3 text-[14px] outline-none placeholder:text-[var(--soft-gray)]/35 focus:border-[var(--premium-gold)]/55"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/35 bg-red-950/35 px-3 py-2 text-[13px] text-red-200/95">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => void handleSubmit()}
            className="flex h-[52px] w-full cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 text-[16px] font-semibold text-white shadow-[0_10px_28px_rgba(180,83,9,0.35)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? "Guardando…" : "Guardar bloqueo"}
          </button>
        </section>
      </div>
    </div>
  );
}
