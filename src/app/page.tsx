"use client";

import { BrandLogo } from "@/components/brand-logo";
import { HOME_HERO_IMAGE_URL } from "@/lib/home-hero-image";
import { CalendarDays, Home as HomeIcon, Percent, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

let hasShownHomeSplash = false;

const SPLASH_MAX_MS = 900;
const SPLASH_MIN_VISIBLE_MS = 360;
const SPLASH_AFTER_LOAD_MS = 90;

function SplashScreen({ onLogoReady }: { onLogoReady: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex w-full max-w-md flex-col items-center px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <BrandLogo
              size="splash"
              fetchPriority="high"
              decoding="sync"
              onLoad={onLogoReady}
              onError={onLogoReady}
            />
            <div className="text-center text-2xl font-medium leading-tight tracking-[0.1em] font-heading">
              <span className="block">CARLA BRUNI</span>
              <span className="mt-1 block text-base tracking-[0.18em] text-[var(--soft-gray)]/95">
                Dermocosmetóloga y esteticista
              </span>
            </div>
            <div className="text-xs tracking-[0.22em] text-[var(--premium-gold)]/90">Espacio Freyja</div>
          </div>
        </div>

        {/* Frase */}
        <p className="max-w-xs text-center text-sm leading-relaxed text-[var(--soft-gray)]">
          Cuidado facial y corporal con criterio profesional, en tonos serenos y tecnología indicada — no vendida.
        </p>
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Fondo con foto: solo hasta md — en pantallas anchas el cover recorta mal una imagen vertical */}
      <div className="fixed top-0 right-0 left-0 z-0 h-[100svh] md:hidden">
        <Image
          src={HOME_HERO_IMAGE_URL}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="object-cover object-[center_35%] max-md:opacity-[0.5]"
          aria-hidden
        />
      </div>

      {/* Móvil: foto muy apagada pero perceptible — veladura un poco más liviana que antes */}
      <div
        className="pointer-events-none fixed top-0 right-0 left-0 z-10 h-[100svh] md:hidden"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(17,17,17,0.82) 0%, rgba(17,17,17,0.7) 28%, rgba(17,17,17,0.64) 52%, rgba(17,17,17,0.72) 78%, rgba(17,17,17,0.82) 100%)",
        }}
      />

      {/* Escritorio: base sólida + un halo dorado muy leve */}
      <div
        aria-hidden
        className="fixed top-0 right-0 left-0 z-0 hidden h-[100svh] bg-[var(--background)] md:block"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 110% 65% at 50% -10%, rgba(201,169,106,0.09), transparent 48%), linear-gradient(to bottom, #181818 0%, var(--background) 42%, #0d0d0d 100%)",
        }}
      />

      <main className="relative z-20 mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-28 md:pt-20">
        <header className="flex justify-center">
          <div className="inline-flex max-w-full flex-col items-center gap-1 text-center max-md:[text-shadow:0_1px_8px_rgba(0,0,0,0.35)] md:[text-shadow:none]">
            <BrandLogo size="header" />
            <div className="text-center text-[22px] font-medium leading-tight tracking-[0.1em] text-[var(--foreground)] font-heading">
              <span className="block">CARLA BRUNI</span>
              <span className="mt-0.5 block text-[15px] font-normal tracking-[0.14em] text-[var(--soft-gray)]/95">
                Dermocosmetóloga y esteticista
              </span>
            </div>
            <div className="text-[11px] tracking-[0.22em] text-[var(--premium-gold)]/90">Espacio Freyja</div>
          </div>
        </header>

        <div className="mt-12 space-y-4 md:mt-14">
          <section className="pb-1">
            <h1 className="sr-only">Carla Bruni · Espacio Freyja</h1>
            <div className="mx-auto flex w-[84%] flex-col gap-3">
              <Link
                href="/turnos"
                className="flex h-[52px] items-center justify-center rounded-full bg-[var(--premium-gold)] px-6 text-[16px] font-semibold tracking-[0.14em] text-[var(--on-accent)] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
              >
                Reservar turno
              </Link>
              <Link
                href="/tratamientos"
                className="flex h-[52px] items-center justify-center rounded-full border border-white/12 bg-[rgba(0,0,0,0.28)] px-6 text-[15px] font-medium tracking-[0.14em] text-[var(--foreground)] backdrop-blur-[8px] md:border-[color-mix(in_srgb,var(--premium-gold)_35%,transparent)] md:bg-[color-mix(in_srgb,var(--surface-raised)_88%,transparent)] md:backdrop-blur-0"
              >
                Tratamientos
              </Link>
              <Link
                href="/promociones"
                className="flex h-[52px] items-center justify-center rounded-full border border-white/12 bg-[rgba(0,0,0,0.28)] px-6 text-[15px] font-medium tracking-[0.14em] text-[var(--foreground)] backdrop-blur-[8px] md:border-[color-mix(in_srgb,var(--premium-gold)_35%,transparent)] md:bg-[color-mix(in_srgb,var(--surface-raised)_88%,transparent)] md:backdrop-blur-0"
              >
                Promociones
              </Link>
            </div>
          </section>

          <section className="mx-auto w-[84%] space-y-3">
            <Link
              href="/contacto"
              className="flex h-[52px] w-full items-center justify-center rounded-full border border-white/12 bg-[rgba(0,0,0,0.28)] px-6 text-[15px] font-medium tracking-[0.14em] text-[var(--foreground)] backdrop-blur-[8px] md:border-[color-mix(in_srgb,var(--premium-gold)_35%,transparent)] md:bg-[color-mix(in_srgb,var(--surface-raised)_88%,transparent)] md:backdrop-blur-0"
            >
              Contacto
            </Link>
          </section>

          <section className="mx-auto w-[84%]">
            <div className="mb-3 text-[10px] tracking-[0.24em] text-[var(--soft-gray)]/70">
              PROMOCION DESTACADA DEL MES
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[rgba(0,0,0,0.3)] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-[10px] md:border-[var(--border-subtle)] md:bg-[color-mix(in_srgb,var(--surface-raised)_92%,transparent)] md:backdrop-blur-[6px]">
              <div className="text-[10px] tracking-[0.24em] text-[var(--premium-gold)]">
                DESTACADO
              </div>
              <h2 className="mt-2 text-lg leading-tight text-[var(--foreground)] font-heading">
                Consulta, análisis y primera piel
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--soft-gray)]">
                Primer encuentro con diagnóstico, coach estético y experiencia Primera Piel (90′).
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <Link
                  href="/turnos?treatment=FREYJA%20%C2%B7%20Consulta%2C%20an%C3%A1lisis%20y%20primera%20piel"
                  className="flex h-10 items-center justify-center rounded-full bg-[var(--premium-gold)] px-5 text-[12px] font-semibold tracking-[0.14em] text-[var(--on-accent)]"
                >
                  Reservar ahora
                </Link>
                <span className="text-[10px] tracking-[0.08em] text-[var(--soft-gray)]/75">
                  Cupos limitados
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Barra inferior: fondo sólido (sin backdrop-blur: evita halo / “luz” sobre el contenido) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 isolate">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-full block h-14 bg-gradient-to-t from-[var(--background)] to-transparent md:hidden"
          aria-hidden
        />
        <div className="flex w-full items-center justify-between border-t border-white/12 bg-[var(--background)] px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-10px_28px_rgba(0,0,0,0.35)] md:border-[var(--border-subtle)] md:bg-[var(--background)] md:shadow-[0_-6px_20px_rgba(0,0,0,0.22)]">
          <button type="button" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <HomeIcon className="h-5 w-5 text-[var(--premium-gold)]" strokeWidth={1.9} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--premium-gold)]">Inicio</span>
          </button>
          <Link href="/tratamientos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--foreground)]/72">
            <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Tratamientos</span>
          </Link>
          <Link href="/turnos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--foreground)]/72">
            <CalendarDays className="h-5 w-5" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Turnos</span>
          </Link>
          <Link href="/promociones" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--foreground)]/72">
            <Percent className="h-5 w-5" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Promos</span>
          </Link>
          <Link href="/perfil" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--foreground)]/72">
            <User className="h-5 w-5" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(!hasShownHomeSplash);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);
  const openedAtRef = useRef(0);

  const dismissSplash = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (maxTimerRef.current !== null) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    hasShownHomeSplash = true;
    setShowSplash(false);
  }, []);

  useLayoutEffect(() => {
    if (hasShownHomeSplash || !showSplash) return;
    openedAtRef.current = Date.now();
  }, [showSplash]);

  useEffect(() => {
    if (hasShownHomeSplash) {
      setShowSplash(false);
      return;
    }
    if (!showSplash) return;
    maxTimerRef.current = setTimeout(dismissSplash, SPLASH_MAX_MS);
    return () => {
      if (maxTimerRef.current !== null) {
        clearTimeout(maxTimerRef.current);
        maxTimerRef.current = null;
      }
    };
  }, [showSplash, dismissSplash]);

  const handleSplashLogoReady = useCallback(() => {
    const elapsed = Date.now() - openedAtRef.current;
    const wait = Math.max(SPLASH_AFTER_LOAD_MS, SPLASH_MIN_VISIBLE_MS - elapsed);
    window.setTimeout(dismissSplash, wait);
  }, [dismissSplash]);

  if (showSplash) {
    return <SplashScreen onLogoReady={handleSplashLogoReady} />;
  }

  return <HomeContent />;
}
