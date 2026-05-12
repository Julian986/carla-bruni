"use client";

import type { ImgHTMLAttributes, MouseEventHandler } from "react";
import { useCallback, useState } from "react";

/** Logo en /public (usar en preload del layout). */
export const BRAND_LOGO_SRC = "/logo2.png";
export const BRAND_LOGO_SRC2 = "/logo.jpeg";

const LOGO_SOURCES = [BRAND_LOGO_SRC, BRAND_LOGO_SRC2] as const;

const sizeClass = {
  /** Pantalla de bienvenida: prioridad visual sobre el nombre (pedido de marca). */
  splash:
    "h-60 w-60 max-h-[min(68vw,320px)] max-w-[min(68vw,320px)] sm:h-[19rem] sm:w-[19rem] sm:max-h-[380px] sm:max-w-[380px]",
  /** Cabecera de inicio: logo claramente más grande que la línea «CARLA BRUNI». */
  header: "h-44 w-44 sm:h-[11.5rem] sm:w-[11.5rem]",
  /** Cabeceras de página secundarias */
  page: "h-28 w-28",
  compact: "h-24 w-24",
} as const;

export type BrandLogoSize = keyof typeof sizeClass;

type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "onClick"> & {
  size?: BrandLogoSize;
  alt?: string;
  /** Si lo pasás, se llama después de alternar el logo (evento del botón). */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function BrandLogo({
  size = "header",
  className = "",
  alt = "Carla Bruni · Dermocosmetóloga y esteticista",
  onClick: onClickProp,
  ...imgRest
}: BrandLogoProps) {
  const [logoIndex, setLogoIndex] = useState(0);

  const toggleLogo = useCallback(() => {
    setLogoIndex((i) => (i + 1) % LOGO_SOURCES.length);
  }, []);

  const src = LOGO_SOURCES[logoIndex];

  return (
    <button
      type="button"
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 ${sizeClass[size]} ${className}`.trim()}
      aria-label="Alternar entre dos versiones del logo"
      title="Tocá para ver el otro logo"
      onClick={(e) => {
        toggleLogo();
        onClickProp?.(e);
      }}
    >
      <img
        {...imgRest}
        src={src}
        alt={alt}
        width={512}
        height={512}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </button>
  );
}
