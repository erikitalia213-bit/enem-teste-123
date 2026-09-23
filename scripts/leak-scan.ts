/* Verifica que el contenido de pago NO esté en los archivos públicos del build.
 * Uso: npm run build && npm run leak-scan
 * Busca descripciones de jugadas, drills, capítulos del manual, clases y complementos
 * dentro de .next/static (JS/CSS que descarga cualquier visitante) y del HTML prerenderizado. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { PLAYS } from "../data/plays";
import { DRILLS } from "../data/drills";
import { CHAPTERS } from "../data/manual";
import { CLASSES } from "../data/classes";
import { DEFENSE_SCHEMES } from "../data/defense";
import { SCHOOL_KIT_CLASSES } from "../data/schoolKit";
import { EXTRA_SESSIONS } from "../data/readySessions";

function files(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(js|css|html|rsc|json|txt)$/.test(p)) out.push(p);
  }
  return out;
}

const long = (s: unknown) => (typeof s === "string" && s.length >= 40 ? [s] : []);
const firstText = (blocks: unknown[]) => blocks.flatMap((b) => long((b as { text?: string }).text)).slice(0, 2);

const sentinels: { group: string; text: string }[] = [
  ...PLAYS.flatMap((p) => long(p.description).map((text) => ({ group: "jugadas", text }))),
  ...DRILLS.flatMap((d) => [...long(d.objective), ...long(d.setup ?? "")].map((text) => ({ group: "drills", text }))),
  ...CHAPTERS.flatMap((c) => firstText(c.blocks as unknown[]).map((text) => ({ group: "manual", text }))),
  ...CLASSES.flatMap((c) => [...c.main, ...c.warmup].flatMap(long).map((text) => ({ group: "clases", text }))),
  ...DEFENSE_SCHEMES.flatMap((d) => [...long(d.concept), ...long(d.coachTip)].map((text) => ({ group: "playbook defensivo", text }))),
  ...SCHOOL_KIT_CLASSES.flatMap((c) => [...c.main, ...c.warmup].flatMap(long).map((text) => ({ group: "kit escolar", text }))),
  ...EXTRA_SESSIONS.flatMap((s) => long(s.coachNote).map((text) => ({ group: "pack extra", text }))),
];

const publicFiles = [...files(".next/static"), ...files(".next/server/app").filter((f) => !/\/app\//.test(f) && /\.(html|rsc)$/.test(f))];
const corpus = publicFiles.map((f) => ({ f, s: readFileSync(f, "utf8") }));

// La landing muestra a propósito una muestra (demo, vitrina de jugadas). Se reporta pero no falla.
const ALLOWED_PUBLIC = new Set(["index.html", "index.rsc"]);
let leaks = 0;
const byGroup: Record<string, number> = {};
for (const { group, text } of sentinels) {
  byGroup[group] = (byGroup[group] ?? 0) + 1;
  const hits = corpus.filter((c) => c.s.includes(text) || c.s.includes(JSON.stringify(text).slice(1, -1)));
  const bad = hits.filter((h) => !ALLOWED_PUBLIC.has(h.f.split("/").pop()!));
  if (bad.length) {
    leaks++;
    console.log(`FUGA [${group}] "${text.slice(0, 60)}…" en ${bad.map((b) => b.f).join(", ")}`);
  }
}
console.log(`Revisados ${sentinels.length} textos (${Object.entries(byGroup).map(([g, n]) => `${g}: ${n}`).join(", ")}) en ${publicFiles.length} archivos públicos.`);
console.log(leaks ? `✖ ${leaks} textos de pago encontrados en archivos públicos.` : "✓ Ningún texto de pago en los archivos públicos.");
process.exit(leaks ? 1 : 0);
