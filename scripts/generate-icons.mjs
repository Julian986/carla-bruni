/**
 * Genera favicons, iconos PWA y og:image desde public/logo.jpeg
 * Uso: npm run icons
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public", "logo.jpeg");
const outDir = path.join(root, "public");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

function pipeline() {
  return sharp(input).rotate();
}

async function ensureSourceLogo() {
  if (fs.existsSync(input)) return;
  console.warn(
    `[icons] No existe ${path.relative(root, input)}. Generando placeholder (reemplazalo con el logo final).`,
  );
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#6a6b6d"/>
      <circle cx="256" cy="256" r="168" fill="none" stroke="#c9a96a" stroke-width="28"/>
      <text x="256" y="288" text-anchor="middle" font-family="Georgia,serif" font-size="96" fill="#c9a96a">CB</text>
    </svg>`,
  );
  await sharp(svg).jpeg({ quality: 92 }).toFile(input);
}

async function paddedSquare(size, filename) {
  const resized = await pipeline().resize(size, size, { fit: "contain", background: WHITE }).toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: WHITE,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(outDir, filename));
}

async function main() {
  await ensureSourceLogo();

  for (const [size, name] of [
    [64, "favicon-64.png"],
    [48, "favicon-48.png"],
    [32, "favicon-32.png"],
    [16, "favicon-16.png"],
  ]) {
    await pipeline()
      .resize(size, size, { fit: "cover", position: "centre" })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(path.join(outDir, name));
  }

  await paddedSquare(180, "apple-touch-icon.png");
  await paddedSquare(192, "icon-192.png");
  await paddedSquare(512, "icon-512.png");

  /** OG 1200×630: logo a pantalla completa (cover), sin lienzo gris alrededor. */
  const ogW = 1200;
  const ogH = 630;
  const ogPathV4 = path.join(outDir, "og-image-v4.jpg");
  await pipeline()
    .resize(ogW, ogH, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(ogPathV4);

  await sharp(ogPathV4).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(outDir, "og-image.jpg"));

  console.log("[icons] OK:", [
    "favicon-64.png",
    "favicon-48.png",
    "favicon-32.png",
    "favicon-16.png",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "og-image-v4.jpg",
    "og-image.jpg",
  ].join(", "));
}

main().catch((e) => {
  console.error("[icons]", e);
  process.exit(1);
});
