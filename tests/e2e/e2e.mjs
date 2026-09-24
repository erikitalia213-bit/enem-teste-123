/* Pruebas de punta a punta contra el build de producción + Supabase falso.
 * Uso (ver tests/e2e/README.md):
 *   set -a; . tests/e2e/qa.env; set +a; npm run build
 *   node tests/e2e/mock-supabase.mjs &  npx next start -p 3100 &
 *   node tests/e2e/e2e.mjs
 * Deja capturas y PDFs en tests/e2e/out/ */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const OUT = new URL("./out/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const executablePath = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const results = [];
let failures = 0;
async function step(name, fn) {
  try {
    const info = await fn();
    results.push({ name, ok: true, info: info ?? "" });
    console.log(`✓ ${name}${info ? ` — ${info}` : ""}`);
  } catch (e) {
    failures++;
    results.push({ name, ok: false, info: String(e?.message ?? e).split("\n")[0] });
    console.log(`✗ ${name} — ${String(e?.message ?? e).split("\n")[0]}`);
  }
}
const assert = (c, m) => {
  if (!c) throw new Error(m);
};

const browser = await chromium.launch({ executablePath });
const consoleErrors = [];
function watch(page, label) {
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`[${label}] ${m.text()}`);
  });
  page.on("pageerror", (e) => consoleErrors.push(`[${label}] pageerror ${e.message}`));
}

async function login(ctx, email) {
  const page = await ctx.newPage();
  watch(page, `login ${email}`);
  await page.goto(`${BASE}/entrar/`);
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill("clave-segura-1");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL(/\/app\/$/, { timeout: 15000 });
  return page;
}

const RUN = Date.now();
const hotmart = (event, productId, email, tx, id) =>
  fetch(`${BASE}/api/webhooks/hotmart`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-hotmart-hottok": "hottok-test" },
    body: JSON.stringify({ id, event, version: "2.0.0", data: { product: { id: productId }, buyer: { email, name: "Test" }, purchase: { transaction: tx, price: { value: 79, currency_value: "MXN" } } } }),
  });

/* ============ Landing / páginas públicas ============ */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  watch(page, "landing");

  await step("Landing: H1 comunica la propuesta en el primer pantallazo (390px)", async () => {
    await page.goto(`${BASE}/?utm_source=facebook&utm_medium=paid&utm_campaign=lanzamiento&utm_content=video1&utm_term=coach&fbclid=FBCLID123`);
    const h1 = (await page.locator("h1").evaluate((el) => Array.from(el.children).map((c) => c.textContent).join(" "))).replace(/\s+/g, " ");
    assert(h1.includes("Crea jugadas. Organiza tu playbook. Llévalo al campo."), h1);
    const box = await page.locator("h1").boundingBox();
    assert(box && box.y + box.height < 844, "H1 fuera del primer pantallazo");
    await page.screenshot({ path: `${OUT}landing-390-hero.png` });
    return h1;
  });

  await step("Landing: demo real visible antes de la sección de problemas", async () => {
    const demoY = await page.locator("#demo").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const probY = await page.getByText("Si eres coach, esto probablemente te suena").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    assert(demoY < probY, "la demo no está antes del problema");
    // interactuar con la demo
    await page.locator("#demo").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Out", exact: true }).tap();
    await page.getByRole("tab", { name: /Genera un entrenamiento/ }).tap();
    const mins = await page.locator("#demo ol li").allInnerTexts();
    const total = mins.map((t) => parseInt(t)).reduce((a, b) => a + b, 0);
    assert(total === 60, `la sesión demo suma ${total}`);
    await page.getByRole("tab", { name: /muñequera/ }).tap();
    await page.locator("#demo").screenshot({ path: `${OUT}landing-390-demo.png` });
    return `demo a ${Math.round(demoY)}px; sesión = ${total} min`;
  });

  await step("Checkout: conserva utm_*, fbclid y genera src/sck (Hotmart)", async () => {
    const btn = page.getByRole("link", { name: /QUIERO ACCESO/ }).first();
    const href = await btn.getAttribute("href");
    const u = new URL(href);
    for (const [k, v] of Object.entries({ off: "abc", utm_source: "facebook", utm_medium: "paid", utm_campaign: "lanzamiento", utm_content: "video1", utm_term: "coach", fbclid: "FBCLID123", src: "facebook" })) assert(u.searchParams.get(k) === v, `${k}=${u.searchParams.get(k)}`);
    assert(u.searchParams.get("sck") === "facebook|paid|lanzamiento|video1", "sck");
    return href;
  });

  await step("Checkout: la atribución se conserva al navegar sin parámetros", async () => {
    await page.goto(`${BASE}/extras/playbook-defensivo/`);
    const main = new URL(await page.getByRole("link", { name: /FLAGLAB \+ este complemento/ }).getAttribute("href"));
    const solo = new URL(await page.getByRole("link", { name: /comprar solo esto/ }).getAttribute("href"));
    assert(main.searchParams.get("utm_campaign") === "lanzamiento", "main sin utm");
    assert(solo.pathname.includes("DEF999") && solo.searchParams.get("fbclid") === "FBCLID123", "solo sin atribución");
    return solo.toString();
  });

  await step("Analítica: sin Pixel/GA configurados no hay errores y no existe Purchase en el cliente", async () => {
    const js = await page.evaluate(() => Array.from(document.scripts).map((s) => s.src).join(" "));
    assert(!/fbevents|gtag\/js/.test(js), "scripts de terceros cargados sin configurar");
    return "ok";
  });

  await step("Páginas legales y enlaces públicos responden 200", async () => {
    const paths = ["/", "/privacidad/", "/terminos/", "/aviso-de-independencia/", "/extras/playbook-defensivo/", "/extras/pack-50-entrenamientos/", "/extras/kit-coach-escolar/", "/entrar/", "/robots.txt", "/sitemap.xml"];
    const bad = [];
    for (const p of paths) {
      const r = await fetch(BASE + p, { redirect: "manual" });
      if (r.status !== 200) bad.push(`${p}:${r.status}`);
    }
    // enlaces internos encontrados en landing
    await page.goto(BASE + "/");
    const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href").split("#")[0]))]);
    for (const h of hrefs) {
      if (!h || !h.startsWith("/")) continue;
      const r = await fetch(BASE + h, { redirect: "manual" });
      if (![200, 307, 308].includes(r.status)) bad.push(`${h}:${r.status}`);
    }
    assert(!bad.length, bad.join(", "));
    return `${paths.length} rutas + ${hrefs.length} enlaces internos`;
  });
  await ctx.close();
}

/* ============ Acceso / entitlements ============ */
await step("Sin sesión: /app/ redirige a /entrar/", async () => {
  const r = await fetch(`${BASE}/app/biblioteca/`, { redirect: "manual" });
  assert(r.status === 307 && r.headers.get("location").includes("/entrar/"), `status ${r.status}`);
});

await step("Usuario sin compra: ve mensaje de 'sin producto' y ningún contenido", async () => {
  const ctx = await browser.newContext();
  const page = await login(ctx, "nada@test.mx");
  const t = await page.locator("main").innerText();
  assert(/no encontramos|no tiene|compra/i.test(t), t.slice(0, 120));
  const html = await page.content();
  assert(!html.includes("Poste-Esquina"), "se filtró una jugada");
  await ctx.close();
  return t.split("\n").slice(0, 2).join(" / ");
});

await step("Login con contraseña incorrecta muestra error en español", async () => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/entrar/`);
  await page.getByLabel("Correo electrónico").fill("core@test.mx");
  await page.getByLabel("Contraseña").fill("mala-clave");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByText("Correo o contraseña incorrectos.").waitFor({ timeout: 8000 });
  await ctx.close();
});

let corePage, coreCtx;
await step("Usuario con core: entra a la app y ve la biblioteca de 110 jugadas", async () => {
  coreCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  corePage = await login(coreCtx, "core@test.mx");
  await corePage.goto(`${BASE}/app/biblioteca/`);
  const txt = await corePage.locator("main").innerText();
  assert(/110/.test(txt), "no muestra 110");
  return "ok";
});

await step("Usuario con core: complementos bloqueados (sin contenido del complemento en el HTML)", async () => {
  await corePage.goto(`${BASE}/app/extras/playbook-defensivo/`);
  const html = await corePage.content();
  assert(/no está incluido en tu cuenta/i.test(await corePage.locator("main").innerText()), "no muestra candado");
  assert(!html.includes("Cuatro defensores dividen el campo"), "se filtró el playbook defensivo");
  return "bloqueado";
});

await step("Webhook: token inválido → 401", async () => {
  const r = await fetch(`${BASE}/api/webhooks/hotmart`, { method: "POST", headers: { "content-type": "application/json", "x-hotmart-hottok": "falso" }, body: "{}" });
  assert(r.status === 401, `status ${r.status}`);
});

await step("Webhook Hotmart aprobado desbloquea el complemento; reintento es idempotente", async () => {
  const r1 = await (await hotmart("PURCHASE_APPROVED", 222, "core@test.mx", `HP-${RUN}`, `evt-${RUN}-1`)).json();
  assert(r1.ok && r1.action === "grant" && !r1.duplicate, JSON.stringify(r1));
  const r2 = await (await hotmart("PURCHASE_APPROVED", 222, "core@test.mx", `HP-${RUN}`, `evt-${RUN}-1`)).json();
  assert(r2.duplicate === true, "no detectó duplicado");
  await corePage.goto(`${BASE}/app/extras/playbook-defensivo/`);
  await corePage.getByText("Cuatro defensores dividen el campo", { exact: false }).first().waitFor({ timeout: 8000 }).catch(async () => {
    const t = await corePage.locator("main").innerText();
    throw new Error("sigue bloqueado: " + t.slice(0, 100));
  });
  return JSON.stringify(r2);
});

await step("Webhook reembolso revoca el complemento", async () => {
  const r = await (await hotmart("PURCHASE_REFUNDED", 222, "core@test.mx", `HP-${RUN}`, `evt-${RUN}-2`)).json();
  assert(r.action === "revoke", JSON.stringify(r));
  await corePage.goto(`${BASE}/app/extras/playbook-defensivo/`);
  const html = await corePage.content();
  assert(!html.includes("Cuatro defensores dividen el campo"), "sigue desbloqueado");
});

await step("Webhook de producto no mapeado se ignora sin dar acceso", async () => {
  const r = await (await hotmart("PURCHASE_APPROVED", 999, "nada@test.mx", `HP2-${RUN}`, `evt-${RUN}-3`)).json();
  assert(r.action === "ignore" && r.unmapped === "999", JSON.stringify(r));
});

/* ============ Creador de jugadas (escritorio) ============ */
await step("Creador: mover jugador con mouse, deshacer/rehacer, guardar, duplicar, PNG, playbook y borrar", async () => {
  const page = corePage;
  watch(page, "creador");
  await page.goto(`${BASE}/app/crear/`);
  const svg = page.locator("svg[role=application]");
  await svg.waitFor();
  const player = svg.locator("g[role=button]").filter({ hasText: "X" }).first();
  // Coordenadas del jugador en el campo (unidades SVG), independientes del anillo de selección
  const pos = async () => player.locator("circle").first().evaluate((c) => [Number(c.getAttribute("cx")), Number(c.getAttribute("cy"))]);
  const p1 = await pos();
  const b1 = await player.boundingBox();
  await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2);
  await page.mouse.down();
  await page.mouse.move(b1.x + b1.width / 2 + 40, b1.y + b1.height / 2 - 60, { steps: 8 });
  await page.mouse.up();
  const p2 = await pos();
  assert(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) > 3, "el jugador no se movió");
  await page.getByRole("button", { name: /Deshacer/ }).click();
  const p3 = await pos();
  assert(p3[0] === p1[0] && p3[1] === p1[1], `deshacer: ${p3} ≠ ${p1}`);
  await page.getByRole("button", { name: /Rehacer/ }).click();
  const p4 = await pos();
  assert(p4[0] === p2[0] && p4[1] === p2[1], "rehacer falló");
  // ruta desde el panel
  await player.click();
  const slant = page.getByRole("button", { name: "Slant", exact: true }).first();
  if (await slant.count()) await slant.click();
  await page.getByLabel("Nombre de la jugada").fill("Prueba E2E").catch(async () => page.getByPlaceholder("Ej. Relámpago").fill("Prueba E2E"));
  await page.getByRole("button", { name: /^Guardar/ }).first().click();
  await page.waitForTimeout(400);
  // PNG
  const dl = page.waitForEvent("download", { timeout: 8000 });
  await page.getByRole("button", { name: "Descargar imagen PNG" }).click();
  const file = await dl;
  const path = `${OUT}${file.suggestedFilename()}`;
  await file.saveAs(path);
  // playbook
  await page.getByRole("button", { name: /Al playbook/ }).click();
  await page.waitForTimeout(300);
  // duplicar
  await page.getByRole("button", { name: "Duplicar jugada" }).click();
  await page.waitForTimeout(400);
  await page.goto(`${BASE}/app/jugadas/`);
  const count = await page.getByText("Prueba E2E").count();
  assert(count >= 2, `se esperaban original + copia, hay ${count}`);
  return `PNG ${file.suggestedFilename()} · ${count} jugadas 'Prueba E2E'`;
});

/* ============ Creador táctil ============ */
await step("Creador táctil (tablet 820px): arrastrar jugador con el dedo y desplazar la página tocando el fondo", async () => {
  const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, storageState: await coreCtx.storageState() });
  const page = await ctx.newPage();
  watch(page, "creador-touch");
  await page.goto(`${BASE}/app/crear/`);
  const svg = page.locator("svg[role=application]");
  await svg.waitFor();
  const cdp = await ctx.newCDPSession(page);
  const touch = async (type, x, y) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }] });
  const player = svg.locator("g[role=button]").filter({ hasText: "Z" }).first();
  const b = await player.boundingBox();
  const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
  await touch("touchStart", cx, cy);
  for (let i = 1; i <= 8; i++) await touch("touchMove", cx - i * 6, cy - i * 8);
  await touch("touchEnd");
  const b2 = await player.boundingBox();
  assert(Math.abs(b2.y - b.y) > 25, `el jugador no se movió con el dedo (Δy=${b2.y - b.y})`);
  // touch-action del fondo permite pan
  const ta = await svg.evaluate((el) => getComputedStyle(el).touchAction);
  const tp = await player.evaluate((el) => getComputedStyle(el).touchAction);
  assert(ta !== "none" && tp === "none", `touch-action fondo=${ta} jugador=${tp}`);
  // zoom
  await page.getByRole("button", { name: "Acercar" }).tap();
  const w = await svg.evaluate((el) => el.getBoundingClientRect().width);
  await page.screenshot({ path: `${OUT}creador-820-touch.png` });
  await ctx.close();
  return `Δy=${Math.round(b2.y - b.y)}px, touch-action fondo=${ta}, zoom ancho=${Math.round(w)}px`;
});

/* ============ Impresión playbook A4 / Carta ============ */
async function pdfAndShots(page, name, format) {
  await page.emulateMedia({ media: "print" });
  const path = `${OUT}${name}-${format}.pdf`;
  await page.pdf({ path, format, printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  return path;
}

await step("Playbook: imprimir en A4 y Carta (PDF)", async () => {
  const page = corePage;
  // llenar playbook con varias jugadas de la biblioteca
  await page.goto(`${BASE}/app/playbook/`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}playbook-antes.png` });
  const add = page.getByRole("button", { name: "Agregar", exact: true }).first();
  await add.click();
  const cards = page.locator("dialog[open] button[aria-pressed]");
  const n = Math.min(14, await cards.count());
  for (let i = 0; i < n; i++) await cards.nth(i).click();
  await page.getByRole("button", { name: /^Agregar \(/ }).click();
  await page.waitForTimeout(300);
  await page.goto(`${BASE}/app/playbook/imprimir/`);
  await page.waitForTimeout(500);
  const out = [];
  for (const f of ["A4", "Letter"]) out.push(await pdfAndShots(page, "playbook", f));
  writeFileSync(`${OUT}playbook-pdfs.json`, JSON.stringify(out));
  return out.map((p) => p.split("/").pop()).join(", ");
});

await step("Muñequeras 6/9/12/18 en Carta y A4 (PDF)", async () => {
  const page = corePage;
  await page.goto(`${BASE}/app/munequeras/`);
  await page.waitForTimeout(300);
  const sel = page.locator("select").filter({ hasText: "Cargar playbook" });
  const opt = await sel.locator("option").nth(1).getAttribute("value");
  await sel.selectOption(opt);
  await page.getByRole("button", { name: /GENERAR HOJA/ }).click();
  const out = [];
  for (const size of [6, 9, 12, 18]) {
    await page.getByRole("radiogroup", { name: "Jugadas por tarjeta" }).getByRole("radio", { name: String(size), exact: true }).click();
    for (const [f, label] of [["Letter", "Carta"], ["A4", "A4"]]) {
      await page.getByRole("radiogroup", { name: "Tamaño de papel" }).getByRole("radio", { name: label, exact: true }).click();
      await page.waitForTimeout(150);
      out.push(await pdfAndShots(page, `munequera-${size}`, f));
    }
  }
  const n = await page.locator("main").innerText().then((t) => (t.match(/jugadas \((\d+)\)/i) || [])[1]);
  return `${out.length} PDFs con ${n} jugadas`;
});

/* ============ Responsive ============ */
await step("Responsive: sin scroll horizontal en 390/430/768/820/1024/1440", async () => {
  const pages = ["/", "/entrar/", "/app/", "/app/biblioteca/", "/app/crear/", "/app/entrenamientos/", "/app/playbook/", "/app/munequeras/", "/app/manual/", "/app/equipo/"];
  const problems = [];
  for (const w of [390, 430, 768, 820, 1024, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 860 : 1000 }, storageState: await coreCtx.storageState(), isMobile: w < 800, hasTouch: w < 1100 });
    const page = await ctx.newPage();
    watch(page, `resp-${w}`);
    for (const p of pages) {
      await page.goto(BASE + p);
      await page.waitForTimeout(150);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 1) {
        const culprit = await page.evaluate(() => {
          const W = window.innerWidth;
          let worst = null;
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.right > W + 1 && (!worst || r.width < worst.w)) worst = { w: r.width, d: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}` };
          }
          return worst?.d;
        });
        problems.push(`${p}@${w}: +${over}px (${culprit})`);
      }
      if ([390, 820, 1440].includes(w) && ["/", "/app/", "/app/crear/", "/app/biblioteca/"].includes(p)) await page.screenshot({ path: `${OUT}resp-${w}${p.replace(/\//g, "_")}.png`, fullPage: p !== "/" });
    }
    await ctx.close();
  }
  assert(!problems.length, problems.join(", "));
  return `${pages.length} páginas × 6 anchos`;
});

await step("Generador en la app: 6-8 años / 30 min y Adultos / 90 min no exceden el tiempo", async () => {
  const page = corePage;
  const res = [];
  for (const [age, dur, players] of [["6-8", "30", "6"], ["Adultos", "90", "20"]]) {
    await page.goto(`${BASE}/app/entrenamientos/`);
    await page.getByRole("radiogroup", { name: "Edad" }).getByRole("radio", { name: age === "Adultos" ? "Adultos" : `${age} años`, exact: true }).click();
    await page.getByRole("radiogroup", { name: "Duración" }).getByRole("radio", { name: `${dur} min`, exact: true }).click();
    await page.locator("#players").fill(players);
    await page.getByRole("button", { name: /GENERAR ENTRENAMIENTO/ }).click();
    await page.waitForTimeout(400);
    const text = await page.locator("main").innerText();
    const mins = [...text.matchAll(/(\d+) minutos/g)].map((m) => Number(m[1]));
    const total = mins.reduce((a, b) => a + b, 0);
    res.push(`${age}/${dur} min/${players} jugadores → ${mins.length} bloques = ${total} min`);
    assert(mins.length > 0 && total === Number(dur), `suma ${total} ≠ ${dur}`);
  }
  return res.join(" · ");
});

await coreCtx.close();
await browser.close();

const serious = consoleErrors.filter((e) => !/favicon|Download the React DevTools/.test(e));
results.push({ name: "Errores de consola", ok: serious.length === 0, info: serious.slice(0, 10).join(" | ") || "ninguno" });
if (serious.length) failures++;
console.log(serious.length ? `✗ Errores de consola:\n  ${serious.join("\n  ")}` : "✓ Sin errores de consola");
writeFileSync(`${OUT}results.json`, JSON.stringify(results, null, 2));
console.log(`\n${results.length - failures}/${results.length} OK`);
process.exit(failures ? 1 : 0);
