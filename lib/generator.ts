/* ============================================================
 *  GENERADOR DE ENTRENAMIENTOS (reglas internas, sin IA externa)
 *  1. Toma la plantilla del objetivo.
 *  2. En sesiones cortas elimina fases opcionales.
 *  3. Reparte los minutos: la suma SIEMPRE es igual a la duración.
 *  4. Para cada fase elige un drill compatible con la edad (obligatorio),
 *     el nivel y el número de jugadores, sin repetir.
 *  5. Si no hay drill apto para el número de jugadores, adapta la fase
 *     (grupos pequeños) y lo explica en el consejo.
 *  6. Una semilla permite "Otra versión" con variaciones.
 * ============================================================ */

import { AGE_TIPS, TRAINING_TEMPLATES } from "@/data/trainingTemplates";
import { uid } from "./field";
import type { AgeGroup, Drill, DrillCategory, Level, TrainingBlock, TrainingGoal, TrainingSession } from "./types";

const LEVEL_RANK: Record<Level, number> = { Principiante: 0, Intermedio: 1, Avanzado: 2 };

export interface GeneratorInput {
  age: AgeGroup;
  level: Level;
  duration: number;
  players: number;
  goal: TrainingGoal;
  seed?: number;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un drill es apto si es para la edad, no está más de un nivel arriba y alcanza con los jugadores. */
export function isSuitable(dr: Drill, input: Pick<GeneratorInput, "age" | "level" | "players">) {
  return dr.ages.includes(input.age) && LEVEL_RANK[dr.level] - LEVEL_RANK[input.level] <= 1 && dr.players.min <= input.players;
}

function scoreDrill(dr: Drill, input: GeneratorInput): number {
  let s = 0;
  const diff = LEVEL_RANK[dr.level] - LEVEL_RANK[input.level];
  if (diff === 0) s += 3;
  else if (diff < 0) s += 2;
  else s -= 3 * diff;
  // Con los más chicos, preferir drills de nivel principiante
  if (input.age === "6-8" && dr.level !== "Principiante") s -= 4;
  return s;
}

export function blockFromDrill(dr: Drill, phase: string, minutes: number, age?: AgeGroup, extraTip = ""): TrainingBlock {
  const ageTip = age && (phase.toLowerCase().includes("calentamiento") || phase.toLowerCase().includes("scrimmage")) ? ` ${AGE_TIPS[age]}` : "";
  return {
    id: uid("blk"),
    phase,
    minutes,
    drillId: dr.id,
    title: dr.name,
    objective: dr.objective,
    material: dr.material.join(", "),
    organization: `${dr.setup} Jugadores: ${dr.players.ideal}.`,
    execution: dr.steps.slice(),
    coachTip: `${dr.coachTip}${ageTip}${extraTip ? ` ${extraTip}` : ""}`.trim(),
  };
}

/**
 * Reparte `total` minutos según los pesos. Garantiza:
 *  - la suma exacta es `total`
 *  - ningún bloque tiene menos de 3 minutos
 *  - múltiplos de 5 cuando la sesión es de 45 min o más
 */
export function splitMinutes(weights: number[], total: number): number[] {
  const n = weights.length;
  if (!n) return [];
  const step = total >= 45 ? 5 : 1;
  const min = Math.min(step >= 5 ? 5 : 3, Math.floor(total / n));
  const sum = weights.reduce((a, b) => a + b, 0);
  const mins = weights.map((w) => Math.max(min, Math.round(((w / sum) * total) / step) * step));
  let diff = total - mins.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (diff !== 0 && guard++ < 500) {
    if (diff > 0) {
      const idx = mins.indexOf(Math.max(...mins));
      const add = Math.min(step, diff);
      mins[idx] += add;
      diff -= add;
    } else {
      // quita del bloque más grande que pueda bajar sin romper el mínimo
      const order = mins.map((m, i) => [m, i]).sort((a, b) => b[0] - a[0]);
      const found = order.find(([m]) => m - Math.min(step, -diff) >= min);
      if (!found) break;
      const sub = Math.min(step, -diff);
      mins[found[1]] -= sub;
      diff += sub;
    }
  }
  return mins;
}

/** Fases alternativas cuando no hay suficientes jugadores para un juego. */
const SMALL_GROUP_FALLBACK: DrillCategory[] = ["Rutas", "Recepción", "Pase", "Flag pulling", "Agilidad"];

export function generateTraining(input: GeneratorInput, drills: Drill[]): TrainingSession {
  const rnd = mulberry32((input.seed ?? Date.now()) >>> 0);
  let phases = TRAINING_TEMPLATES[input.goal].slice();
  if (input.duration <= 30) phases = phases.filter((p) => !p.optional);
  else if (input.duration <= 45) {
    const idx = phases.findIndex((p) => p.optional && !p.cats.includes("Vuelta a la calma"));
    if (idx >= 0) phases.splice(idx, 1);
  }
  const minutes = splitMinutes(
    phases.map((p) => p.weight),
    input.duration,
  );

  const used = new Set<string>();
  const blocks: TrainingBlock[] = phases.map((ph, k) => {
    const pick = (cats: DrillCategory[]) =>
      drills
        .filter((dr) => cats.includes(dr.category) && !used.has(dr.id) && isSuitable(dr, input))
        .map((dr) => ({ dr, s: scoreDrill(dr, input) + rnd() * 2.5 }))
        .sort((a, b) => b.s - a.s)[0]?.dr;

    let extraTip = "";
    let phase = ph.phase;
    let dr = pick(ph.cats);
    if (!dr) {
      // Grupo pequeño o edad sin drill de esa categoría: se adapta la fase
      dr = pick(SMALL_GROUP_FALLBACK);
      if (dr) {
        phase = `${ph.phase} (adaptado)`;
        extraTip = `Con ${input.players} jugadores no alcanza para “${ph.phase.toLowerCase()}”: se usa un ejercicio en grupos pequeños.`;
      }
    }
    // Último recurso: cualquier drill apto para la edad (nunca uno de otra edad)
    dr = dr ?? drills.find((x) => x.ages.includes(input.age) && !used.has(x.id)) ?? drills[0];
    used.add(dr.id);
    return blockFromDrill(dr, phase, minutes[k], input.age, extraTip);
  });

  if (input.players >= 20) {
    blocks[0] = { ...blocks[0], coachTip: `${blocks[0].coachTip} Con ${input.players} jugadores, divide en estaciones de 6 a 8 y usa capitanes como asistentes para que nadie espere en fila.` };
  }

  const now = Date.now();
  return {
    id: uid("ent"),
    title: `${input.goal} · ${input.age === "Adultos" ? "Adultos" : `${input.age} años`} · ${input.duration} min`,
    age: input.age,
    level: input.level,
    duration: input.duration,
    players: input.players,
    goal: input.goal,
    blocks,
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}
