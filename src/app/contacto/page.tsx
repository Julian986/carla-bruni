"use client";

import {
  CalendarDays,
  Home as HomeIcon,
  Instagram,
  MapPin,
  Percent,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 3.1c-4.9 0-8.9 3.9-8.9 8.8 0 1.6.4 3.1 1.3 4.4L3 21l4.9-1.3c1.3.7 2.7 1.1 4.1 1.1 4.9 0 8.9-3.9 8.9-8.8C20.9 7 16.9 3.1 12 3.1zm0 15.7c-1.3 0-2.5-.3-3.6-.9l-.3-.2-2.9.8.8-2.8-.2-.3c-.8-1.1-1.2-2.4-1.2-3.8C4.6 8 7.9 4.8 12 4.8s7.4 3.2 7.4 7.2-3.3 7.2-7.4 7.2zm4-5.2c-.2-.1-1.1-.6-1.2-.6-.2-.1-.3-.1-.5.1-.1.2-.6.7-.7.8-.1.1-.3.2-.5.1-.2-.1-.8-.3-1.5-.9-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.5-1.2-.7-1.6-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.1.9 2.3.1.2 1.6 2.4 3.8 3.3.5.2.9.3 1.2.4.5.2 1 .2 1.3.1.4-.1 1.1-.4 1.3-.9.2-.5.2-1 .2-1.1-.1-.1-.2-.2-.4-.3z"
      />
    </svg>
  );
}

type ContactItem = {
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
};

/** Solo dígitos para wa.me (Argentina: 54 + 9 + código de área + número). */
const WHATSAPP_PHONE_E164 = "5492236164271";
const WHATSAPP_DISPLAY = "223-6164271";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_PHONE_E164}`;
const INSTAGRAM_HREF = "https://www.instagram.com/freyja.skinbarstudio/";
/** Ubicación Espacio Freyja (Google Maps). */
const MAPS_HREF = "https://maps.app.goo.gl/QHSzQD7idPPTGKNp9";
const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.0110040597237!2d-57.54634909999999!3d-38.0002038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dd00052cf08f%3A0xa348da825832e30a!2sEspacio%20Freyja%20%E2%80%93%20by%20Carla%20Bruni!5e0!3m2!1ses!2sar!4v1778698252936!5m2!1ses!2sar";

const contactItems: ContactItem[] = [
  {
    label: "Dirección",
    description: "Santiago del Estero 1741, Mar del Plata · piso 2",
    icon: MapPin,
    href: MAPS_HREF,
  },
  {
    label: "WhatsApp",
    description: WHATSAPP_DISPLAY,
    icon: WhatsappIcon,
    href: WHATSAPP_HREF,
  },
  {
    label: "Instagram",
    description: "@freyja.skinbarstudio · DM",
    icon: Instagram,
    href: INSTAGRAM_HREF,
  },
  // {
  //   label: "Horarios",
  //   description: "Ver detalle de horarios de atención",
  //   icon: CalendarClock,
  // },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-24">
        <header className="mb-5 text-center">
          <h1 className="text-[28px] leading-none font-heading">Contacto</h1>
        </header>

        <section className="mb-4 rounded-2xl border border-white/8 bg-[#181818] px-3 py-1.5 shadow-[0_14px_30px_rgba(0,0,0,0.65)]">
          <div className="divide-y divide-white/10">
            {contactItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <div className="flex items-center justify-between px-1 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-black/35">
                      <Icon
                        className={`text-[var(--soft-gray)]/85 ${
                          item.label === "WhatsApp" ? "h-5 w-5" : "h-4.5 w-4.5"
                        }`}
                        strokeWidth={1.7}
                      />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-[var(--soft-gray)]">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--soft-gray)]/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--soft-gray)]/50">›</span>
                </div>
              );

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/6 bg-[#141414] p-3">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--soft-gray)]/70">
            Ubicación en mapa
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--soft-gray)]/80">
            Espacio Freyja · Santiago del Estero 1741, Mar del Plata (piso 2).
          </p>
          <div className="relative mt-3 w-full overflow-hidden rounded-xl border border-white/10 pb-[75%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <iframe
              src={MAPS_EMBED_SRC}
              title="Ubicación Espacio Freyja – by Carla Bruni, Mar del Plata"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Link
            href={MAPS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-white/14 bg-black/25 text-[13px] font-medium tracking-[0.08em] text-[var(--foreground)]"
          >
            Abrir en Google Maps
          </Link>
        </section>

        {/*
        <section
          id="detalle-horarios"
          className="mt-4 rounded-2xl border border-white/8 bg-[#181818] p-3"
        >
          <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--soft-gray)]/70">
            Detalle de horarios
          </p>
          <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] text-[var(--soft-gray)]/80">
            <p className="font-semibold text-[var(--premium-gold)]">
              Horarios en los que NO se toman turnos
            </p>
            <p>Lunes y miércoles · cerrado</p>
            <p className="mt-2 font-semibold text-[var(--premium-gold)]">Horarios disponibles para turnos</p>
            <p>Martes · 8:30–16:30</p>
            <p>Jueves y viernes · 9:00–18:00</p>
            <p>Sábados · 9:00–15:00</p>
          </div>
        </section>
        */}
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-30">
        <div className="flex w-full items-center justify-between border-t border-[var(--border-subtle)] bg-black/50 px-4 py-2.5 backdrop-blur-[16px]">
          <Link href="/" className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <HomeIcon className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.9} />
            <span className="text-[9px] tracking-[0.12em] text-[var(--soft-gray)]/80">
              Inicio
            </span>
          </Link>
          <Link
            href="/tratamientos"
            className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80"
          >
            <Sparkles className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Tratamientos</span>
          </Link>
          <Link href="/turnos" className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80">
            <CalendarDays className="h-5 w-5 text-[var(--soft-gray)]/90" strokeWidth={1.8} />
            <span className="text-[9px] tracking-[0.12em]">Turnos</span>
          </Link>
          <Link
            href="/promociones"
            className="flex min-w-0 flex-1 flex-col items-center gap-1 text-[var(--soft-gray)]/80"
          >
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

