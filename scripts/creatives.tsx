/* ============================================================
 *  Genera los creativos de imagen (HTML editable + PNG 1080x1350),
 *  la imagen OpenGraph (1200x630) y los íconos PWA.
 *
 *  Uso:  npm run creatives
 *  Requiere Chromium (Playwright). Si no está en la ruta por
 *  defecto, define CHROMIUM_PATH=/ruta/a/chrome
 *
 *  Los HTML quedan en marketing/creatives/images/*.html:
 *  puedes editar los textos ahí y volver a exportar el PNG
 *  con:  npm run creatives -- --png-only
 * ============================================================ */

import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DiagramSvg } from "../components/diagram/PlayDiagram";
import { PLAY_MAP } from "../data/plays";
import type { Play } from "../lib/types";

// tsx puede compilar JSX con el runtime clásico: expone React globalmente.
(globalThis as unknown as { React: typeof React }).React = React;

const ROOT = path.resolve(__dirname, "..");
const IMG_DIR = path.join(ROOT, "marketing/creatives/images");
const PNG_ONLY = process.argv.includes("--png-only");

const svg = (p: Play, theme: "field" | "print" = "field", extra = "", fit = false) =>
  renderToStaticMarkup(<DiagramSvg diagram={p.diagram} theme={theme} showNotes={false} fit={fit} />).replace("<svg", `<svg ${extra}`);

const LOGO = `<svg width="56" height="56" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="10" fill="#0f2a16" stroke="#49F05A" stroke-opacity="0.35"/><path d="M13 8 H28 L23.5 15.5 L28 23 H17 V32 H13 Z" fill="#49F05A"/><path d="M17 12 H21" stroke="#0f2a16" stroke-width="2" stroke-linecap="round"/></svg>`;

const fontFace = (nm: string) => `
@font-face{font-family:'Barlow Condensed';font-weight:800;src:url('${nm}/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2') format('woff2')}
@font-face{font-family:'Barlow Condensed';font-weight:700;src:url('${nm}/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2') format('woff2')}
@font-face{font-family:'Inter';font-weight:100 900;src:url('${nm}/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2') format('woff2')}`;

const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
:root{--font-sans:Inter,Arial,sans-serif;--volt:#49F05A;--ink:#070909;--pitch:#173B20;--mist:#9DA3A3}
html,body{width:1080px;height:1350px;overflow:hidden;background:#070909;color:#fff;font-family:Inter,Arial,sans-serif}
.d{font-family:'Barlow Condensed','Arial Narrow',sans-serif;font-weight:800;text-transform:uppercase;line-height:.92;letter-spacing:.005em}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:54px 54px}
.brand{display:flex;align-items:center;gap:14px}
.brand b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:40px}
.brand b span{color:var(--volt)}
.cta{display:inline-flex;align-items:center;gap:14px;background:var(--volt);color:#070909;border-radius:22px;padding:26px 44px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:46px;text-transform:uppercase;box-shadow:0 20px 60px -15px rgba(73,240,90,.7)}
svg{display:block;width:100%;height:auto}
.brand svg{width:56px;height:56px;flex:none}
[contenteditable]{outline:none}
`;

function page(title: string, body: string, css = "", nodeModules = "../../../node_modules") {
  return `<!doctype html>
<html lang="es-MX"><head><meta charset="utf-8"><title>${title}</title>
<!-- Creativo editable de FLAGLAB 5x5 · 1080x1350 (4:5). Edita los textos y vuelve a exportar con: npm run creatives -- --png-only -->
<style>${fontFace(nodeModules)}${BASE_CSS}${css}</style></head>
<body>${body}</body></html>`;
}

/* ---------------- Creativo 1: Antes vs Después ---------------- */
function creative1() {
  const p = PLAY_MAP["pp-03"];
  const paperSketch = `<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3efe4"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" x2="400" y1="${25 + i * 24}" y2="${25 + i * 24}" stroke="#b9c6d8" stroke-width="1"/>`).join("")}
    <line x1="42" x2="42" y1="0" y2="300" stroke="#e39a9a" stroke-width="1.5"/>
    <g fill="none" stroke="#1b2a57" stroke-width="3" stroke-linecap="round">
      <circle cx="90" cy="220" r="11"/><circle cx="200" cy="232" r="11"/><circle cx="300" cy="220" r="11"/><rect x="189" y="196" width="22" height="22"/><circle cx="255" cy="238" r="11"/>
      <path d="M90 209 C 92 160, 110 120, 150 90"/><path d="M300 209 L 300 150 L 340 110"/><path d="M200 185 C 190 150, 160 140, 130 150"/>
      <path d="M255 227 C 280 190, 240 170, 270 120 L 250 70"/>
    </g>
    <g stroke="#1b2a57" stroke-width="3"><line x1="120" y1="60" x2="170" y2="110"/><line x1="170" y1="60" x2="120" y2="110"/></g>
    <text x="210" y="60" font-family="Comic Sans MS, cursive" font-size="22" fill="#1b2a57">¿Y aquí quién va??</text>
    <path d="M70 40 q 20 -10 40 0" stroke="#1b2a57" stroke-width="2" fill="none"/>
    <circle cx="330" cy="40" r="26" fill="#c9a86b" opacity=".35"/>
  </svg>`;
  return page(
    "Creativo 1 · Antes vs Después",
    `<div class="grid"></div>
    <div style="position:relative;padding:64px 60px;height:100%;display:flex;flex-direction:column">
      <div class="brand">${LOGO}<b>FLAGLAB <span>5x5</span></b></div>
      <h1 class="d" contenteditable style="font-size:112px;margin-top:40px">¿Aún dibujas<br>tus jugadas <span style="color:#49F05A">así?</span></h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:48px;flex:1">
        <div style="background:#141818;border:2px solid #2f3a38;border-radius:28px;padding:26px;display:flex;flex-direction:column">
          <p class="d" style="font-size:46px;color:#ff7a59">Antes</p>
          <div style="margin:18px 0;transform:rotate(-3deg);box-shadow:0 20px 40px rgba(0,0,0,.6);border-radius:6px;overflow:hidden">${paperSketch}</div>
          <ul contenteditable style="list-style:none;font-size:30px;line-height:1.45;color:#c7cccc;margin-top:auto">
            <li>✕ Ideas desordenadas.</li><li>✕ Tiempo perdido.</li><li>✕ Confusión en el campo.</li>
          </ul>
        </div>
        <div style="background:linear-gradient(180deg,#123019,#0b150e);border:2px solid #49F05A;border-radius:28px;padding:26px;display:flex;flex-direction:column;box-shadow:0 0 0 1px rgba(73,240,90,.3),0 30px 80px -30px rgba(73,240,90,.6)">
          <p class="d" style="font-size:46px;color:#49F05A">Después</p>
          <div style="margin:18px 0;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12)">${svg(p)}</div>
          <ul contenteditable style="list-style:none;font-size:30px;line-height:1.45;color:#fff;margin-top:auto">
            <li>✓ Diseña jugadas.</li><li>✓ Organiza tu playbook.</li><li>✓ Lleva tu plan al campo.</li>
          </ul>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px">
        <span class="cta" contenteditable>Conoce FLAGLAB →</span>
        <span style="font-size:24px;color:#9DA3A3">Tocho bandera 5x5</span>
      </div>
    </div>`,
  );
}

/* ---------------- Creativo 2: 100+ jugadas ---------------- */
function creative2() {
  const ids = ["pc-01", "pc-04", "pm-01", "pp-01", "rz-01", "cv-03", "sc-01", "mo-02", "cs-03", "pr-01", "cz-02", "ch-02"];
  const tiles = ids
    .map((id, i) => {
      const rot = [-8, 5, -4, 7, -6, 3, 6, -5, 4, -7, 8, -3][i];
      const x = [30, 250, 470, 690, 60, 280, 500, 720, 20, 240, 460, 680][i];
      const y = [0, 30, -10, 20, 230, 260, 220, 250, 460, 490, 450, 480][i];
      const op = 0.35 + (i % 4) * 0.15;
      return `<div style="position:absolute;left:${x}px;top:${y}px;width:230px;transform:rotate(${rot}deg);opacity:${op};border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.15);box-shadow:0 20px 40px rgba(0,0,0,.6)">${svg(PLAY_MAP[id])}</div>`;
    })
    .join("");
  const book = ["pc-04", "pp-03", "rz-01", "cs-01"].map((id, i) => `<div style="border:1px solid #ddd;border-radius:8px;overflow:hidden"><div style="font-family:'Barlow Condensed';font-weight:800;font-size:22px;color:#111;padding:4px 8px">0${i + 1} ${PLAY_MAP[id].name.toUpperCase()}</div>${svg(PLAY_MAP[id], "print")}</div>`).join("");
  return page(
    "Creativo 2 · 100+ jugadas",
    `<div class="grid"></div>
    <div style="position:absolute;left:0;right:0;top:330px;height:700px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent,black 20%,black 70%,transparent)">${tiles}</div>
    <div style="position:relative;padding:64px 60px;height:100%;display:flex;flex-direction:column">
      <div class="brand">${LOGO}<b>FLAGLAB <span>5x5</span></b></div>
      <h1 class="d" contenteditable style="font-size:128px;margin-top:34px"><span style="color:#49F05A">100+ jugadas</span><br>listas para usar</h1>
      <div style="margin:auto auto 0;width:620px;background:#fff;border-radius:22px;padding:22px;box-shadow:0 40px 100px -20px rgba(73,240,90,.55),0 0 0 3px #49F05A;transform:rotate(-2deg)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b style="font-family:'Barlow Condensed';font-size:34px;color:#111">MI PLAYBOOK</b><span style="background:#49F05A;color:#070909;border-radius:10px;padding:4px 12px;font-weight:700;font-size:20px">110 jugadas</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${book}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px">
        <p class="d" contenteditable style="font-size:74px">Elige.<br>Edita.<br><span style="color:#49F05A">Entrena.</span></p>
        <span class="cta" contenteditable>FLAGLAB 5x5</span>
      </div>
    </div>`,
  );
}

/* ---------------- Creativo 3: muñequera ---------------- */
function creative3() {
  const ids = ["pc-01", "cs-10", "pp-01", "rz-02", "sc-01", "mo-10"];
  const cells = ids
    .map((id, i) => `<div style="border:1px solid #bbb;padding:6px"><div style="display:flex;gap:8px;align-items:baseline"><b style="font-family:'Barlow Condensed';font-size:40px;color:#111;line-height:1">0${i + 1}</b><span style="font-family:'Barlow Condensed';font-weight:700;font-size:20px;color:#111">${PLAY_MAP[id].name.toUpperCase()}</span></div>${svg(PLAY_MAP[id], "print", "", true)}</div>`)
    .join("");
  return page(
    "Creativo 3 · Muñequera",
    `<div class="grid"></div>
    <div style="position:absolute;right:-200px;top:380px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(73,240,90,.28),transparent 65%)"></div>
    <div style="position:relative;padding:64px 60px;height:100%;display:flex;flex-direction:column">
      <div class="brand">${LOGO}<b>FLAGLAB <span>5x5</span></b></div>
      <h1 class="d" contenteditable style="font-size:118px;margin-top:34px">Tus jugadas<br>en la muñeca<br><span style="color:#49F05A">del equipo</span></h1>
      <div style="margin:70px auto 60px;position:relative;width:800px">
        <div style="position:absolute;inset:-34px -60px;background:#161b1a;border-radius:70px;border:3px solid #2f3a38;box-shadow:inset 0 0 0 10px #0d1110,0 40px 90px rgba(0,0,0,.7)"></div>
        <div style="position:relative;background:#fff;border:4px solid #111;display:grid;grid-template-columns:repeat(3,1fr);transform:rotate(-2deg)">${cells}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto">
        <p class="d" contenteditable style="font-size:74px">Crea.<br>Imprime.<br><span style="color:#49F05A">Juega.</span></p>
        <span class="cta" contenteditable>FLAGLAB 5x5</span>
      </div>
    </div>`,
  );
}

/* ---------------- OG image ---------------- */
function og() {
  const p = PLAY_MAP["pp-03"];
  return page(
    "OG FLAGLAB",
    `<div class="grid"></div>
    <div style="position:relative;display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center;padding:56px 60px;height:100%">
      <div>
        <div class="brand">${LOGO}<b>FLAGLAB <span>5x5</span></b></div>
        <h1 class="d" style="font-size:92px;margin-top:28px">Deja de<br><span style="color:#49F05A">improvisar</span><br>tus entrenamientos</h1>
        <p style="font-size:26px;color:#c7cccc;margin-top:22px">Jugadas, playbook y entrenamientos de tocho bandera 5x5.</p>
      </div>
      <div style="border-radius:22px;overflow:hidden;border:2px solid rgba(73,240,90,.5);box-shadow:0 30px 80px -20px rgba(73,240,90,.5)">${svg(p)}</div>
    </div>`,
    `html,body{width:1200px;height:630px}`,
    "../node_modules",
  );
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const files: { html: string; png: string; w: number; h: number }[] = [
    { html: path.join(IMG_DIR, "creativo-01-antes-despues.html"), png: path.join(IMG_DIR, "creativo-01-antes-despues.png"), w: 1080, h: 1350 },
    { html: path.join(IMG_DIR, "creativo-02-100-jugadas.html"), png: path.join(IMG_DIR, "creativo-02-100-jugadas.png"), w: 1080, h: 1350 },
    { html: path.join(IMG_DIR, "creativo-03-munequera.html"), png: path.join(IMG_DIR, "creativo-03-munequera.png"), w: 1080, h: 1350 },
    { html: path.join(ROOT, "marketing/og.html"), png: path.join(ROOT, "public/og.png"), w: 1200, h: 630 },
  ];
  if (!PNG_ONLY) {
    const builders = [creative1, creative2, creative3, og];
    files.forEach((f, i) => fs.writeFileSync(f.html, builders[i]()));
    console.log("✓ HTML editables generados");
  }
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium" });
  for (const f of files) {
    const pg = await browser.newPage({ viewport: { width: f.w, height: f.h } });
    await pg.goto("file://" + f.html, { waitUntil: "networkidle" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: f.png });
    await pg.close();
    console.log("✓", path.relative(ROOT, f.png));
  }
  // Íconos PWA
  const iconSvg = fs.readFileSync(path.join(ROOT, "app/icon.svg"), "utf8");
  for (const size of [192, 512, 180]) {
    const pg = await browser.newPage({ viewport: { width: size, height: size } });
    await pg.setContent(`<html><body style="margin:0;background:#0f2a16">${iconSvg.replace("<svg", `<svg width="${size}" height="${size}"`)}</body></html>`);
    const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
    await pg.screenshot({ path: path.join(ROOT, "public", name) });
    await pg.close();
  }
  console.log("✓ íconos PWA");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
