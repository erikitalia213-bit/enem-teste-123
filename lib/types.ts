/* ============================================================
 *  Tipos base de FLAGLAB 5x5
 * ============================================================ */

export type Level = "Principiante" | "Intermedio" | "Avanzado";
export const LEVELS: Level[] = ["Principiante", "Intermedio", "Avanzado"];

export type AgeGroup = "6-8" | "9-11" | "12-14" | "15-17" | "Adultos";
export const AGE_GROUPS: AgeGroup[] = ["6-8", "9-11", "12-14", "15-17", "Adultos"];

/* ---------------- Diagramas ---------------- */

export interface Pt {
  x: number;
  y: number;
}

export type Team = "O" | "D";

export type RouteType =
  | "go"
  | "slant"
  | "out"
  | "in"
  | "corner"
  | "post"
  | "drag"
  | "hook"
  | "screen"
  | "custom"
  // tipos extra usados por la biblioteca y el creador
  | "flat"
  | "wheel"
  | "comeback"
  | "seam"
  | "fade"
  | "whip"
  | "arrow"
  | "cross"
  | "sit"
  | "rollout"
  | "run"
  | "motion"
  | "rush"
  | "drop"
  | "handoff";

export type LineStyle = "solid" | "dashed" | "dotted";
export type LineEnd = "arrow" | "block" | "none";

export interface DiagramPlayer {
  id: string;
  team: Team;
  /** Texto que aparece dentro del jugador (QB, C, X, Y, Z, CB...) */
  label: string;
  /** Posición/rol ("WR", "QB", "C", "Rusher"...) */
  role: string;
  x: number;
  y: number;
  color?: string;
}

export interface DiagramRoute {
  id: string;
  playerId: string;
  type: RouteType;
  /** Puntos del trazo SIN incluir el punto de salida (se toma del jugador o de la ruta previa). */
  points: Pt[];
  color: string;
  style: LineStyle;
  end: LineEnd;
  /** Si es true, esta ruta empieza donde termina la ruta anterior del mismo jugador (ej. después de un motion). */
  chained?: boolean;
}

export interface DiagramNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
}

export interface DiagramZone {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  color: string;
  label?: string;
}

export interface Diagram {
  players: DiagramPlayer[];
  routes: DiagramRoute[];
  notes: DiagramNote[];
  zones: DiagramZone[];
}

/* ---------------- Jugadas ---------------- */

export type PlaySide = "offense" | "defense";

export type FormationId = "spread" | "trips-right" | "trips-left" | "twins" | "stack" | "bunch" | "empty" | "custom";

export interface PlayInfo {
  objective: string;
  description: string;
  primaryRead: string;
  secondaryRead: string;
  coachTip: string;
}

export interface Play extends PlayInfo {
  id: string;
  name: string;
  side: PlaySide;
  formation: FormationId;
  category: string;
  level: Level;
  diagram: Diagram;
  source: "library" | "user";
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}

/* ---------------- Playbook ---------------- */

export type PlaybookSectionId = "ofensiva" | "defensiva" | "redzone" | "conversion" | "especiales";

export interface PlayRef {
  /** id de jugada (biblioteca, usuario o esquema defensivo) */
  id: string;
  source: "library" | "user" | "defense";
  note?: string;
}

export interface Playbook {
  id: string;
  teamName: string;
  category: string;
  season: string;
  coach: string;
  notes: string;
  sections: Record<PlaybookSectionId, PlayRef[]>;
  createdAt: number;
  updatedAt: number;
}

/* ---------------- Drills ---------------- */

export type DrillCategory =
  | "Warm-up"
  | "Pase"
  | "Recepción"
  | "Rutas"
  | "Flag pulling"
  | "Agilidad"
  | "Velocidad"
  | "Ataque"
  | "Defensa"
  | "Comunicación"
  | "QB"
  | "Red Zone"
  | "Juego"
  | "Vuelta a la calma";

export interface Drill {
  id: string;
  name: string;
  category: DrillCategory;
  objective: string;
  ages: AgeGroup[];
  level: Level;
  /** Jugadores mínimos y recomendados */
  players: { min: number; ideal: string };
  material: string[];
  duration: number;
  setup: string;
  steps: string[];
  variations: string[];
  commonErrors: string[];
  coachTip: string;
}

/* ---------------- Entrenamientos ---------------- */

export type TrainingGoal =
  | "Pase"
  | "Recepción"
  | "Rutas"
  | "Flag pulling"
  | "Agilidad"
  | "Ataque"
  | "Defensa"
  | "Red Zone"
  | "Juego completo"
  | "Preparación para partido";

export const TRAINING_GOALS: TrainingGoal[] = [
  "Pase",
  "Recepción",
  "Rutas",
  "Flag pulling",
  "Agilidad",
  "Ataque",
  "Defensa",
  "Red Zone",
  "Juego completo",
  "Preparación para partido",
];

export const DURATIONS = [30, 45, 60, 75, 90] as const;

export interface TrainingBlock {
  id: string;
  phase: string;
  minutes: number;
  drillId?: string;
  title: string;
  objective: string;
  material: string;
  organization: string;
  execution: string[];
  coachTip: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  date?: string;
  age: AgeGroup;
  level: Level;
  duration: number;
  players: number;
  goal: TrainingGoal;
  blocks: TrainingBlock[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

/* ---------------- Equipo ---------------- */

export interface Player {
  id: string;
  name: string;
  number: string;
  primary: string;
  secondary: string;
  notes: string;
  createdAt: number;
}

export interface DepthChart {
  [slot: string]: string[]; // ids de jugadores en orden
}

/* ---------------- Tracker ---------------- */

export const STAT_KEYS = ["completions", "receptions", "touchdowns", "interceptions", "flags"] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export const STAT_LABELS: Record<StatKey, string> = {
  completions: "Pases completos",
  receptions: "Recepciones",
  touchdowns: "Touchdowns",
  interceptions: "Intercepciones",
  flags: "Flags retiradas",
};
export const STAT_SHORT: Record<StatKey, string> = {
  completions: "PC",
  receptions: "REC",
  touchdowns: "TD",
  interceptions: "INT",
  flags: "FLG",
};

export interface StatLine {
  playerId: string;
  playerName: string;
  completions: number;
  receptions: number;
  touchdowns: number;
  interceptions: number;
  flags: number;
  notes: string;
}

export interface TrackerSession {
  id: string;
  kind: "Entrenamiento" | "Partido";
  date: string;
  opponent: string;
  scoreUs?: string;
  scoreThem?: string;
  lines: StatLine[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

/* ---------------- Clases escolares ---------------- */

export interface SchoolClass {
  id: string;
  number: number;
  title: string;
  age: string;
  duration: number;
  objectives: string[];
  material: string[];
  warmup: string[];
  main: string[];
  finalGame: string[];
  cooldown: string[];
  safety: string[];
}

/* ---------------- Sesiones prediseñadas (bonus) ---------------- */

export interface ReadySession {
  id: string;
  number: number;
  title: string;
  level: Level;
  age: string;
  duration: number;
  focus: string;
  group?: string;
  blocks: { drillId: string; minutes: number; note?: string }[];
  coachNote: string;
}

/* ---------------- Defensa (complemento) ---------------- */

export type DefenseGroup = "Zona" | "Hombre" | "Presión" | "Mixtas" | "Situacionales";

export interface DefenseScheme {
  id: string;
  name: string;
  group: DefenseGroup;
  level: Level;
  vs: FormationId;
  diagram: Diagram;
  concept: string;
  strengths: string[];
  weaknesses: string[];
  whenToUse: string;
  coachTip: string;
}
