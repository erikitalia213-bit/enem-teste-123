/* Auditoría automática de jugadas: npm run audit:plays
 * Detecta: diagramas duplicados, rutas fuera del campo, receptores que
 * terminan en el mismo punto, y lecturas cuyo texto no coincide con la
 * ruta dibujada. Sale con código 1 si encuentra problemas bloqueantes. */
import { PLAYS } from "../data/plays";
import type { Play, RouteType } from "../lib/types";

const ROUTE_WORDS: Record<string, RouteType[]> = {
  slant: ["slant", "custom"],
  out: ["out", "custom"],
  " in ": ["in", "custom"],
  "el in": ["in", "custom"],
  gancho: ["hook", "sit", "custom"],
  hook: ["hook", "sit", "custom"],
  curl: ["hook"],
  flat: ["flat", "custom"],
  esquina: ["corner", "custom"],
  corner: ["corner"],
  poste: ["post", "custom"],
  vertical: ["go", "fade", "seam", "custom"],
  fade: ["fade"],
  seam: ["seam"],
  drag: ["drag"],
  "sit": ["sit"],
  rueda: ["wheel"],
  comeback: ["comeback"],
  whip: ["whip"],
  burbuja: ["screen", "custom"],
  screen: ["screen", "custom"],
  swing: ["custom"],
  cruce: ["cross", "drag", "custom"],
  flecha: ["arrow"],
};

const blocking: string[] = [];
const warnings: string[] = [];

const sig = (p: Play) =>
  p.formation +
  "|" +
  p.diagram.players.map((pl) => `${pl.id}@${Math.round(pl.x)}`).join(",") +
  "|" +
  p.diagram.routes
    .map((r) => `${r.playerId}:${r.type}:${r.points.map((pt) => `${Math.round(pt.x / 2)},${Math.round(pt.y / 2)}`).join(";")}`)
    .sort()
    .join("|");

const byNorm = new Map<string, Play[]>();
for (const p of PLAYS) {
  const key = sig(p);
  byNorm.set(key, [...(byNorm.get(key) ?? []), p]);
}
for (const list of byNorm.values()) if (list.length > 1) blocking.push(`DUPLICADO: ${list.map((p) => `${p.id} ${p.name}`).join(" = ")}`);

// Conceptos casi iguales: misma formación y mismo multiconjunto de tipos de ruta por jugador
const concept = new Map<string, Play[]>();
for (const p of PLAYS) {
  const key = `${p.formation}|${p.diagram.routes.filter((r) => r.type !== "motion").map((r) => `${r.playerId}:${r.type}`).sort().join(",")}`;
  concept.set(key, [...(concept.get(key) ?? []), p]);
}
for (const list of concept.values()) if (list.length > 1) warnings.push(`MISMO CONCEPTO: ${list.map((p) => `${p.id} ${p.name}`).join(" / ")}`);

const names = new Map<string, string>();
for (const p of PLAYS) {
  const n = p.name.toLowerCase();
  if (names.has(n)) blocking.push(`NOMBRE REPETIDO: ${p.name} (${names.get(n)} y ${p.id})`);
  names.set(n, p.id);
}

for (const p of PLAYS) {
  const receivers = p.diagram.routes.filter((r) => !["motion", "handoff", "rollout", "run"].includes(r.type) && r.playerId !== "QB");
  // Fuera de campo o quiebres demasiado comprimidos contra la banda
  for (const r of p.diagram.routes) {
    for (const pt of r.points) {
      if (pt.x < 4 || pt.x > 96 || pt.y < 3 || pt.y > 88) blocking.push(`${p.id} ${p.name}: ruta de ${r.playerId} (${r.type}) sale del campo`);
    }
    if (["out", "corner", "flat", "arrow", "screen"].includes(r.type) && r.points.length) {
      const pl = p.diagram.players.find((x) => x.id === r.playerId)!;
      const end = r.points[r.points.length - 1];
      if (Math.abs(end.x - pl.x) < 6) warnings.push(`${p.id} ${p.name}: el quiebre de ${r.playerId} (${r.type}) queda corto por la banda (${Math.abs(end.x - pl.x).toFixed(1)} u)`);
    }
  }
  // Receptores que terminan casi en el mismo punto
  for (let i = 0; i < receivers.length; i++)
    for (let j = i + 1; j < receivers.length; j++) {
      const a = receivers[i].points[receivers[i].points.length - 1];
      const b = receivers[j].points[receivers[j].points.length - 1];
      if (a && b && Math.hypot(a.x - b.x, a.y - b.y) < 5) blocking.push(`${p.id} ${p.name}: ${receivers[i].playerId} y ${receivers[j].playerId} terminan en el mismo punto`);
    }
  // Lecturas: el texto debe corresponder a la ruta del jugador mencionado
  for (const [field, text] of [["primaryRead", p.primaryRead], ["secondaryRead", p.secondaryRead]] as const) {
    const m = text.match(/^(X|Y|Z|C|QB)\b/);
    if (!m) continue;
    const route = p.diagram.routes.filter((r) => r.playerId === m[1] && r.type !== "motion");
    if (!route.length) {
      blocking.push(`${p.id} ${p.name}: ${field} menciona a ${m[1]} pero no tiene ruta`);
      continue;
    }
    const lower = ` ${text.toLowerCase()} `;
    const expected = Object.entries(ROUTE_WORDS).filter(([w]) => lower.includes(w));
    if (expected.length && !expected.some(([, types]) => route.some((r) => types.includes(r.type))))
      blocking.push(`${p.id} ${p.name}: ${field} “${text}” no coincide con la ruta ${route.map((r) => r.type).join("/")} de ${m[1]}`);
  }
  // Lectura principal y secundaria no deben ser el mismo jugador
  const r1 = p.primaryRead.match(/^(X|Y|Z|C|QB)\b/)?.[1];
  const r2 = p.secondaryRead.match(/^(X|Y|Z|C|QB)\b/)?.[1];
  if (r1 && r1 === r2) blocking.push(`${p.id} ${p.name}: lectura principal y secundaria son el mismo jugador (${r1})`);
  // Colores: la lectura principal debe estar en verde
  if (r1) {
    const green = p.diagram.routes.find((r) => r.playerId === r1 && r.color === "#49F05A");
    if (!green && p.side === "offense") warnings.push(`${p.id} ${p.name}: la lectura principal (${r1}) no está marcada en verde`);
  }
}

console.log(`Jugadas analizadas: ${PLAYS.length}`);
console.log(`\n== BLOQUEANTES (${blocking.length}) ==\n${blocking.join("\n")}`);
console.log(`\n== ADVERTENCIAS (${warnings.length}) ==\n${warnings.join("\n")}`);
if (blocking.length) process.exit(1);
