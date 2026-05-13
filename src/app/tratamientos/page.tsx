"use client";

import {
  CalendarDays,
  CircleDot,
  Gem,
  Home as HomeIcon,
  Percent,
  ScanLine,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  SALON_TREATMENTS,
  TREATMENT_CATEGORIES,
  type TreatmentCategory,
} from "@/lib/treatments/catalog";

const CATEGORY_INTROS: Partial<Record<TreatmentCategory, string>> = {
  "Freyja · Low Cost":
    "En Espacio Freyja el cuidado de la piel es posible para todas. Freyja Low Cost son tratamientos simples, conscientes y bien indicados, con la misma mirada profesional del espacio: no se trata de hacer menos, sino de hacer lo justo. No reemplazan sesiones avanzadas ni planes integrales.",
  "Freyja · Premium":
    "Sesiones de mayor profundidad cuando la piel necesita estímulo específico, regeneración o trabajo más intenso. Todos los Premium se realizan previo diagnóstico. No se indican por moda: se eligen cuando la piel lo necesita.",
  "Alta energía":
    "Tecnologías que trabajan en planos profundos; siempre indicadas por diagnóstico y pueden integrar planes de cuidado facial o corporal.",
  Corporal: "Tratamientos corporales orientados a definición, drenaje y calidad del tejido, según indicación profesional.",
  Láser:
    "Depilación láser definitiva en sesiones de 15′ o 30′ según zona; valor y plan según evaluación en consulta.",
};

function CategoryIcon({ category }: { category: TreatmentCategory }) {
  const cls = "h-7 w-7 text-[var(--premium-gold)]";
  if (category === "Freyja · Low Cost") return <Sparkles className={cls} strokeWidth={1.9} />;
  if (category === "Freyja · Premium") return <Gem className={cls} strokeWidth={1.9} />;
  if (category === "Alta energía") return <Zap className={cls} strokeWidth={1.9} />;
  if (category === "Corporal") return <ScanLine className={cls} strokeWidth={1.9} />;
  return <CircleDot className={cls} strokeWidth={1.9} />;
}

export default function TreatmentsPage() {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory>("Freyja · Low Cost");

  const filteredServices = useMemo(
    () => SALON_TREATMENTS.filter((service) => service.category === activeCategory),
    [activeCategory],
  );

  const intro = CATEGORY_INTROS[activeCategory];

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-24">
        <header className="mb-4 text-center">
          <h1 className="text-[34px] leading-none font-heading">Tratamientos</h1>
        </header>

        <p className="mb-3 text-center text-[11px] leading-relaxed text-[var(--soft-gray)]/90">
          Espacio Freyja · Carla Bruni, dermocosmiatra — no es lo mismo que cosmetología. Valores y tiempos orientativos; la indicación
          final es siempre personalizada.
        </p>

        <section className="mb-2 flex items-center gap-2 overflow-x-auto pb-1">
          {TREATMENT_CATEGORIES.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
                    : "bg-transparent text-[var(--soft-gray)]/75"
                }`}
              >
                {category}
              </button>
            );
          })}
        </section>

        {intro ? (
          <p className="mb-4 text-[11px] leading-relaxed text-[var(--soft-gray)]/88">{intro}</p>
        ) : null}

        <section className="grid grid-cols-2 gap-3">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#2e2f30] shadow-[0_8px_22px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-32 shrink-0 overflow-hidden bg-[#252526]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(201,169,106,0.2),transparent_46%),linear-gradient(135deg,#2a2a2b_0%,#232324_58%,#1e1e1f_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <CategoryIcon category={service.category} />
                </div>
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-b from-transparent to-[#2e2f30]" />
              </div>

              <div className="relative z-10 -mt-2 flex min-h-0 flex-1 flex-col px-3 pt-0 pb-3">
                <h2 className="text-[15px] leading-tight font-heading">{service.name}</h2>
                <p className="mt-1 line-clamp-4 text-[10px] leading-tight text-[var(--soft-gray)]/85">
                  {service.description}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.06em] text-[var(--soft-gray)]/70">{service.subtitle}</p>

                <div className="mt-auto pt-2">
                  <Link
                    href={`/turnos?treatment=${encodeURIComponent(service.name)}`}
                    className="flex h-8 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--premium-gold)] text-[13px] font-medium text-[var(--on-accent)]"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-[var(--soft-gray)]/65">
          Regla Freyja: la tecnología no se vende. Se indica.
        </p>
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-30">
        <div className="flex w-full items-center justify-between border-t border-[var(--border-subtle)] bg-black/50 px-4 py-2.5 backdrop-blur-[16px]">
          <Link href="/" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <HomeIcon className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.9} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--soft-gray)]/80">Inicio</span>
          </Link>
          <Link href="/tratamientos" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <Sparkles className="h-5 w-5 text-[var(--premium-gold)]" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--premium-gold)]">Tratamientos</span>
          </Link>
          <Link href="/turnos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <CalendarDays className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Turnos</span>
          </Link>
          <Link href="/promociones" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <Percent className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Promos</span>
          </Link>
          <Link href="/perfil" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <User className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
