/* ============================================================
 *  Operaciones puras sobre diagramas (usadas por el Creador)
 * ============================================================ */

import {
  FORMATION_MAP,
  LOS_Y,
  OFFENSE_SLOTS,
  ROUTE_COLORS,
  buildRoutePoints,
  clamp,
  defaultStyleFor,
  defensePlayers,
  offensePlayers,
  round1,
  routeStart,
  uid,
} from "./field";
import type { Diagram, DiagramPlayer, DiagramRoute, FormationId, Pt, RouteType } from "./types";

export const snap = (v: number) => Math.round(v * 2) / 2;
export const clampPt = (p: Pt): Pt => ({ x: round1(clamp(p.x, 1.5, 98.5)), y: round1(clamp(p.y, 2, 88)) });

export function translateRoutes(routes: DiagramRoute[], playerId: string, dx: number, dy: number): DiagramRoute[] {
  return routes.map((r) => (r.playerId === playerId ? { ...r, points: r.points.map((p) => clampPt({ x: p.x + dx, y: p.y + dy })) } : r));
}

export function movePlayer(d: Diagram, id: string, to: Pt, withRoutes = true): Diagram {
  const p = d.players.find((x) => x.id === id);
  if (!p) return d;
  const target = clampPt(to);
  const dx = target.x - p.x;
  const dy = target.y - p.y;
  return {
    ...d,
    players: d.players.map((x) => (x.id === id ? { ...x, x: target.x, y: target.y } : x)),
    routes: withRoutes ? translateRoutes(d.routes, id, dx, dy) : d.routes,
  };
}

export function applyFormation(d: Diagram, formation: FormationId): Diagram {
  if (formation === "custom" || !FORMATION_MAP[formation]) return d;
  const base = offensePlayers(formation);
  let next = d;
  for (const slot of OFFENSE_SLOTS) {
    const target = base.find((b) => b.id === slot)!;
    if (next.players.some((p) => p.id === slot)) next = movePlayer(next, slot, { x: target.x, y: target.y });
    else next = { ...next, players: [...next.players, target] };
  }
  return next;
}

export function mirrorDiagram(d: Diagram): Diagram {
  const m = (p: Pt) => ({ ...p, x: round1(100 - p.x) });
  return {
    players: d.players.map((p) => ({ ...p, x: round1(100 - p.x) })),
    routes: d.routes.map((r) => ({ ...r, points: r.points.map(m) })),
    notes: d.notes.map((n) => ({ ...n, x: round1(100 - n.x) })),
    zones: d.zones.map((z) => ({ ...z, x: round1(100 - z.x) })),
  };
}

/** Asigna una ruta de plantilla a un jugador (reemplaza su ruta principal, conserva el motion). */
export function assignRoute(d: Diagram, playerId: string, type: RouteType, color?: string): Diagram {
  const player = d.players.find((p) => p.id === playerId);
  if (!player) return d;
  const motion = d.routes.find((r) => r.playerId === playerId && r.type === "motion");
  const start = motion && motion.points.length ? motion.points[motion.points.length - 1] : { x: player.x, y: player.y };
  const prev = d.routes.find((r) => r.playerId === playerId && r.type !== "motion");
  let points: Pt[];
  if (type === "rush") {
    const qb = d.players.find((p) => p.team !== player.team && p.role === "QB");
    points = [{ x: qb?.x ?? 50, y: (qb?.y ?? LOS_Y + 9) - 3 }];
  } else if (type === "drop") {
    points = [clampPt({ x: start.x, y: start.y + (player.team === "D" ? -12 : -8) })];
  } else {
    points = buildRoutePoints(type, start, type === "motion" ? { dx: start.x < 50 ? 4 : -4 } : {});
  }
  const st = defaultStyleFor(type);
  const route: DiagramRoute = {
    id: uid("r"),
    playerId,
    type,
    points,
    color: color ?? prev?.color ?? (player.team === "D" ? ROUTE_COLORS.defense : ROUTE_COLORS.other),
    style: st.style,
    end: st.end,
    chained: !!motion,
  };
  const routes = d.routes.filter((r) => !(r.playerId === playerId && r.type !== "motion"));
  return { ...d, routes: [...routes, route] };
}

/** Agrega (o reemplaza) un motion antes del snap para un jugador ofensivo. */
export function addMotion(d: Diagram, playerId: string): Diagram {
  const player = d.players.find((p) => p.id === playerId);
  if (!player) return d;
  const others = d.routes.filter((r) => r.playerId !== playerId);
  const own = d.routes.filter((r) => r.playerId === playerId && r.type !== "motion");
  const dx = player.x < 50 ? 12 : -12;
  const end = clampPt({ x: player.x + dx, y: player.y });
  const motion: DiagramRoute = { id: uid("r"), playerId, type: "motion", points: [end], color: ROUTE_COLORS.motion, style: "dashed", end: "none" };
  const chained = own.map((r) => ({ ...r, chained: true, points: r.points.map((p) => clampPt({ x: p.x + dx, y: p.y })) }));
  return { ...d, routes: [...others, motion, ...chained] };
}

export function removeRoute(d: Diagram, routeId: string): Diagram {
  const r = d.routes.find((x) => x.id === routeId);
  if (!r) return d;
  let routes = d.routes.filter((x) => x.id !== routeId);
  if (r.type === "motion") routes = routes.map((x) => (x.playerId === r.playerId ? { ...x, chained: false } : x));
  return { ...d, routes };
}

export function removePlayer(d: Diagram, id: string): Diagram {
  return { ...d, players: d.players.filter((p) => p.id !== id), routes: d.routes.filter((r) => r.playerId !== id) };
}

export function addPlayer(d: Diagram, team: "O" | "D"): { diagram: Diagram; id: string } {
  const count = d.players.filter((p) => p.team === team).length;
  const id = uid(team === "O" ? "o" : "d");
  const player: DiagramPlayer =
    team === "O"
      ? { id, team, label: "WR", role: "WR", x: clamp(20 + count * 14, 6, 94), y: LOS_Y + 3 }
      : { id, team, label: "D", role: "Defensa", x: clamp(20 + count * 14, 6, 94), y: LOS_Y - 14 };
  return { diagram: { ...d, players: [...d.players, player] }, id };
}

export function addDefense(d: Diagram): Diagram {
  if (d.players.some((p) => p.team === "D")) return d;
  return { ...d, players: [...d.players, ...defensePlayers("base")] };
}

export function removeDefense(d: Diagram): Diagram {
  const ids = new Set(d.players.filter((p) => p.team === "D").map((p) => p.id));
  return { ...d, players: d.players.filter((p) => p.team !== "D"), routes: d.routes.filter((r) => !ids.has(r.playerId)), zones: [] };
}

export function addZoneFor(d: Diagram, playerId: string): { diagram: Diagram; id: string } {
  const p = d.players.find((x) => x.id === playerId);
  const id = uid("z");
  const cx = p ? p.x : 50;
  const cy = p ? clamp(p.y - 10, 8, LOS_Y - 6) : 40;
  return { diagram: { ...d, zones: [...d.zones, { id, x: cx, y: cy, rx: 12, ry: 8, color: ROUTE_COLORS.zone }] }, id };
}

export function lastPointOf(d: Diagram, route: DiagramRoute): Pt {
  return route.points.length ? route.points[route.points.length - 1] : routeStart(d, route);
}

export function playerStartForDrawing(d: Diagram, playerId: string): Pt | null {
  const player = d.players.find((p) => p.id === playerId);
  if (!player) return null;
  const own = d.routes.filter((r) => r.playerId === playerId);
  if (own.length) {
    const last = own[own.length - 1];
    if (last.type === "motion") return last.points[last.points.length - 1];
  }
  return { x: player.x, y: player.y };
}

export function newDiagramFor(side: "offense" | "defense", formation: FormationId): Diagram {
  const f = formation === "custom" ? "spread" : formation;
  const players = side === "defense" ? [...offensePlayers(f), ...defensePlayers("base")] : offensePlayers(f);
  return { players, routes: [], notes: [], zones: [] };
}
