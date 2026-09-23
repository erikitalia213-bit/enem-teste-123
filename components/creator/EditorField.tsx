"use client";

import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { FieldBackground, PlayerMark, RoutePath } from "@/components/diagram/PlayDiagram";
import { FIELD_H, FIELD_W, routeStart } from "@/lib/field";
import { clampPt, movePlayer, snap } from "@/lib/diagramOps";
import type { Diagram, Pt } from "@/lib/types";

export type Mode = "select" | "draw" | "text" | "erase";
export type Selection = { kind: "player" | "route" | "note" | "zone"; id: string } | null;

type Drag =
  | { kind: "player"; id: string; offset: Pt; moved: boolean }
  | { kind: "point"; routeId: string; index: number; moved: boolean }
  | { kind: "note"; id: string; offset: Pt; moved: boolean }
  | { kind: "zone"; id: string; offset: Pt; moved: boolean };

interface Props {
  diagram: Diagram;
  selection: Selection;
  mode: Mode;
  draft: Pt[] | null;
  draftPlayerId: string | null;
  snapToGrid: boolean;
  showRushLine: boolean;
  onSelect: (s: Selection) => void;
  onCheckpoint: () => void;
  onLiveChange: (d: Diagram) => void;
  onFieldClick: (pt: Pt) => void;
  onFinishDraft: () => void;
  onErase: (s: NonNullable<Selection>) => void;
}

export function EditorField(props: Props) {
  const { diagram, selection, mode, draft, draftPlayerId, snapToGrid, showRushLine } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const [hover, setHover] = useState<Pt | null>(null);

  const toSvg = (e: { clientX: number; clientY: number }): Pt => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const pt = { x: p.x, y: p.y };
    return snapToGrid ? { x: snap(pt.x), y: snap(pt.y) } : pt;
  };

  const capture = (e: RPointerEvent) => {
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const startPlayer = (e: RPointerEvent, id: string) => {
    e.stopPropagation();
    if (mode === "erase") return props.onErase({ kind: "player", id });
    props.onSelect({ kind: "player", id });
    if (mode !== "select") return;
    const p = diagram.players.find((x) => x.id === id)!;
    const pt = toSvg(e);
    drag.current = { kind: "player", id, offset: { x: pt.x - p.x, y: pt.y - p.y }, moved: false };
    capture(e);
  };

  const startRoute = (e: RPointerEvent, id: string) => {
    e.stopPropagation();
    if (mode === "erase") return props.onErase({ kind: "route", id });
    if (mode === "draw" || mode === "text") return;
    props.onSelect({ kind: "route", id });
  };

  const startPoint = (e: RPointerEvent, routeId: string, index: number) => {
    e.stopPropagation();
    if (mode !== "select") return;
    props.onSelect({ kind: "route", id: routeId });
    drag.current = { kind: "point", routeId, index, moved: false };
    capture(e);
  };

  const startNote = (e: RPointerEvent, id: string) => {
    e.stopPropagation();
    if (mode === "erase") return props.onErase({ kind: "note", id });
    props.onSelect({ kind: "note", id });
    if (mode !== "select") return;
    const n = diagram.notes.find((x) => x.id === id)!;
    const pt = toSvg(e);
    drag.current = { kind: "note", id, offset: { x: pt.x - n.x, y: pt.y - n.y }, moved: false };
    capture(e);
  };

  const startZone = (e: RPointerEvent, id: string) => {
    e.stopPropagation();
    if (mode === "erase") return props.onErase({ kind: "zone", id });
    if (mode === "draw" || mode === "text") return;
    props.onSelect({ kind: "zone", id });
    const z = diagram.zones.find((x) => x.id === id)!;
    const pt = toSvg(e);
    drag.current = { kind: "zone", id, offset: { x: pt.x - z.x, y: pt.y - z.y }, moved: false };
    capture(e);
  };

  const onBackgroundDown = (e: RPointerEvent) => {
    const pt = clampPt(toSvg(e));
    if (mode === "draw" || mode === "text") {
      props.onFieldClick(pt);
      return;
    }
    if (mode === "select") props.onSelect(null);
  };

  const onMove = (e: RPointerEvent) => {
    const pt = toSvg(e);
    if (mode === "draw") setHover(clampPt(pt));
    const dr = drag.current;
    if (!dr) return;
    if (!dr.moved) {
      props.onCheckpoint();
      dr.moved = true;
    }
    if (dr.kind === "player") {
      props.onLiveChange(movePlayer(diagram, dr.id, { x: pt.x - dr.offset.x, y: pt.y - dr.offset.y }));
    } else if (dr.kind === "point") {
      props.onLiveChange({
        ...diagram,
        routes: diagram.routes.map((r) => (r.id === dr.routeId ? { ...r, points: r.points.map((p, i) => (i === dr.index ? clampPt(pt) : p)) } : r)),
      });
    } else if (dr.kind === "note") {
      const np = clampPt({ x: pt.x - dr.offset.x, y: pt.y - dr.offset.y });
      props.onLiveChange({ ...diagram, notes: diagram.notes.map((n) => (n.id === dr.id ? { ...n, ...np } : n)) });
    } else if (dr.kind === "zone") {
      const np = clampPt({ x: pt.x - dr.offset.x, y: pt.y - dr.offset.y });
      props.onLiveChange({ ...diagram, zones: diagram.zones.map((z) => (z.id === dr.id ? { ...z, ...np } : z)) });
    }
  };

  const onUp = (e: RPointerEvent) => {
    drag.current = null;
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const selPlayerId = selection?.kind === "player" ? selection.id : selection?.kind === "route" ? diagram.routes.find((r) => r.id === selection.id)?.playerId : undefined;
  const draftStart = (() => {
    if (!draft || !draftPlayerId) return null;
    const p = diagram.players.find((x) => x.id === draftPlayerId);
    if (!p) return null;
    const own = diagram.routes.filter((r) => r.playerId === draftPlayerId);
    const last = own[own.length - 1];
    if (last && last.type === "motion") return last.points[last.points.length - 1];
    return { x: p.x, y: p.y };
  })();

  const cursor = mode === "draw" ? "crosshair" : mode === "text" ? "text" : mode === "erase" ? "not-allowed" : "default";

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
      className="block h-auto w-full select-none rounded-2xl"
      style={{ touchAction: "none", cursor }}
      role="application"
      aria-label="Campo de juego editable. Usa la barra de herramientas y el panel lateral para editar."
      onPointerDown={onBackgroundDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={() => setHover(null)}
      onDoubleClick={() => mode === "draw" && props.onFinishDraft()}
    >
      <FieldBackground showRushLine={showRushLine} idPrefix="editor" />

      {/* Zonas */}
      {diagram.zones.map((z) => {
        const sel = selection?.kind === "zone" && selection.id === z.id;
        return (
          <ellipse
            key={z.id}
            cx={z.x}
            cy={z.y}
            rx={z.rx}
            ry={z.ry}
            fill={z.color}
            fillOpacity={sel ? 0.28 : 0.16}
            stroke={sel ? "#49F05A" : z.color}
            strokeWidth={sel ? 0.6 : 0.35}
            strokeDasharray="1 0.8"
            onPointerDown={(e) => startZone(e, z.id)}
            style={{ cursor: mode === "select" ? "move" : undefined }}
          />
        );
      })}

      {/* Rutas */}
      {diagram.routes.map((r) => {
        const start = routeStart(diagram, r);
        const sel = selection?.kind === "route" && selection.id === r.id;
        const related = sel || r.playerId === selPlayerId;
        const d = `M ${start.x} ${start.y} ` + r.points.map((p) => `L ${p.x} ${p.y}`).join(" ");
        return (
          <g key={r.id}>
            <RoutePath route={r} start={start} highlighted={sel} />
            <path d={d} fill="none" stroke="transparent" strokeWidth={3.5} onPointerDown={(e) => startRoute(e, r.id)} style={{ cursor: "pointer" }} />
            {related &&
              mode === "select" &&
              r.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={sel ? 1.5 : 1.1}
                  fill="#070909"
                  stroke="#49F05A"
                  strokeWidth={0.45}
                  onPointerDown={(e) => startPoint(e, r.id, i)}
                  style={{ cursor: "grab" }}
                >
                  <title>Arrastra para ajustar la ruta</title>
                </circle>
              ))}
          </g>
        );
      })}

      {/* Borrador de ruta libre */}
      {draft && draftStart && (
        <g pointerEvents="none">
          <polyline
            points={[draftStart, ...draft, ...(hover ? [hover] : [])].map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#49F05A"
            strokeWidth={0.7}
            strokeDasharray="1.2 0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {draft.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={0.9} fill="#49F05A" />
          ))}
        </g>
      )}

      {/* Jugadores */}
      {diagram.players.map((p) => {
        const sel = selection?.kind === "player" && selection.id === p.id;
        return (
          <g
            key={p.id}
            onPointerDown={(e) => startPlayer(e, p.id)}
            style={{ cursor: mode === "select" ? "grab" : "pointer" }}
            role="button"
            tabIndex={0}
            aria-label={`Jugador ${p.label} (${p.role})${sel ? ", seleccionado" : ""}`}
            aria-pressed={sel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                props.onSelect({ kind: "player", id: p.id });
              }
            }}
          >
            <circle cx={p.x} cy={p.y} r={4.2} fill="transparent" />
            <PlayerMark player={p} selected={sel || p.id === draftPlayerId} />
          </g>
        );
      })}

      {/* Notas */}
      {diagram.notes.map((n) => {
        const sel = selection?.kind === "note" && selection.id === n.id;
        const w = Math.max(6, n.text.length * 1.45);
        return (
          <g key={n.id} onPointerDown={(e) => startNote(e, n.id)} style={{ cursor: mode === "select" ? "move" : "pointer" }}>
            <rect x={n.x - w / 2 - 1} y={n.y - 3} width={w + 2} height={4.4} rx={0.8} fill={sel ? "rgba(73,240,90,0.15)" : "transparent"} stroke={sel ? "#49F05A" : "transparent"} strokeWidth={0.3} strokeDasharray="0.8 0.6" />
            <text x={n.x} y={n.y} textAnchor="middle" fontSize={2.6} fontWeight={600} fill={n.color ?? "#FFFFFF"} style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {n.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
