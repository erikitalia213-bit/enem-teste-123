/* ============================================================
 *  Motor de campo y rutas de FLAGLAB
 *  Sistema de coordenadas del diagrama:
 *   - viewBox 0 0 100 90
 *   - Ancho del campo (25 yardas) = 100 unidades → 4 unidades por yarda
 *   - Línea de scrimmage (LOS) en y = 62
 *   - La ofensiva ataca hacia arriba (y menor = más profundo)
 * ============================================================ */

import type { Diagram, DiagramPlayer, DiagramRoute, FormationId, LineEnd, LineStyle, Pt, RouteType } from "./types";

export const FIELD_W = 100;
export const FIELD_H = 90;
export const LOS_Y = 62;
export const YD = 4;
/** Línea de 7 yardas para el rusher (reglas comunes de 5x5). */
export const RUSH_LINE_Y = LOS_Y - 7 * YD;

export const ROUTE_COLORS = {
  primary: "#49F05A",
  secondary: "#FFD23F",
  other: "#FFFFFF",
  motion: "#9DA3A3",
  defense: "#FF7A59",
  zone: "#5AC8FA",
};

export const COLOR_OPTIONS = [
  { name: "Verde", value: "#49F05A" },
  { name: "Amarillo", value: "#FFD23F" },
  { name: "Blanco", value: "#FFFFFF" },
  { name: "Azul", value: "#5AC8FA" },
  { name: "Naranja", value: "#FF7A59" },
  { name: "Rosa", value: "#FF6BD6" },
  { name: "Gris", value: "#9DA3A3" },
];

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const round1 = (v: number) => Math.round(v * 10) / 10;

let _uid = 0;
export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${(_uid++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ---------------- Formaciones ofensivas ---------------- */

export interface FormationDef {
  id: FormationId;
  name: string;
  description: string;
  /** Posiciones de QB, C, X, Y, Z */
  pos: Record<"QB" | "C" | "X" | "Y" | "Z", Pt>;
}

const C_POS: Pt = { x: 50, y: 64.5 };
const QB_POS: Pt = { x: 50, y: 73 };

export const FORMATIONS: FormationDef[] = [
  {
    id: "spread",
    name: "Spread",
    description: "Dos receptores abiertos y uno en el backfield junto al QB. Balanceada y fácil de leer.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 8, y: 64.5 }, Y: { x: 60, y: 73 }, Z: { x: 92, y: 64.5 } },
  },
  {
    id: "trips-right",
    name: "Trips Right",
    description: "Tres receptores del lado derecho. Sobrecarga un lado y abre espacio al otro.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 64, y: 65.5 }, Y: { x: 77, y: 65.5 }, Z: { x: 92, y: 64.5 } },
  },
  {
    id: "trips-left",
    name: "Trips Left",
    description: "Tres receptores del lado izquierdo. Espejo de Trips Right.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 8, y: 64.5 }, Y: { x: 23, y: 65.5 }, Z: { x: 36, y: 65.5 } },
  },
  {
    id: "twins",
    name: "Twins",
    description: "Dos receptores juntos de un lado y uno solo del otro. Ideal para combinaciones de dos rutas.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 8, y: 64.5 }, Y: { x: 76, y: 65.5 }, Z: { x: 88, y: 64.5 } },
  },
  {
    id: "stack",
    name: "Stack",
    description: "Dos receptores uno detrás del otro. Complica el cubrimiento hombre a hombre.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 8, y: 64.5 }, Y: { x: 80, y: 64.5 }, Z: { x: 80, y: 70.5 } },
  },
  {
    id: "bunch",
    name: "Bunch",
    description: "Tres receptores en triángulo cerrado. Genera cruces y cortinas naturales.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 73, y: 67.5 }, Y: { x: 79, y: 64.5 }, Z: { x: 85, y: 67.5 } },
  },
  {
    id: "empty",
    name: "Empty",
    description: "Nadie en el backfield más que el QB. Receptores muy abiertos para estirar a la defensa.",
    pos: { QB: QB_POS, C: C_POS, X: { x: 5, y: 64.5 }, Y: { x: 70, y: 65.5 }, Z: { x: 95, y: 64.5 } },
  },
];

export const FORMATION_MAP: Record<string, FormationDef> = Object.fromEntries(FORMATIONS.map((f) => [f.id, f]));

export const formationName = (id: FormationId | string) => (id === "custom" ? "Personalizada" : FORMATION_MAP[id]?.name ?? id);

export const OFFENSE_SLOTS = ["QB", "C", "X", "Y", "Z"] as const;
export type OffenseSlot = (typeof OFFENSE_SLOTS)[number];

export function offensePlayers(formation: FormationId, mirror = false): DiagramPlayer[] {
  const def = FORMATION_MAP[formation] ?? FORMATIONS[0];
  return OFFENSE_SLOTS.map((slot) => {
    const p = def.pos[slot];
    return {
      id: slot,
      team: "O" as const,
      label: slot,
      role: slot === "QB" ? "QB" : slot === "C" ? "C" : "WR",
      x: mirror ? 100 - p.x : p.x,
      y: p.y,
    };
  });
}

/* ---------------- Defensa base ---------------- */

export type DefenseFront = "zona-2" | "zona-3" | "hombre" | "base";

export function defensePlayers(kind: DefenseFront = "base"): DiagramPlayer[] {
  const d = (id: string, label: string, role: string, x: number, y: number): DiagramPlayer => ({ id, team: "D", label, role, x, y });
  switch (kind) {
    case "zona-2":
      return [d("D1", "CB", "Esquina", 12, 50), d("D2", "CB", "Esquina", 88, 50), d("D3", "S", "Safety", 28, 26), d("D4", "S", "Safety", 72, 26), d("D5", "R", "Rusher", 50, RUSH_LINE_Y)];
    case "zona-3":
      return [d("D1", "CB", "Esquina", 10, 40), d("D2", "CB", "Esquina", 90, 40), d("D3", "S", "Safety", 50, 22), d("D4", "LB", "Apoyador", 50, 48), d("D5", "R", "Rusher", 50, RUSH_LINE_Y)];
    case "hombre":
      return [d("D1", "CB", "Esquina", 8, 55), d("D2", "CB", "Esquina", 92, 55), d("D3", "S", "Safety", 50, 32), d("D4", "LB", "Apoyador", 62, 52), d("D5", "R", "Rusher", 50, RUSH_LINE_Y)];
    default:
      return [d("D1", "CB", "Esquina", 10, 50), d("D2", "CB", "Esquina", 90, 50), d("D3", "S", "Safety", 50, 28), d("D4", "LB", "Apoyador", 50, 47), d("D5", "R", "Rusher", 50, RUSH_LINE_Y)];
  }
}

/* ---------------- Rutas ---------------- */

export const ROUTE_TYPES: { id: RouteType; name: string; hint: string }[] = [
  { id: "go", name: "Go", hint: "Vertical directo, velocidad total." },
  { id: "slant", name: "Slant", hint: "Diagonal rápida hacia adentro." },
  { id: "out", name: "Out", hint: "Corte de 90° hacia la banda." },
  { id: "in", name: "In", hint: "Corte de 90° hacia el centro." },
  { id: "corner", name: "Corner", hint: "Vertical y quiebre a la esquina." },
  { id: "post", name: "Post", hint: "Vertical y quiebre al poste (centro)." },
  { id: "drag", name: "Drag", hint: "Cruce corto por debajo." },
  { id: "hook", name: "Hook", hint: "Sube, frena y regresa al QB." },
  { id: "screen", name: "Screen", hint: "Pase detrás de la línea." },
  { id: "custom", name: "Custom", hint: "Dibuja tu propia ruta punto por punto." },
];

export const EXTRA_ROUTE_TYPES: { id: RouteType; name: string; hint: string }[] = [
  { id: "flat", name: "Flat", hint: "Salida corta hacia la banda." },
  { id: "wheel", name: "Wheel", hint: "Sale al flat y sube por la banda." },
  { id: "comeback", name: "Comeback", hint: "Profunda y regresa hacia la banda." },
  { id: "seam", name: "Seam", hint: "Vertical por el hueco entre defensores." },
  { id: "fade", name: "Fade", hint: "Vertical pegada a la banda." },
  { id: "whip", name: "Whip", hint: "Amago adentro y sale hacia afuera." },
  { id: "arrow", name: "Arrow", hint: "Diagonal rápida hacia afuera." },
  { id: "cross", name: "Cross", hint: "Cruce profundo del campo." },
  { id: "sit", name: "Sit", hint: "Se sienta en el hueco de la zona." },
  { id: "motion", name: "Motion", hint: "Movimiento antes del snap." },
  { id: "rollout", name: "Rollout", hint: "El QB sale del pocket." },
];

export const ALL_ROUTE_TYPES = [...ROUTE_TYPES, ...EXTRA_ROUTE_TYPES];
export const routeName = (t: RouteType) => ALL_ROUTE_TYPES.find((r) => r.id === t)?.name ?? t;

export interface RouteOpts {
  /** profundidad en yardas */
  depth?: number;
  /** fuerza la dirección "hacia adentro": l = izquierda, r = derecha, flip = invierte la natural */
  dir?: "l" | "r" | "flip";
  /** puntos personalizados en yardas relativas (dx, dy); dy negativo = hacia adelante */
  pts?: [number, number][];
  /** distancia horizontal para motion/rollout en yardas (+ derecha) */
  dx?: number;
}

/** Calcula el signo horizontal "hacia adentro" (+1 = derecha). */
function insideSign(start: Pt, dir?: RouteOpts["dir"]): number {
  if (dir === "l") return -1;
  if (dir === "r") return 1;
  const base = start.x < 50 ? 1 : start.x > 50 ? -1 : 1;
  return dir === "flip" ? -base : base;
}

/**
 * Genera los puntos de una ruta a partir del tipo.
 * Devuelve puntos absolutos (sin el punto de inicio).
 */
export function buildRoutePoints(type: RouteType, start: Pt, opts: RouteOpts = {}): Pt[] {
  // i = dirección hacia adentro, o = hacia afuera
  const i = insideSign(start, opts.dir);
  const o = -i;
  const d = opts.depth;
  const rel = (pairs: [number, number][]): Pt[] =>
    pairs.map(([dx, dy]) => ({
      x: round1(clamp(start.x + dx * YD, 2, 98)),
      y: round1(clamp(start.y + dy * YD, 3, 88)),
    }));
  const toTop = (yd: number) => Math.max(-((start.y - 5) / YD), -yd);

  switch (type) {
    case "go":
      return rel([[0, toTop(d ?? 14)]]);
    case "fade":
      return rel([[o * 1.2, -2], [o * 2, toTop(d ?? 14)]]);
    case "seam":
      return rel([[i * 0.8, -2.5], [i * 0.8, toTop(d ?? 14)]]);
    case "slant": {
      const dd = d ?? 1.5;
      return rel([[0, -dd], [i * 6, -dd - 5]]);
    }
    case "out": {
      const dd = d ?? 5;
      return rel([[0, -dd], [o * 5, -dd]]);
    }
    case "in": {
      const dd = d ?? 6;
      return rel([[0, -dd], [i * 8, -dd]]);
    }
    case "corner": {
      const dd = d ?? 6;
      return rel([[0, -dd], [o * 5, -dd - 5]]);
    }
    case "post": {
      const dd = d ?? 6;
      return rel([[0, -dd], [i * 5, -dd - 6]]);
    }
    case "drag": {
      const dd = d ?? 2;
      return rel([[i * 1, -dd], [i * 10, -dd - 0.5]]);
    }
    case "cross": {
      const dd = d ?? 3;
      return rel([[0, -dd], [i * 13, -dd - 6]]);
    }
    case "hook": {
      const dd = d ?? 6;
      return rel([[0, -dd], [i * 0.8, -dd + 1.5]]);
    }
    case "sit": {
      const dd = d ?? 4;
      return rel([[i * 0.6, -dd], [i * 0.6, -dd + 0.6]]);
    }
    case "comeback": {
      const dd = d ?? 9;
      return rel([[0, -dd], [o * 1.5, -dd + 2]]);
    }
    case "screen":
      return rel([[o * 1, 1], [o * 3.5, 0.6]]);
    case "flat":
      return rel([[o * 2, -1], [o * 6, -1.8]]);
    case "arrow":
      return rel([[o * 4, -3]]);
    case "wheel":
      return rel([[o * 2.5, -0.6], [o * 4.5, -3], [o * 5, toTop(d ?? 13)]]);
    case "whip":
      return rel([[i * 1.8, -3], [o * 2.2, -3.2]]);
    case "motion":
    case "rollout": {
      const dx = opts.dx ?? (type === "rollout" ? 6 * i : 4 * i);
      return rel([[dx, type === "rollout" ? 0.6 : 0]]);
    }
    case "rush":
      return [{ x: 50, y: LOS_Y + 9 }];
    case "custom":
    case "run":
    case "drop":
    case "handoff":
      return rel(opts.pts ?? [[0, -4]]);
    default:
      return rel([[0, -5]]);
  }
}

export function defaultStyleFor(type: RouteType): { style: LineStyle; end: LineEnd } {
  if (type === "motion") return { style: "dashed", end: "none" };
  if (type === "handoff") return { style: "dotted", end: "none" };
  if (type === "hook" || type === "sit" || type === "comeback") return { style: "solid", end: "block" };
  return { style: "solid", end: "arrow" };
}

/* ---------------- Especificación compacta de jugadas ----------------
 * Las jugadas de la biblioteca se escriben con una notación corta
 * y se convierten aquí en diagramas completos.
 * ------------------------------------------------------------------ */

export interface RouteSpec extends RouteOpts {
  p: OffenseSlot;
  r: RouteType;
  /** 1 = lectura principal, 2 = secundaria */
  read?: 1 | 2;
  /** motion previo al snap: yardas horizontales (+ derecha) */
  m?: number;
}

export interface PlaySpecDiagram {
  formation: FormationId;
  mirror?: boolean;
  routes: RouteSpec[];
  /** ajustes de posición de jugadores (yardas relativas) */
  shift?: Partial<Record<OffenseSlot, [number, number]>>;
  notes?: { x: number; y: number; text: string }[];
}

export function buildDiagram(spec: PlaySpecDiagram): Diagram {
  const players = offensePlayers(spec.formation, spec.mirror);
  if (spec.shift) {
    for (const p of players) {
      const sh = spec.shift[p.id as OffenseSlot];
      if (sh) {
        p.x = round1(clamp(p.x + sh[0] * YD, 3, 97));
        p.y = round1(clamp(p.y + sh[1] * YD, LOS_Y + 2, 86));
      }
    }
  }
  const routes: DiagramRoute[] = [];
  let n = 0;
  for (const r of spec.routes) {
    const player = players.find((p) => p.id === r.p);
    if (!player) continue;
    let start: Pt = { x: player.x, y: player.y };
    const color = r.read === 1 ? ROUTE_COLORS.primary : r.read === 2 ? ROUTE_COLORS.secondary : ROUTE_COLORS.other;
    if (r.m) {
      const m = spec.mirror ? -r.m : r.m;
      const end = { x: round1(clamp(start.x + m * YD, 3, 97)), y: start.y };
      routes.push({ id: `r${n++}`, playerId: player.id, type: "motion", points: [end], color: ROUTE_COLORS.motion, style: "dashed", end: "none" });
      start = end;
    }
    const opts: RouteOpts = { ...r };
    // Mirror invierte direcciones absolutas
    if (spec.mirror && (opts.dir === "l" || opts.dir === "r")) opts.dir = opts.dir === "l" ? "r" : "l";
    if (spec.mirror && opts.dx) opts.dx = -opts.dx;
    if (spec.mirror && opts.pts) opts.pts = opts.pts.map(([x, y]) => [-x, y]);
    const pts = buildRoutePoints(r.r, start, opts);
    const st = defaultStyleFor(r.r);
    routes.push({
      id: `r${n++}`,
      playerId: player.id,
      type: r.r,
      points: pts,
      color: r.r === "handoff" ? ROUTE_COLORS.motion : color,
      style: st.style,
      end: st.end,
      chained: !!r.m,
    });
  }
  const notes = (spec.notes ?? []).map((nt, k) => ({ id: `n${k}`, ...nt }));
  return { players, routes, notes, zones: [] };
}

/** Punto de inicio real de una ruta (considerando rutas encadenadas). */
export function routeStart(diagram: Diagram, route: DiagramRoute): Pt {
  const player = diagram.players.find((p) => p.id === route.playerId);
  if (!player) return { x: 50, y: LOS_Y };
  if (route.chained) {
    const idx = diagram.routes.indexOf(route);
    for (let k = idx - 1; k >= 0; k--) {
      const prev = diagram.routes[k];
      if (prev.playerId === route.playerId && prev.points.length) return prev.points[prev.points.length - 1];
    }
  }
  return { x: player.x, y: player.y };
}

export const emptyDiagram = (): Diagram => ({ players: [], routes: [], notes: [], zones: [] });

export function cloneDiagram(d: Diagram): Diagram {
  return JSON.parse(JSON.stringify(d)) as Diagram;
}
