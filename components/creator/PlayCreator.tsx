"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  BookmarkPlus,
  Copy,
  Download,
  Eraser,
  FlipHorizontal2,
  Grid3x3,
  Hand,
  PenLine,
  Plus,
  Redo2,
  Save,
  Trash2,
  Type,
  Undo2,
  Check,
  X,
  FilePlus2,
  ShieldHalf,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Badge, Button, Card, Field, IconButton, PageHeader, Segmented, cn, useToast } from "@/components/ui";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { EditorField, type Mode, type Selection } from "./EditorField";
import { PLAY_CATEGORIES } from "@/lib/constants";
import {
  COLOR_OPTIONS,
  EXTRA_ROUTE_TYPES,
  FORMATIONS,
  ROUTE_COLORS,
  ROUTE_TYPES,
  routeName,
  routeStart,
  uid,
} from "@/lib/field";
import {
  addDefense,
  addMotion,
  addPlayer,
  addZoneFor,
  applyFormation,
  assignRoute,
  mirrorDiagram,
  removeDefense,
  removePlayer,
  removeRoute,
} from "@/lib/diagramOps";
import { downloadSvgAsPng, slugify } from "@/lib/exportImage";
import { useAddToPlaybook, usePlays } from "@/lib/hooks";
import { LEVELS, type Diagram, type DiagramRoute, type FormationId, type LineEnd, type LineStyle, type Play, type Pt, type RouteType } from "@/lib/types";

/* ---------------- Historial (deshacer/rehacer) ---------------- */

interface Hist {
  past: Diagram[];
  present: Diagram;
  future: Diagram[];
}
type HistAction = { type: "set"; diagram: Diagram; push: boolean } | { type: "checkpoint" } | { type: "undo" } | { type: "redo" };

function histReducer(s: Hist, a: HistAction): Hist {
  switch (a.type) {
    case "set":
      return a.push ? { past: [...s.past.slice(-80), s.present], present: a.diagram, future: [] } : { ...s, present: a.diagram };
    case "checkpoint":
      return { past: [...s.past.slice(-80), s.present], present: s.present, future: [] };
    case "undo":
      if (!s.past.length) return s;
      return { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future] };
    case "redo":
      if (!s.future.length) return s;
      return { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1) };
  }
}

const CATEGORY_OPTIONS = [...PLAY_CATEGORIES, "Defensa", "Mis jugadas"];
const ROLE_OPTIONS_O = ["QB", "C", "WR", "RB", "TE"];
const ROLE_OPTIONS_D = ["Rusher", "Esquina", "Safety", "Apoyador", "Defensa"];

export function PlayCreator({ initial, isNew }: { initial: Play; isNew: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const { upsert, remove } = usePlays();
  const { add: addToPlaybook } = useAddToPlaybook();

  const [meta, setMeta] = useState<Omit<Play, "diagram">>(() => {
    const { diagram: _d, ...rest } = initial;
    void _d;
    return rest;
  });
  const [hist, dispatch] = useReducer(histReducer, { past: [], present: initial.diagram, future: [] });
  const diagram = hist.present;
  const [selection, setSelection] = useState<Selection>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [draft, setDraft] = useState<Pt[] | null>(null);
  const [draftPlayerId, setDraftPlayerId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [dirty, setDirty] = useState(isNew);
  const exportRef = useRef<HTMLDivElement>(null);

  const commit = useCallback((d: Diagram, push = true) => {
    dispatch({ type: "set", diagram: d, push });
    setDirty(true);
  }, []);
  const updateMeta = (patch: Partial<Play>) => {
    setMeta((m) => ({ ...m, ...patch }));
    setDirty(true);
  };

  const selectedPlayer = selection?.kind === "player" ? diagram.players.find((p) => p.id === selection.id) : undefined;
  const selectedRoute = selection?.kind === "route" ? diagram.routes.find((r) => r.id === selection.id) : undefined;
  const selectedNote = selection?.kind === "note" ? diagram.notes.find((n) => n.id === selection.id) : undefined;
  const selectedZone = selection?.kind === "zone" ? diagram.zones.find((z) => z.id === selection.id) : undefined;
  const hasDefense = diagram.players.some((p) => p.team === "D");

  /* ---------- Dibujo libre ---------- */

  const finishDraft = useCallback(() => {
    if (draft && draft.length && draftPlayerId) {
      const own = diagram.routes.filter((r) => r.playerId === draftPlayerId);
      const last = own[own.length - 1];
      const player = diagram.players.find((p) => p.id === draftPlayerId);
      const route: DiagramRoute = {
        id: uid("r"),
        playerId: draftPlayerId,
        type: "custom",
        points: draft,
        color: player?.team === "D" ? ROUTE_COLORS.defense : ROUTE_COLORS.other,
        style: "solid",
        end: "arrow",
        chained: last?.type === "motion",
      };
      commit({ ...diagram, routes: [...diagram.routes, route] });
      setSelection({ kind: "route", id: route.id });
    }
    setDraft(null);
    setDraftPlayerId(null);
    setMode("select");
  }, [commit, diagram, draft, draftPlayerId]);

  const cancelDraft = () => {
    setDraft(null);
    setDraftPlayerId(null);
    setMode("select");
  };

  const startDrawing = (playerId?: string) => {
    const pid = playerId ?? selectedPlayer?.id ?? selectedRoute?.playerId ?? null;
    setMode("draw");
    setDraftPlayerId(pid);
    setDraft(pid ? [] : null);
    if (!pid) toast("Toca un jugador para empezar a dibujar su ruta");
  };

  const onSelect = (s: Selection) => {
    if (mode === "draw" && s?.kind === "player") {
      if (draft && draft.length && draftPlayerId && draftPlayerId !== s.id) finishDraft();
      setDraftPlayerId(s.id);
      setDraft([]);
      setSelection(s);
      return;
    }
    setSelection(s);
  };

  const onFieldClick = (pt: Pt) => {
    if (mode === "draw") {
      if (!draftPlayerId) {
        toast("Primero toca al jugador que correrá la ruta");
        return;
      }
      setDraft((d) => [...(d ?? []), pt]);
    } else if (mode === "text") {
      const id = uid("n");
      commit({ ...diagram, notes: [...diagram.notes, { id, x: pt.x, y: pt.y, text: "Nota" }] });
      setSelection({ kind: "note", id });
      setMode("select");
    }
  };

  const onErase = (s: NonNullable<Selection>) => {
    if (s.kind === "player") commit(removePlayer(diagram, s.id));
    if (s.kind === "route") commit(removeRoute(diagram, s.id));
    if (s.kind === "note") commit({ ...diagram, notes: diagram.notes.filter((n) => n.id !== s.id) });
    if (s.kind === "zone") commit({ ...diagram, zones: diagram.zones.filter((z) => z.id !== s.id) });
    setSelection(null);
  };

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    onErase(selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, diagram]);

  /* ---------- Atajos de teclado ---------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "redo" : "undo" });
        setDirty(true);
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dispatch({ type: "redo" });
        setDirty(true);
      } else if (e.key === "Escape") {
        if (mode === "draw") cancelDraft();
        else setSelection(null);
      } else if (e.key === "Enter" && mode === "draw") {
        finishDraft();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selection) {
        e.preventDefault();
        deleteSelection();
      } else if (selection?.kind === "player" && e.key.startsWith("Arrow")) {
        e.preventDefault();
        const step = e.shiftKey ? 2 : 0.5;
        const p = diagram.players.find((x) => x.id === selection.id);
        if (!p) return;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        commit({
          ...diagram,
          players: diagram.players.map((x) => (x.id === p.id ? { ...x, x: x.x + dx, y: x.y + dy } : x)),
          routes: diagram.routes.map((r) => (r.playerId === p.id ? { ...r, points: r.points.map((q) => ({ x: q.x + dx, y: q.y + dy })) } : r)),
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- Guardar / duplicar / borrar ---------- */

  const buildPlay = (): Play => {
    const now = Date.now();
    return { ...meta, name: meta.name.trim() || "Jugada sin nombre", diagram, source: "user", createdAt: meta.createdAt ?? now, updatedAt: now };
  };

  const save = () => {
    const p = buildPlay();
    upsert(p);
    setMeta((m) => ({ ...m, name: p.name, createdAt: p.createdAt, updatedAt: p.updatedAt }));
    setDirty(false);
    toast("Jugada guardada");
    if (isNew) router.replace(`/app/crear/?id=${p.id}`);
    return p;
  };

  const duplicate = () => {
    const p = buildPlay();
    const copy: Play = { ...p, id: uid("jug"), name: `${p.name} (copia)`, createdAt: Date.now(), updatedAt: Date.now() };
    upsert(copy);
    toast("Jugada duplicada");
    router.push(`/app/crear/?id=${copy.id}`);
  };

  const del = () => {
    if (!window.confirm("¿Borrar esta jugada? Esta acción no se puede deshacer.")) return;
    remove(meta.id);
    toast("Jugada borrada");
    router.push("/app/jugadas/");
  };

  const toPlaybook = () => {
    const p = save();
    const res = addToPlaybook({ id: p.id, source: "user" }, p);
    toast(res.added ? `Agregada a ${res.playbook.teamName}` : "Ya estaba en tu playbook");
  };

  const exportPng = async () => {
    const svg = exportRef.current?.querySelector("svg");
    if (!svg) return;
    try {
      await downloadSvgAsPng(svg, slugify(meta.name || "jugada"));
    } catch {
      toast("No se pudo exportar la imagen", "error");
    }
  };

  /* ---------- UI ---------- */

  const tools: { id: Mode; label: string; icon: typeof Hand }[] = [
    { id: "select", label: "Mover", icon: Hand },
    { id: "draw", label: "Dibujar ruta", icon: PenLine },
    { id: "text", label: "Texto", icon: Type },
    { id: "erase", label: "Borrar", icon: Eraser },
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Creador de jugadas"
        title={meta.name || "Nueva jugada"}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {dirty ? <Badge tone="amber">Cambios sin guardar</Badge> : <Badge tone="volt">Guardada</Badge>}
            <span className="text-sm">Arrastra jugadores, asigna rutas y guarda tu jugada.</span>
          </span>
        }
        actions={
          <>
            <Button onClick={save}>
              <Save size={17} /> Guardar
            </Button>
            <Button variant="secondary" onClick={toPlaybook}>
              <BookmarkPlus size={17} /> Al playbook
            </Button>
            <Button variant="secondary" onClick={duplicate} aria-label="Duplicar jugada">
              <Copy size={17} /> <span className="hidden sm:inline">Duplicar</span>
            </Button>
            <Button variant="ghost" onClick={() => router.push(`/app/crear/?nuevo=${Date.now()}`)} aria-label="Nueva jugada">
              <FilePlus2 size={17} /> <span className="hidden sm:inline">Nueva</span>
            </Button>
            {!isNew && (
              <Button variant="danger" onClick={del} aria-label="Borrar jugada">
                <Trash2 size={17} />
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[270px_minmax(0,1fr)_300px]">
        {/* -------- Centro: campo -------- */}
        <div className="order-1 min-w-0 2xl:order-2">
          <div className="card p-2 sm:p-3">
            <div className="mb-2 flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Herramientas del campo">
              {tools.map((t) => {
                const Icon = t.icon;
                const active = mode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => (t.id === "draw" ? startDrawing() : (setMode(t.id), setDraft(null), setDraftPlayerId(null)))}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold transition-colors",
                      active ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:text-snow",
                    )}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
              <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
              <IconButton label="Deshacer (Ctrl+Z)" onClick={() => dispatch({ type: "undo" })} disabled={!hist.past.length}>
                <Undo2 size={18} />
              </IconButton>
              <IconButton label="Rehacer (Ctrl+Shift+Z)" onClick={() => dispatch({ type: "redo" })} disabled={!hist.future.length}>
                <Redo2 size={18} />
              </IconButton>
              <IconButton label="Voltear jugada (espejo)" onClick={() => commit(mirrorDiagram(diagram))}>
                <FlipHorizontal2 size={18} />
              </IconButton>
              <IconButton label={snapToGrid ? "Desactivar ajuste a cuadrícula" : "Activar ajuste a cuadrícula"} onClick={() => setSnapToGrid((v) => !v)} className={snapToGrid ? "text-volt" : ""}>
                <Grid3x3 size={18} />
              </IconButton>
              <IconButton label="Alejar" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1}>
                <ZoomOut size={18} />
              </IconButton>
              <IconButton label="Acercar" onClick={() => setZoom((z) => Math.min(2.5, z + 0.5))} disabled={zoom >= 2.5}>
                <ZoomIn size={18} />
              </IconButton>
              <IconButton label="Descargar imagen PNG" onClick={exportPng}>
                <Download size={18} />
              </IconButton>
              <div className="ml-auto flex gap-1.5">
                <Button size="sm" variant="secondary" onClick={() => { const r = addPlayer(diagram, "O"); commit(r.diagram); setSelection({ kind: "player", id: r.id }); }}>
                  <Plus size={15} /> Ataque
                </Button>
                <Button size="sm" variant="secondary" onClick={() => { const r = addPlayer(diagram, "D"); commit(r.diagram); setSelection({ kind: "player", id: r.id }); }}>
                  <Plus size={15} /> Defensa
                </Button>
              </div>
            </div>

            {mode === "draw" && (
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-volt/30 bg-volt/10 px-3 py-2 text-sm text-volt" role="status">
                <span>
                  {draftPlayerId
                    ? `Dibujando ruta de ${diagram.players.find((p) => p.id === draftPlayerId)?.label}: toca el campo para agregar puntos.`
                    : "Toca al jugador que correrá la ruta."}
                </span>
                <span className="flex gap-1.5">
                  <Button size="sm" onClick={finishDraft} disabled={!draft?.length}>
                    <Check size={15} /> Terminar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelDraft}>
                    <X size={15} /> Cancelar
                  </Button>
                </span>
              </div>
            )}

            <div className={cn("mx-auto w-full", zoom > 1 && "max-h-[75dvh] overflow-auto overscroll-contain rounded-2xl")} style={zoom > 1 ? undefined : { maxWidth: "max(320px, calc((100dvh - 230px) * 1.11))" }}>
            <div style={zoom > 1 ? { width: `${zoom * 100}%` } : undefined}>
            <EditorField
              diagram={diagram}
              selection={selection}
              mode={mode}
              draft={draft}
              draftPlayerId={draftPlayerId}
              snapToGrid={snapToGrid}
              showRushLine={hasDefense || meta.side === "defense"}
              onSelect={onSelect}
              onCheckpoint={() => {
                dispatch({ type: "checkpoint" });
                setDirty(true);
              }}
              onLiveChange={(d) => dispatch({ type: "set", diagram: d, push: false })}
              onFieldClick={onFieldClick}
              onFinishDraft={finishDraft}
              onErase={onErase}
            />
            </div>
            </div>
            <p className="mt-2 px-1 text-xs text-mist">
              Consejo: selecciona un jugador y elige una ruta en el panel. Arrastra los puntos verdes para ajustarla. Atajos: Ctrl+Z deshacer · Supr borrar · flechas mover.
            </p>
          </div>

          {/* Exportación oculta (sin controles de edición) */}
          <div ref={exportRef} className="hidden" aria-hidden="true">
            <PlayDiagram diagram={diagram} title={meta.name} />
          </div>
        </div>

        {/* -------- Izquierda: datos -------- */}
        <div className="order-3 space-y-4 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 2xl:order-1 2xl:col-span-1 2xl:block 2xl:space-y-4">
          <Card className="space-y-4 p-4">
            <h2 className="font-display text-xl font-bold uppercase">Datos de la jugada</h2>
            <Field label="Nombre">
              {(id) => <input id={id} className="input" value={meta.name} placeholder="Ej. Relámpago" onChange={(e) => updateMeta({ name: e.target.value })} maxLength={40} />}
            </Field>
            <div>
              <span className="label">Lado</span>
              <Segmented
                label="Lado de la jugada"
                value={meta.side}
                onChange={(v) => {
                  updateMeta({ side: v, category: v === "defense" ? "Defensa" : meta.category === "Defensa" ? "Mis jugadas" : meta.category });
                  if (v === "defense" && !hasDefense) commit(addDefense(diagram));
                }}
                options={[
                  { value: "offense", label: "Ofensiva" },
                  { value: "defense", label: "Defensa" },
                ]}
              />
            </div>
            <Field label={meta.side === "defense" ? "Formación del rival" : "Formación"}>
              {(id) => (
                <select
                  id={id}
                  className="input"
                  value={meta.formation}
                  onChange={(e) => {
                    const f = e.target.value as FormationId;
                    updateMeta({ formation: f });
                    commit(applyFormation(diagram, f));
                  }}
                >
                  {FORMATIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                  <option value="custom">Personalizada</option>
                </select>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Categoría">
                {(id) => (
                  <select id={id} className="input" value={meta.category} onChange={(e) => updateMeta({ category: e.target.value })}>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Nivel">
                {(id) => (
                  <select id={id} className="input" value={meta.level} onChange={(e) => updateMeta({ level: e.target.value as Play["level"] })}>
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            {meta.side === "offense" && (
              <Button variant="secondary" className="w-full" onClick={() => commit(hasDefense ? removeDefense(diagram) : addDefense(diagram))}>
                <ShieldHalf size={17} /> {hasDefense ? "Quitar defensa" : "Mostrar defensa"}
              </Button>
            )}
          </Card>

          <Card className="space-y-3 p-4">
            <h2 className="font-display text-xl font-bold uppercase">Notas para el coach</h2>
            {(
              [
                ["objective", "Objetivo", "¿Qué buscas con esta jugada?"],
                ["description", "Descripción", "Cómo funciona."],
                ["primaryRead", "Lectura principal", "Ej. Y en el slant."],
                ["secondaryRead", "Lectura secundaria", "Ej. C en el gancho."],
                ["coachTip", "Consejo", "Detalle para enseñarla."],
              ] as const
            ).map(([key, label, ph]) => (
              <Field key={key} label={label}>
                {(id) => <textarea id={id} className="input min-h-[60px] resize-y text-sm" placeholder={ph} value={meta[key] ?? ""} onChange={(e) => updateMeta({ [key]: e.target.value } as Partial<Play>)} />}
              </Field>
            ))}
          </Card>
        </div>

        {/* -------- Derecha: inspector -------- */}
        <div className="order-2 space-y-4 2xl:order-3">
          <Card className="p-4">
            {selectedPlayer ? (
              <PlayerInspector
                key={selectedPlayer.id}
                diagram={diagram}
                playerId={selectedPlayer.id}
                commit={commit}
                onDraw={() => startDrawing(selectedPlayer.id)}
                onSelect={setSelection}
              />
            ) : selectedRoute ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold uppercase">Ruta: {routeName(selectedRoute.type)}</h2>
                  <Button size="sm" variant="ghost" onClick={() => setSelection({ kind: "player", id: selectedRoute.playerId })}>
                    Ver jugador
                  </Button>
                </div>
                <RouteControls diagram={diagram} route={selectedRoute} commit={commit} onDeleted={() => setSelection(null)} />
              </div>
            ) : selectedNote ? (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold uppercase">Texto</h2>
                <Field label="Contenido">
                  {(id) => (
                    <input
                      id={id}
                      className="input"
                      maxLength={30}
                      value={selectedNote.text}
                      onChange={(e) => commit({ ...diagram, notes: diagram.notes.map((n) => (n.id === selectedNote.id ? { ...n, text: e.target.value } : n)) }, false)}
                    />
                  )}
                </Field>
                <ColorPicker label="Color" value={selectedNote.color ?? "#FFFFFF"} onChange={(c) => commit({ ...diagram, notes: diagram.notes.map((n) => (n.id === selectedNote.id ? { ...n, color: c } : n)) })} />
                <Button variant="danger" className="w-full" onClick={() => onErase({ kind: "note", id: selectedNote.id })}>
                  <Trash2 size={16} /> Borrar texto
                </Button>
              </div>
            ) : selectedZone ? (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold uppercase">Zona</h2>
                {(["rx", "ry"] as const).map((k) => (
                  <Field key={k} label={k === "rx" ? "Ancho" : "Alto"}>
                    {(id) => (
                      <input
                        id={id}
                        type="range"
                        min={3}
                        max={30}
                        step={0.5}
                        value={selectedZone[k]}
                        onChange={(e) => commit({ ...diagram, zones: diagram.zones.map((z) => (z.id === selectedZone.id ? { ...z, [k]: Number(e.target.value) } : z)) }, false)}
                        className="w-full accent-[#49F05A]"
                      />
                    )}
                  </Field>
                ))}
                <Field label="Etiqueta (opcional)">
                  {(id) => (
                    <input id={id} className="input" maxLength={12} value={selectedZone.label ?? ""} onChange={(e) => commit({ ...diagram, zones: diagram.zones.map((z) => (z.id === selectedZone.id ? { ...z, label: e.target.value } : z)) }, false)} />
                  )}
                </Field>
                <ColorPicker label="Color" value={selectedZone.color} onChange={(c) => commit({ ...diagram, zones: diagram.zones.map((z) => (z.id === selectedZone.id ? { ...z, color: c } : z)) })} />
                <Button variant="danger" className="w-full" onClick={() => onErase({ kind: "zone", id: selectedZone.id })}>
                  <Trash2 size={16} /> Borrar zona
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xl font-bold uppercase">Jugadores</h2>
                <p className="mb-3 mt-1 text-sm text-mist">Toca un jugador en el campo o elige uno aquí para editarlo y asignarle una ruta.</p>
                <div className="grid grid-cols-3 gap-2">
                  {diagram.players.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelection({ kind: "player", id: p.id })}
                      className={cn(
                        "flex h-12 flex-col items-center justify-center rounded-lg border text-sm font-bold",
                        p.team === "D" ? "border-coral/30 text-coral hover:bg-coral/10" : "border-line-2 hover:border-volt/60 hover:text-volt",
                      )}
                    >
                      {p.label}
                      <span className="text-[0.65rem] font-medium text-mist">{p.role}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-line bg-ink-2 p-3 text-xs leading-relaxed text-mist">
                  <p className="mb-1 font-semibold text-mist-2">Colores sugeridos</p>
                  <p>
                    <span className="font-semibold text-volt">Verde</span>: lectura principal · <span className="font-semibold text-amber">Amarillo</span>: lectura secundaria · <span className="font-semibold text-snow">Blanco</span>: rutas de apoyo · <span className="text-mist-2">Gris punteado</span>: motion.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (c: string) => void }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={value.toUpperCase() === c.value.toUpperCase()}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.value)}
            className={cn("h-8 w-8 rounded-full border-2 transition-transform", value.toUpperCase() === c.value.toUpperCase() ? "scale-110 border-snow" : "border-transparent")}
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>
    </div>
  );
}

function RouteControls({ diagram, route, commit, onDeleted }: { diagram: Diagram; route: DiagramRoute; commit: (d: Diagram, push?: boolean) => void; onDeleted?: () => void }) {
  const patch = (p: Partial<DiagramRoute>) => commit({ ...diagram, routes: diagram.routes.map((r) => (r.id === route.id ? { ...r, ...p } : r)) });
  const start = routeStart(diagram, route);
  return (
    <div className="space-y-3">
      {route.type !== "motion" && (
        <div>
          <span className="label">Lectura</span>
          <Segmented
            label="Tipo de lectura"
            value={route.color.toUpperCase() === ROUTE_COLORS.primary ? "1" : route.color.toUpperCase() === ROUTE_COLORS.secondary ? "2" : "0"}
            onChange={(v) => patch({ color: v === "1" ? ROUTE_COLORS.primary : v === "2" ? ROUTE_COLORS.secondary : ROUTE_COLORS.other })}
            options={[
              { value: "1", label: "Principal" },
              { value: "2", label: "Secundaria" },
              { value: "0", label: "Apoyo" },
            ]}
          />
        </div>
      )}
      <ColorPicker label="Color de ruta" value={route.color} onChange={(c) => patch({ color: c })} />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Trazo">
          {(id) => (
            <select id={id} className="input" value={route.style} onChange={(e) => patch({ style: e.target.value as LineStyle })}>
              <option value="solid">Sólido</option>
              <option value="dashed">Guiones</option>
              <option value="dotted">Punteado</option>
            </select>
          )}
        </Field>
        <Field label="Final">
          {(id) => (
            <select id={id} className="input" value={route.end} onChange={(e) => patch({ end: e.target.value as LineEnd })}>
              <option value="arrow">Flecha</option>
              <option value="block">Bloque (freno)</option>
              <option value="none">Sin final</option>
            </select>
          )}
        </Field>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            const last = route.points[route.points.length - 1] ?? start;
            patch({ points: [...route.points, { x: Math.min(97, last.x + 3), y: Math.max(4, last.y - 4) }] });
          }}
        >
          <Plus size={14} /> Punto
        </Button>
        <Button size="sm" variant="secondary" className="flex-1" disabled={route.points.length <= 1} onClick={() => patch({ points: route.points.slice(0, -1) })}>
          Quitar punto
        </Button>
      </div>
      <Button
        variant="danger"
        size="sm"
        className="w-full"
        onClick={() => {
          commit(removeRoute(diagram, route.id));
          onDeleted?.();
        }}
      >
        <Trash2 size={15} /> Eliminar ruta
      </Button>
    </div>
  );
}

function PlayerInspector({
  diagram,
  playerId,
  commit,
  onDraw,
  onSelect,
}: {
  diagram: Diagram;
  playerId: string;
  commit: (d: Diagram, push?: boolean) => void;
  onDraw: () => void;
  onSelect: (s: Selection) => void;
}) {
  const player = diagram.players.find((p) => p.id === playerId)!;
  const routes = diagram.routes.filter((r) => r.playerId === playerId);
  const [moreOpen, setMoreOpen] = useState(false);
  const isD = player.team === "D";
  const patchPlayer = (p: Partial<typeof player>, push = true) => commit({ ...diagram, players: diagram.players.map((x) => (x.id === playerId ? { ...x, ...p } : x)) }, push);
  const give = (t: RouteType) => {
    if (t === "custom") return onDraw();
    commit(assignRoute(diagram, playerId, t));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold uppercase">
          {isD ? "Defensor" : "Jugador"} {player.label}
        </h2>
        <Badge tone={isD ? "coral" : "volt"}>{isD ? "Defensa" : "Ataque"}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Etiqueta">
          {(id) => <input id={id} className="input uppercase" maxLength={3} value={player.label} onChange={(e) => patchPlayer({ label: e.target.value.toUpperCase() }, false)} />}
        </Field>
        <Field label="Posición">
          {(id) => (
            <select id={id} className="input" value={player.role} onChange={(e) => patchPlayer({ role: e.target.value })}>
              {(isD ? ROLE_OPTIONS_D : ROLE_OPTIONS_O).map((r) => (
                <option key={r}>{r}</option>
              ))}
              {!(isD ? ROLE_OPTIONS_D : ROLE_OPTIONS_O).includes(player.role) && <option>{player.role}</option>}
            </select>
          )}
        </Field>
      </div>

      <div>
        <span className="label">{isD ? "Acción" : "Asignar ruta"}</span>
        {isD ? (
          <div className="grid grid-cols-2 gap-1.5">
            <Button size="sm" variant="secondary" onClick={() => give("rush")}>Presión (rush)</Button>
            <Button size="sm" variant="secondary" onClick={() => commit(addZoneFor(diagram, playerId).diagram)}>Zona</Button>
            <Button size="sm" variant="secondary" onClick={() => give("drop")}>Caída</Button>
            <Button size="sm" variant="secondary" onClick={onDraw}>Dibujar</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1.5">
              {ROUTE_TYPES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  title={r.hint}
                  onClick={() => give(r.id)}
                  className={cn(
                    "h-9 rounded-lg border text-sm font-semibold transition-colors",
                    routes.some((x) => x.type === r.id) ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:border-volt/50 hover:text-snow",
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
            <button type="button" className="mt-2 text-sm font-semibold text-volt hover:underline" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}>
              {moreOpen ? "Menos rutas" : "Más rutas (flat, wheel, fade…)"}
            </button>
            {moreOpen && (
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {EXTRA_ROUTE_TYPES.filter((r) => r.id !== "motion").map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    title={r.hint}
                    onClick={() => give(r.id)}
                    className="h-9 rounded-lg border border-line-2 text-sm font-semibold text-mist-2 hover:border-volt/50 hover:text-snow"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
            <Button size="sm" variant="ghost" className="mt-2 w-full" onClick={() => commit(addMotion(diagram, playerId))}>
              <Plus size={14} /> Agregar motion antes del snap
            </Button>
          </>
        )}
      </div>

      {routes.length > 0 && (
        <div>
          <span className="label">Rutas de este jugador</span>
          <ul className="space-y-1.5">
            {routes.map((r) => (
              <li key={r.id} className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-2.5 py-1.5">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                <button type="button" className="flex-1 text-left text-sm font-semibold hover:text-volt" onClick={() => onSelect({ kind: "route", id: r.id })}>
                  {routeName(r.type)}
                </button>
                <IconButton label={`Eliminar ruta ${routeName(r.type)}`} className="h-7 w-7" onClick={() => commit(removeRoute(diagram, r.id))}>
                  <Trash2 size={14} />
                </IconButton>
              </li>
            ))}
          </ul>
          {routes.filter((r) => r.type !== "motion").slice(-1).map((r) => (
            <div key={r.id} className="mt-3 border-t border-line pt-3">
              <RouteControls diagram={diagram} route={r} commit={commit} />
            </div>
          ))}
        </div>
      )}

      <Button
        variant="danger"
        size="sm"
        className="w-full"
        onClick={() => {
          commit(removePlayer(diagram, playerId));
          onSelect(null);
        }}
      >
        <Trash2 size={15} /> Quitar jugador
      </Button>
    </div>
  );
}
