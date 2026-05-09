import type { ImgHTMLAttributes } from "react";

/** Logo en /public (usar en preload del layout). */
export const BRAND_LOGO_SRC = "/logo.jpeg";

/** Contenedor exterior (cuadrado → 50% = círculo). */
const sizeClass = {
  splash:
    "h-64 w-64 max-h-[min(72vw,360px)] max-w-[min(72vw,360px)] sm:h-[18rem] sm:w-[18rem] sm:max-h-[380px] sm:max-w-[380px]",
  header: "h-44 w-44",
  page: "h-36 w-36",
  compact: "h-32 w-32",
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
  style: imgStyle,
  ...rest
}: BrandLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-transparent ${sizeClass[size]} ${className}`.trim()}
    >
      <span
        className="box-border block h-full w-full min-h-0 min-w-0 overflow-hidden"
        style={{ borderRadius: "30%" }}
      >
        <img
          {...rest}
          src={BRAND_LOGO_SRC}
          alt={alt}
          width={512}
          height={512}
          decoding="async"
          className="box-border block h-full w-full max-h-full max-w-full object-contain object-center p-1.5"
          style={{
            ...(imgStyle && typeof imgStyle === "object" ? imgStyle : null),
            borderRadius: "20%",
          }}
        />
      </span>
    </span>
  );
}
