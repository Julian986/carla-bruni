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

import { TREATMENT_CATEGORIES, type TreatmentCategory } from "@/lib/treatments/catalog";

type Promo = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  category: TreatmentCategory;
};

/** Destacados informativos (sin packs ni combos armados). */
const promos: Promo[] = [
  {
    id: "destacado-esencial",
    title: "Freyja · Esencial",
    subtitle: "Low Cost · primer acercamiento consciente",
    details: "60′ · $42.000 · Ideal para mantener la piel sana y equilibrada.",
    category: "Freyja · Low Cost",
  },
  {
    id: "destacado-laser",
    title: "Depilación láser · sesión 30′",
    subtitle: "Zonas a definir en consulta",
    details: "Sesión de 30 minutos. Valor por zona según evaluación.",
    category: "Láser",
  },
  {
    id: "destacado-consulta",
    title: "FREYJA · Consulta, análisis y primera piel",
    subtitle: "El paso antes de cualquier plan",
    details: "90′ · $65.000 · Coach estético y experiencia Primera Piel.",
    category: "Freyja · Premium",
  },
];

function CategoryIcon({ category }: { category: TreatmentCategory }) {
  const cls = "h-8 w-8 text-[var(--premium-gold)]";
  if (category === "Freyja · Low Cost") return <Sparkles className={cls} strokeWidth={1.9} />;
  if (category === "Freyja · Premium") return <Gem className={cls} strokeWidth={1.9} />;
  if (category === "Alta energía") return <Zap className={cls} strokeWidth={1.9} />;
  if (category === "Corporal") return <ScanLine className={cls} strokeWidth={1.9} />;
  return <CircleDot className={cls} strokeWidth={1.9} />;
}

export default function PromotionsPage() {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategory>("Freyja · Low Cost");

  const filteredPromos = useMemo(
    () => promos.filter((promo) => promo.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-24">
        <header className="mb-4 text-center">
          <h1 className="text-[34px] leading-none font-heading">Destacados</h1>
        </header>

        <p className="mb-4 text-center text-[11px] leading-relaxed text-[var(--soft-gray)]/88">
          No trabajamos con combos armados: cada tratamiento se elige y cotiza según tu piel. Estos son ejemplos para
          reservar rápido; el detalle final lo vemos en consulta.
        </p>

        <section className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
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

        <section className="space-y-3">
          {filteredPromos.length === 0 ? (
            <p className="rounded-2xl border border-[var(--border-subtle)] bg-[#2e2f30] px-4 py-6 text-center text-[13px] text-[var(--soft-gray)]/85">
              En esta categoría no hay destacados fijos. Mirá todos los tratamientos o reservá consulta.
            </p>
          ) : (
            filteredPromos.map((promo) => (
              <article
                key={promo.id}
                className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#2e2f30] shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-0 grid grid-cols-[47%_53%]">
                  <div className="relative flex min-h-[148px] flex-col overflow-hidden border-r border-white/6 bg-[#252526]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(214,186,138,0.2),transparent_44%),linear-gradient(135deg,#2a2a2b_0%,#1e1e1f_62%,#1a1a1b_100%)]" />
                    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2">
                      <CategoryIcon category={promo.category} />
                      <span className="text-[10px] tracking-[0.12em] text-[var(--soft-gray)]/68">DESTACADO</span>
                    </div>
                  </div>
                  <div className="min-h-[148px] bg-[linear-gradient(180deg,#d4d4d4_0%,#c9caca_100%)]" />
                </div>

                <div className="relative z-10 ml-auto flex w-[53%] flex-col px-3 py-3">
                  <h2 className="text-[18px] leading-tight font-heading text-[#2a2928] sm:text-[20px]">{promo.title}</h2>
                  <p className="mt-1 text-[11px] text-[#3a3835]/88">{promo.subtitle}</p>
                  <p className="mt-1 text-[11px] leading-tight text-[#3a3835]/92">{promo.details}</p>
                  <div className="mt-3">
                    <Link
                      href={`/turnos?treatment=${encodeURIComponent(promo.title)}`}
                      className="flex h-9 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--premium-gold)] text-[13px] font-medium text-[var(--on-accent)]"
                    >
                      Reservar
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-30">
        <div className="flex w-full items-center justify-between border-t border-[var(--border-subtle)] bg-black/50 px-4 py-2.5 backdrop-blur-[16px]">
          <Link href="/" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <HomeIcon className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.9} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--soft-gray)]/80">Inicio</span>
          </Link>
          <Link href="/tratamientos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <Sparkles className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Tratamientos</span>
          </Link>
          <Link href="/turnos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <CalendarDays className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Turnos</span>
          </Link>
          <Link href="/promociones" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <Percent className="h-5 w-5 text-[var(--premium-gold)]" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--premium-gold)]">Promos</span>
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
