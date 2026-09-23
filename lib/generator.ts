/* ============================================================
 *  GENERADOR DE ENTRENAMIENTOS (sin IA externa)
 *  Reglas:
 *   1. Toma la plantilla del objetivo.
 *   2. En sesiones cortas elimina fases opcionales.
 *   3. Reparte minutos proporcionalmente (múltiplos de 5).
 *   4. Para cada fase elige un drill compatible con edad,
 *      nivel y número de jugadores, evitando repetir.
 *   5. Usa una semilla para que "Regenerar" dé variaciones.
 * ============================================================ */

import { DRILLS } from "@/data/drills";
import { AGE_TIPS, TRAINING_TEMPLATES } from "@/data/trainingTemplates";
import { uid } from "./field";
import type { AgeGroup, Drill, Level, TrainingBlock, TrainingGoal, TrainingSession } from "./types";

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

function scoreDrill(dr: Drill, input: GeneratorInput): number {
  let s = 0;
  if (dr.ages.includes(input.age)) s += 4;
  const diff = LEVEL_RANK[dr.level] - LEVEL_RANK[input.level];
  if (diff === 0) s += 3;
  else if (diff < 0) s += 2;
  else s -= 3 * diff; // demasiado avanzado
  if (dr.players.min <= input.players) s += 2;
  else s -= 5;
  return s;
}

export function blockFromDrill(dr: Drill, phase: string, minutes: number, age?: AgeGroup): TrainingBlock {
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
    coachTip: age && (phase.toLowerCase().includes("calentamiento") || phase === "Scrimmage") ? `${dr.coachTip} ${AGE_TIPS[age]}` : dr.coachTip,
  };
}

function splitMinutes(weights: number[], total: number): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const step = total >= 45 ? 5 : total >= 30 ? 5 : 1;
  const raw = weights.map((w) => (w / sum) * total);
  const mins = raw.map((r) => Math.max(step, Math.round(r / step) * step));
  let diff = total - mins.reduce((a, b) => a + b, 0);
  // Ajusta sobre el bloque más grande para que sume exacto
  let guard = 0;
  while (diff !== 0 && guard++ < 50) {
    const idx = diff > 0 ? mins.indexOf(Math.max(...mins)) : mins.findIndex((m) => m === Math.max(...mins));
    const delta = diff > 0 ? step : -step;
    if (mins[idx] + delta >= step) {
      mins[idx] += delta;
      diff -= delta;
    } else break;
  }
  return mins;
}

export function generateTraining(input: GeneratorInput): TrainingSession {
  const rnd = mulberry32((input.seed ?? Date.now()) >>> 0);
  let phases = TRAINING_TEMPLATES[input.goal].slice();
  if (input.duration <= 30) phases = phases.filter((p) => !p.optional);
  else if (input.duration <= 45) {
    // quita la primera fase opcional que no sea vuelta a la calma
    const idx = phases.findIndex((p) => p.optional && !p.cats.includes("Vuelta a la calma"));
    if (idx >= 0) phases.splice(idx, 1);
  }
  const minutes = splitMinutes(
    phases.map((p) => p.weight),
    input.duration,
  );

  const used = new Set<string>();
  const blocks: TrainingBlock[] = phases.map((ph, k) => {
    const candidates = DRILLS.filter((dr) => ph.cats.includes(dr.category) && !used.has(dr.id))
      .map((dr) => ({ dr, s: scoreDrill(dr, input) + rnd() * 2.5 }))
      .sort((a, b) => b.s - a.s);
    const pick = candidates[0]?.dr ?? DRILLS.find((dr) => ph.cats.includes(dr.category)) ?? DRILLS[0];
    used.add(pick.id);
    return blockFromDrill(pick, ph.phase, minutes[k], input.age);
  });

  const now = Date.now();
  return {
    id: uid("ent"),
    title: `${input.goal} · ${input.age} años · ${input.duration} min`,
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

/** Drills alternativos compatibles con un bloque (para "cambiar ejercicio"). */
export function alternativesFor(block: TrainingBlock, input: Pick<GeneratorInput, "age" | "level" | "players">): Drill[] {
  const current = DRILLS.find((d) => d.id === block.drillId);
  const cats = current ? [current.category] : [];
  return DRILLS.filter((d) => cats.includes(d.category))
    .sort((a, b) => scoreDrill(b, { ...input, duration: 60, goal: "Pase" }) - scoreDrill(a, { ...input, duration: 60, goal: "Pase" }));
}
