// Gera os ícones do PWA e o favicon a partir de public/img/logo-42-icone.webp.
// Uso: npm run icones
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const origem = join(process.cwd(), "public", "img", "logo-42-icone.webp");
const destino = join(process.cwd(), "public", "icones");
mkdirSync(destino, { recursive: true });
const FUNDO = { r: 11, g: 11, b: 12, alpha: 1 };

async function quadrado(tamanho, arquivo, { margem = 0.04, fundo = FUNDO } = {}) {
  const interno = Math.round(tamanho * (1 - margem * 2));
  const logo = await sharp(origem).resize(interno, interno, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: tamanho, height: tamanho, channels: 4, background: fundo } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(join(destino, arquivo));
}

await quadrado(32, "favicon-32.png", { margem: 0 });
await quadrado(180, "apple-touch-icon.png", { margem: 0.08 });
await quadrado(192, "icone-192.png", { margem: 0.04 });
await quadrado(512, "icone-512.png", { margem: 0.04 });
// "maskable": o Android recorta em círculo/forma; deixa 20% de área segura.
await quadrado(512, "icone-maskable-512.png", { margem: 0.2 });
await quadrado(192, "icone-maskable-192.png", { margem: 0.2 });
console.log("Ícones gerados em public/icones");

// Logo em PNG para os e-mails (muitos clientes de e-mail não exibem WebP).
await sharp(join(process.cwd(), "public", "img", "logo-42dias.webp"))
  .resize(520)
  .flatten({ background: "#0b0b0c" })
  .png()
  .toFile(join(process.cwd(), "public", "img", "email-logo.png"));
console.log("Logo de e-mail gerado em public/img/email-logo.png");
