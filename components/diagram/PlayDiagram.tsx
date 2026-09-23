import { memo } from "react";
import { FIELD_H, FIELD_W, LOS_Y, RUSH_LINE_Y, YD, routeStart } from "@/lib/field";
import type { Diagram, DiagramPlayer, DiagramRoute, Pt } from "@/lib/types";

/* ============================================================
 *  PlayDiagram — render SVG de un diagrama (solo lectura).
 *  El editor usa las mismas piezas (FieldBackground, RoutePath,
 *  PlayerMark) para que todo se vea idéntico en app, impresión
 *  y muñequeras.
 * ============================================================ */

export type DiagramTheme = "field" | "print";

export function FieldBackground({ theme = "field", showRushLine = false, idPrefix = "f" }: { theme?: DiagramTheme; showRushLine?: boolean; idPrefix?: string }) {
  const print = theme === "print";
  const lines: number[] = [];
  for (let y = LOS_Y - 5 * YD; y > 0; y -= 5 * YD) lines.push(y);
  const ticks: number[] = [];
  for (let y = LOS_Y + 4 * YD; y > 2; y -= YD) ticks.push(y);
  return (
    <g aria-hidden="true">
      {print ? (
        <rect x={0} y={0} width={FIELD_W} height={FIELD_H} fill="#ffffff" />
      ) : (
        <>
          <defs>
            <linearGradient id={`${idPrefix}-grass`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f2a16" />
              <stop offset="1" stopColor="#0b1d10" />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={FIELD_W} height={FIELD_H} fill={`url(#${idPrefix}-grass)`} />
        </>
      )}
      {lines.map((y) => (
        <line key={y} x1={0} x2={FIELD_W} y1={y} y2={y} stroke={print ? "#cfd4d4" : "rgba(255,255,255,0.10)"} strokeWidth={0.35} />
      ))}
      {ticks.map((y) => (
        <g key={`t${y}`}>
          <line x1={1} x2={3} y1={y} y2={y} stroke={print ? "#dfe3e3" : "rgba(255,255,255,0.12)"} strokeWidth={0.3} />
          <line x1={97} x2={99} y1={y} y2={y} stroke={print ? "#dfe3e3" : "rgba(255,255,255,0.12)"} strokeWidth={0.3} />
        </g>
      ))}
      {showRushLine && (
        <line x1={0} x2={FIELD_W} y1={RUSH_LINE_Y} y2={RUSH_LINE_Y} stroke={print ? "#e57a5a" : "rgba(255,122,89,0.45)"} strokeWidth={0.35} strokeDasharray="1.2 1.2" />
      )}
      <line x1={0} x2={FIELD_W} y1={LOS_Y} y2={LOS_Y} stroke={print ? "#8a9191" : "rgba(157,163,163,0.55)"} strokeWidth={0.5} />
    </g>
  );
}

function pathD(start: Pt, points: Pt[]) {
  return `M ${start.x} ${start.y} ` + points.map((p) => `L ${p.x} ${p.y}`).join(" ");
}

function endMarkerAngle(from: Pt, to: Pt) {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}

export function RoutePath({
  route,
  start,
  theme = "field",
  width = 0.75,
  highlighted = false,
}: {
  route: DiagramRoute;
  start: Pt;
  theme?: DiagramTheme;
  width?: number;
  highlighted?: boolean;
}) {
  if (!route.points.length) return null;
  const pts = route.points;
  const last = pts[pts.length - 1];
  const prev = pts.length > 1 ? pts[pts.length - 2] : start;
  const angle = endMarkerAngle(prev, last);
  let color = route.color;
  if (theme === "print") {
    // En impresión: blanco → negro, amarillo → ámbar oscuro, verde → verde oscuro
    const map: Record<string, string> = { "#FFFFFF": "#111111", "#FFD23F": "#b07d00", "#49F05A": "#138a22", "#9DA3A3": "#6b7272" };
    color = map[color.toUpperCase()] ?? color;
  }
  const dash = route.style === "dashed" ? "1.6 1.1" : route.style === "dotted" ? "0.4 1" : undefined;
  const sw = highlighted ? width * 1.6 : width;
  return (
    <g>
      <path d={pathD(start, pts)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      {route.end === "arrow" && (
        <path d="M -1.9 -1.25 L 0.35 0 L -1.9 1.25 Z" fill={color} transform={`translate(${last.x} ${last.y}) rotate(${angle})`} />
      )}
      {route.end === "block" && (
        <line x1={-1.4} x2={1.4} y1={0} y2={0} stroke={color} strokeWidth={sw * 1.1} strokeLinecap="round" transform={`translate(${last.x} ${last.y}) rotate(${angle + 90})`} />
      )}
    </g>
  );
}

export function PlayerMark({
  player,
  theme = "field",
  selected = false,
  scale = 1,
}: {
  player: DiagramPlayer;
  theme?: DiagramTheme;
  selected?: boolean;
  scale?: number;
}) {
  const print = theme === "print";
  const r = 3.1 * scale;
  const label = player.label.slice(0, 3);
  const fs = (label.length > 2 ? 2.2 : 2.7) * scale;
  const isQB = player.role === "QB";
  const isC = player.role === "C";
  if (player.team === "D") {
    const stroke = player.color ?? (print ? "#b0452a" : "#FF7A59");
    return (
      <g transform={`translate(${player.x} ${player.y})`}>
        <path
          d={`M 0 ${r} L ${-r} ${-r * 0.8} L ${r} ${-r * 0.8} Z`}
          fill={print ? "#fff" : "#1a0f0c"}
          stroke={selected ? "#49F05A" : stroke}
          strokeWidth={selected ? 0.9 : 0.6}
          strokeLinejoin="round"
        />
        <text y={-0.1 * scale} textAnchor="middle" dominantBaseline="middle" fontSize={fs * 0.85} fontWeight={700} fill={print ? "#b0452a" : "#FFD2C4"} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {label}
        </text>
      </g>
    );
  }
  const fill = print ? "#ffffff" : isQB ? "#173B20" : "#070909";
  const stroke = player.color ?? (print ? "#111" : isQB ? "#49F05A" : "#FFFFFF");
  return (
    <g transform={`translate(${player.x} ${player.y})`}>
      {selected && <circle r={r + 1.3} fill="none" stroke="#49F05A" strokeWidth={0.5} strokeDasharray="1 0.8" />}
      {isC ? (
        <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={0.8} fill={fill} stroke={stroke} strokeWidth={0.6} />
      ) : (
        <circle r={r} fill={fill} stroke={stroke} strokeWidth={0.6} />
      )}
      <text y={0.15} textAnchor="middle" dominantBaseline="middle" fontSize={fs} fontWeight={700} fill={print ? "#111" : "#FFFFFF"} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        {label}
      </text>
    </g>
  );
}

interface PlayDiagramProps {
  diagram: Diagram;
  theme?: DiagramTheme;
  className?: string;
  title?: string;
  /** Recorta el campo para que se vea más compacto (muñequeras) */
  compact?: boolean;
  showRushLine?: boolean;
  showNotes?: boolean;
  /** Ajusta la vista al contenido (jugadores y rutas). Ideal para muñequeras. */
  fit?: boolean;
}

function fitBox(d: Diagram) {
  const xs: number[] = [];
  const ys: number[] = [];
  d.players.forEach((p) => (xs.push(p.x), ys.push(p.y)));
  d.routes.forEach((r) => r.points.forEach((p) => (xs.push(p.x), ys.push(p.y))));
  d.zones.forEach((z) => (xs.push(z.x - z.rx, z.x + z.rx), ys.push(z.y - z.ry, z.y + z.ry)));
  if (!xs.length) return `0 0 ${FIELD_W} ${FIELD_H}`;
  const pad = 5;
  const x0 = Math.max(0, Math.min(...xs) - pad);
  const x1 = Math.min(FIELD_W, Math.max(...xs) + pad);
  const y0 = Math.max(0, Math.min(...ys) - pad);
  const y1 = Math.min(FIELD_H, Math.max(...ys) + pad);
  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
}

function PlayDiagramBase({ diagram, theme = "field", className, title, compact = false, showRushLine, showNotes = true, fit = false }: PlayDiagramProps) {
  const hasDefense = diagram.players.some((p) => p.team === "D");
  const vb = fit ? fitBox(diagram) : compact ? `0 4 ${FIELD_W} ${FIELD_H - 4}` : `0 0 ${FIELD_W} ${FIELD_H}`;
  const idPrefix = `pd${Math.abs(hashCode(JSON.stringify(diagram.players.map((p) => [p.x, p.y])) + (title ?? "")))}`;
  return (
    <svg viewBox={vb} className={className ?? "block h-auto w-full"} role="img" aria-label={title ? `Diagrama: ${title}` : "Diagrama de jugada"} preserveAspectRatio="xMidYMid meet">
      {title && <title>{title}</title>}
      <FieldBackground theme={theme} showRushLine={showRushLine ?? hasDefense} idPrefix={idPrefix} />
      {diagram.zones.map((z) => (
        <g key={z.id}>
          <ellipse cx={z.x} cy={z.y} rx={z.rx} ry={z.ry} fill={z.color} fillOpacity={theme === "print" ? 0.18 : 0.16} stroke={z.color} strokeOpacity={0.6} strokeWidth={0.35} strokeDasharray="1 0.8" />
          {z.label && (
            <text x={z.x} y={z.y} textAnchor="middle" dominantBaseline="middle" fontSize={2.4} fontWeight={600} fill={theme === "print" ? "#222" : "rgba(255,255,255,0.75)"}>
              {z.label}
            </text>
          )}
        </g>
      ))}
      {diagram.routes.map((r) => (
        <RoutePath key={r.id} route={r} start={routeStart(diagram, r)} theme={theme} width={compact ? 1 : 0.75} />
      ))}
      {diagram.players.map((p) => (
        <PlayerMark key={p.id} player={p} theme={theme} />
      ))}
      {showNotes &&
        diagram.notes.map((n) => (
          <text key={n.id} x={n.x} y={n.y} textAnchor="middle" fontSize={2.6} fontWeight={600} fill={theme === "print" ? "#111" : n.color ?? "#FFFFFF"} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {n.text}
          </text>
        ))}
    </svg>
  );
}

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Versión sin memo (útil en Server Components). */
export const DiagramSvg = PlayDiagramBase;
export const PlayDiagram = memo(PlayDiagramBase);
export default PlayDiagram;
