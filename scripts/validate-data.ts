/* Valida la integridad de los datasets: npm run validate */
import { PLAYS } from "../data/plays";
import { DRILLS, DRILL_MAP } from "../data/drills";
import { READY_SESSIONS, EXTRA_SESSIONS } from "../data/readySessions";
import { CLASSES } from "../data/classes";

let errors = 0;
const err = (m: string) => { errors++; console.error("✗", m); };

const ids = new Set<string>();
for (const p of PLAYS) {
  if (ids.has(p.id)) err(`Jugada duplicada ${p.id}`);
  ids.add(p.id);
  if (p.diagram.routes.length < 3) err(`Jugada ${p.id} con pocas rutas`);
  for (const r of p.diagram.routes) for (const pt of r.points) if (Number.isNaN(pt.x) || Number.isNaN(pt.y)) err(`NaN en ${p.id}`);
}
const dIds = new Set<string>();
const dNames = new Set<string>();
const words = (t: string) => new Set(t.toLowerCase().normalize("NFD").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3));
const jaccard = (a: Set<string>, b: Set<string>) => { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i || 1); };
for (const d of DRILLS) {
  if (dIds.has(d.id)) err(`Drill duplicado ${d.id}`);
  dIds.add(d.id);
  const n = d.name.toLowerCase();
  if (dNames.has(n)) err(`Nombre de drill repetido: ${d.name}`);
  dNames.add(n);
  if (d.duration < 4 || d.duration > 25) err(`Drill ${d.id}: duración ${d.duration} fuera de 4-25 min`);
  if (d.steps.length < 2) err(`Drill ${d.id}: faltan pasos`);
  if (!d.ages.length) err(`Drill ${d.id}: sin edades`);
  if (d.players.min < 1 || d.players.min > 12) err(`Drill ${d.id}: mínimo de jugadores ${d.players.min}`);
  const m = d.players.ideal.match(/^(\d+)/);
  if (m && Number(m[1]) < d.players.min) err(`Drill ${d.id}: ideal (${d.players.ideal}) menor que el mínimo (${d.players.min})`);
  if (!d.objective || !d.setup || !d.commonErrors.length) err(`Drill ${d.id}: incompleto`);
  if (/ojos cerrados|castigo|lagartijas como|tacklear/i.test(JSON.stringify(d))) err(`Drill ${d.id}: contenido no permitido`);
}
for (let i = 0; i < DRILLS.length; i++)
  for (let j = i + 1; j < DRILLS.length; j++) {
    const sim = jaccard(words(DRILLS[i].steps.join(" ") + " " + DRILLS[i].setup), words(DRILLS[j].steps.join(" ") + " " + DRILLS[j].setup));
    if (sim > 0.45) err(`Drills muy parecidos: ${DRILLS[i].id} y ${DRILLS[j].id} (${Math.round(sim * 100)}%)`);
  }
const AGE_NUM: Record<string, [number, number]> = { "6-8": [6, 8], "9-11": [9, 11], "12-14": [12, 14], "15-17": [15, 17], Adultos: [18, 60] };
const sessionAges = (a: string) => {
  if (/todas/i.test(a)) return null;
  const m = a.match(/(\d+)\s*-\s*(\d+)/);
  if (m) return Object.entries(AGE_NUM).filter(([, [lo, hi]]) => hi >= Number(m[1]) && lo <= Number(m[2])).map(([k]) => k);
  if (/adult/i.test(a)) return ["Adultos"];
  const plus = a.match(/(\d+)\+/);
  if (plus) return Object.entries(AGE_NUM).filter(([, [, hi]]) => hi >= Number(plus[1])).map(([k]) => k);
  return null;
};
for (const s of [...READY_SESSIONS, ...EXTRA_SESSIONS]) {
  const sum = s.blocks.reduce((a, b) => a + b.minutes, 0);
  if (sum !== s.duration) err(`Sesión ${s.id} "${s.title}" suma ${sum} ≠ ${s.duration}`);
  for (const b of s.blocks) if (!DRILL_MAP[b.drillId]) err(`Sesión ${s.id}: drill inexistente ${b.drillId}`);
  const ages = sessionAges(s.age);
  if (ages)
    for (const b of s.blocks) {
      const d = DRILL_MAP[b.drillId];
      if (d && !ages.every((a) => d.ages.includes(a as never))) err(`Sesión ${s.id} (${s.age}): ${d.id} no es apto para esas edades`);
    }
}
console.log(`Jugadas: ${PLAYS.length} · Drills: ${DRILLS.length} · Clases: ${CLASSES.length} · Sesiones: ${READY_SESSIONS.length}+${EXTRA_SESSIONS.length}`);
if (errors) { console.error(`${errors} errores`); process.exit(1); } else console.log("✓ Datos válidos");
