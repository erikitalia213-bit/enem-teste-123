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
for (const d of DRILLS) { if (dIds.has(d.id)) err(`Drill duplicado ${d.id}`); dIds.add(d.id); }
for (const s of [...READY_SESSIONS, ...EXTRA_SESSIONS]) {
  const sum = s.blocks.reduce((a, b) => a + b.minutes, 0);
  if (sum !== s.duration) err(`Sesión ${s.id} "${s.title}" suma ${sum} ≠ ${s.duration}`);
  for (const b of s.blocks) if (!DRILL_MAP[b.drillId]) err(`Sesión ${s.id}: drill inexistente ${b.drillId}`);
}
console.log(`Jugadas: ${PLAYS.length} · Drills: ${DRILLS.length} · Clases: ${CLASSES.length} · Sesiones: ${READY_SESSIONS.length}+${EXTRA_SESSIONS.length}`);
if (errors) { console.error(`${errors} errores`); process.exit(1); } else console.log("✓ Datos válidos");
