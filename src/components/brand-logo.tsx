import type { ImgHTMLAttributes } from "react";

/** Logo en /public (usar en preload del layout). */
export const BRAND_LOGO_SRC = "/logo.jpeg";

/** Contenedor circular; la imagen rellena con object-cover. */
const sizeClass = {
  splash:
    "h-52 w-52 max-h-[min(56vw,280px)] max-w-[min(56vw,280px)] sm:h-[15rem] sm:w-[15rem] sm:max-h-[300px] sm:max-w-[300px]",
  header: "h-[7.25rem] w-[7.25rem]",
  page: "h-28 w-28",
  compact: "h-24 w-24",
} as const;

export type BrandLogoSize = keyof typeof sizeClass;

type BrandLogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  size?: BrandLogoSize;
  alt?: string;
};

export function BrandLogo({
  size = "header",
  className = "",
  alt = "Carla Bruni · Dermocosmetóloga y esteticista",
  ...rest
}: BrandLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--foreground-muted)_10%,var(--surface-card))] shadow-[0_8px_24px_var(--shadow-deep)] ring-2 ring-[color-mix(in_srgb,var(--premium-gold)_40%,transparent)] ring-offset-2 ring-offset-[var(--background)] ${sizeClass[size]} ${className}`.trim()}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        width={512}
        height={512}
        decoding="async"
        className="h-full w-full scale-[0.86] object-cover object-center"
        {...rest}
      />
    </span>
  );
}
