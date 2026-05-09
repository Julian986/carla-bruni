"use client";

import type { ImgHTMLAttributes, MouseEventHandler } from "react";
import { useCallback, useState } from "react";

/** Logo en /public (usar en preload del layout). */
export const BRAND_LOGO_SRC = "/logo2.png";
export const BRAND_LOGO_SRC2 = "/logo.jpeg";

const LOGO_SOURCES = [BRAND_LOGO_SRC, BRAND_LOGO_SRC2] as const;

const sizeClass = {
  splash: "h-52 w-52 max-h-[min(56vw,280px)] max-w-[min(56vw,280px)] sm:h-[15rem] sm:w-[15rem] sm:max-h-[300px] sm:max-w-[300px]",
  header: "h-[7.25rem] w-[7.25rem]",
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
