"use client";

import { plural } from "@/lib/cn";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, BookOpen, Plus, Printer, Sparkles, Watch, X } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { PlayPicker } from "@/components/plays/PlayPicker";
import { Button, Card, EmptyState, Field, IconButton, PageHeader, Segmented, useToast } from "@/components/ui";
import { usePlaybooks, useResolvePlay } from "@/lib/hooks";
import { flattenPlaybook, pad2 } from "@/lib/playbook";
import { KEYS, useStored } from "@/lib/storage";
import type { Play, PlayRef } from "@/lib/types";

type Layout = 6 | 9 | 12 | 18;
type Paper = "carta" | "a4";
type Size = "s" | "m" | "l";

interface WristbandConfig {
  refs: PlayRef[];
  layout: Layout;
  paper: Paper;
  size: Size;
  start: number;
  showNames: boolean;
  coachSheet: boolean;
}

const DEFAULT: WristbandConfig = { refs: [], layout: 9, paper: "carta", size: "m", start: 1, showNames: true, coachSheet: true };

// Celdas horizontales: los diagramas son más anchos que altos, así se aprovecha mejor el espacio.
const GRID: Record<Layout, { cols: number; rows: number }> = {
  6: { cols: 2, rows: 3 },
  9: { cols: 3, rows: 3 },
  12: { cols: 3, rows: 4 },
  18: { cols: 3, rows: 6 },
};
const GAP_CM = 0.15;
const SIZES: Record<Size, { w: number; h: number; label: string }> = {
  s: { w: 8, h: 5, label: "Chica 8 × 5 cm" },
  m: { w: 9.5, h: 6, label: "Mediana 9.5 × 6 cm" },
  l: { w: 12, h: 7.5, label: "Grande 12 × 7.5 cm" },
};
// Área útil con márgenes de 12 mm
const PAPER: Record<Paper, { w: number; h: number; label: string; css: string }> = {
  carta: { w: 19.19, h: 25.49, label: "Carta", css: "letter" },
  a4: { w: 18.6, h: 27.3, label: "A4", css: "A4" },
};

function WristbandCard({ plays, layout, start, showNames, size, copy }: { plays: (Play | null)[]; layout: Layout; start: number; showNames: boolean; size: Size; copy: number }) {
  const g = GRID[layout];
  const s = SIZES[size];
  const cellH = s.h / g.rows; // cm
  // 6 y 9: número + nombre arriba. 12 y 18: número en una franja lateral para que el diagrama use toda la altura.
  const strip = layout >= 12;
  const numCm = Math.min(0.5, Math.max(0.3, cellH * 0.42));
  return (
    <div
      className="wb-card print-avoid overflow-hidden border-2 border-[#111] bg-white text-[#111]"
      style={{ width: `${s.w}cm`, height: `${s.h}cm`, display: "grid", gridTemplateColumns: `repeat(${g.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${g.rows}, minmax(0, 1fr))` }}
      aria-label={`Tarjeta ${copy}`}
    >
      {Array.from({ length: layout }).map((_, i) => {
        const p = plays[i];
        const num = pad2(start + i);
        return strip ? (
          <div key={i} className="flex min-h-0 min-w-0 border-[0.5px] border-[#bbb]">
            <span className="flex shrink-0 items-center justify-center border-r-[0.5px] border-[#bbb] font-display font-extrabold leading-none" style={{ width: `${numCm * 1.25}cm`, fontSize: `${numCm}cm` }}>
              {num}
            </span>
            <div className="relative min-h-0 min-w-0 flex-1">
              <div className="absolute inset-[0.04cm]">{p && <PlayDiagram diagram={p.diagram} theme="print" fit mini showNotes={false} className="h-full w-full" />}</div>
            </div>
          </div>
        ) : (
          <div key={i} className="flex min-h-0 min-w-0 flex-col border-[0.5px] border-[#bbb]" style={{ padding: "0.06cm" }}>
            <div className="flex min-w-0 items-baseline gap-1 leading-none">
              <span className="font-display font-extrabold" style={{ fontSize: `${numCm}cm` }}>
                {num}
              </span>
              {showNames && p && (
                <span className="truncate font-bold uppercase" style={{ fontSize: `${numCm * 0.5}cm` }}>
                  {p.name}
                </span>
              )}
            </div>
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0">{p && <PlayDiagram diagram={p.diagram} theme="print" fit mini={layout === 9} showNotes={false} className="h-full w-full" />}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Wristbands() {
  const sp = useSearchParams();
  const toast = useToast();
  const [cfg, setCfg] = useStored<WristbandConfig>(KEYS.wristband, DEFAULT);
  const { items: playbooks } = usePlaybooks();
  const resolve = useResolvePlay();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const loadedFromQuery = useRef(false);

  const c = { ...DEFAULT, ...cfg };
  const set = (patch: Partial<WristbandConfig>) => setCfg((prev) => ({ ...DEFAULT, ...prev, ...patch }));

  const loadPlaybook = (id: string) => {
    const pb = playbooks.find((p) => p.id === id);
    if (!pb) return;
    const refs = flattenPlaybook(pb).map((f) => f.ref);
    set({ refs, start: 1 });
    toast(`${plural(refs.length, "jugada cargada", "jugadas cargadas")} de ${pb.teamName}`);
  };

  // Si llega ?playbook=ID desde Mi playbook, carga sus jugadas una vez.
  const pbParam = sp.get("playbook");
  useEffect(() => {
    if (loadedFromQuery.current || !pbParam) return;
    const pb = playbooks.find((p) => p.id === pbParam);
    if (!pb) return;
    loadedFromQuery.current = true;
    setCfg((prev) => ({ ...DEFAULT, ...prev, refs: flattenPlaybook(pb).map((f) => f.ref), start: 1 }));
  }, [pbParam, playbooks, setCfg]);

  const plays = useMemo(() => c.refs.map((r) => resolve(r) ?? null), [c.refs, resolve]);
  const perCard = c.layout;
  const cardGroups = useMemo(() => {
    const groups: (Play | null)[][] = [];
    for (let i = 0; i < Math.max(plays.length, 1); i += perCard) groups.push(plays.slice(i, i + perCard));
    return groups;
  }, [plays, perCard]);

  const size = SIZES[c.size];
  const paper = PAPER[c.paper];
  // Cabe n tarjetas si n·ancho + (n−1)·separación ≤ área útil
  const cols = Math.max(1, Math.floor((paper.w + GAP_CM) / (size.w + GAP_CM)));
  // 1.2 cm reservados para el encabezado de la hoja
  const rows = Math.max(1, Math.floor((paper.h - 1.2 + GAP_CM) / (size.h + GAP_CM)));
  const copiesPerSheet = cols * rows;

  const move = (i: number, dir: -1 | 1) => {
    const refs = c.refs.slice();
    const j = i + dir;
    if (j < 0 || j >= refs.length) return;
    [refs[i], refs[j]] = [refs[j], refs[i]];
    set({ refs });
  };

  return (
    <div className="animate-fade-up">
      <style>{`@media print { @page { size: ${paper.css}; margin: 12mm; } }`}</style>
      <PageHeader
        className="no-print"
        eyebrow="Muñequeras"
        title="Tarjetas para muñequera"
        description="Elige tus jugadas y FLAGLAB genera tarjetas numeradas con mini diagrama, listas para imprimir y recortar."
        actions={
          <>
            <Button
              size="lg"
              disabled={!c.refs.length}
              onClick={() => {
                setGenerated(true);
                setTimeout(() => sheetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
              }}
            >
              <Sparkles size={18} /> GENERAR HOJA
            </Button>
            <Button size="lg" variant="secondary" disabled={!c.refs.length} onClick={() => (setGenerated(true), setTimeout(() => window.print(), 100))}>
              <Printer size={18} /> IMPRIMIR
            </Button>
          </>
        }
      />

      <div className="no-print grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Card className="h-fit space-y-4 p-4">
          <h2 className="font-display text-xl font-bold uppercase">Configuración</h2>
          <div>
            <span className="label">Jugadas por tarjeta</span>
            <Segmented label="Jugadas por tarjeta" value={c.layout} onChange={(v) => set({ layout: v })} options={[6, 9, 12, 18].map((n) => ({ value: n as Layout, label: String(n) }))} />
          </div>
          <div>
            <span className="label">Papel</span>
            <Segmented label="Tamaño de papel" value={c.paper} onChange={(v) => set({ paper: v })} options={[{ value: "carta", label: "Carta" }, { value: "a4", label: "A4" }]} />
          </div>
          <Field label="Tamaño de tarjeta">
            {(id) => (
              <select id={id} className="input" value={c.size} onChange={(e) => set({ size: e.target.value as Size })}>
                {(Object.keys(SIZES) as Size[]).map((k) => (
                  <option key={k} value={k}>
                    {SIZES[k].label}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Numerar desde" hint="Útil si usas varias tarjetas (ej. 01-09 y 10-18).">
            {(id) => <input id={id} type="number" min={1} max={99} className="input" value={c.start} onChange={(e) => set({ start: Math.max(1, Math.min(99, Number(e.target.value) || 1)) })} />}
          </Field>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-[#49F05A]" checked={c.showNames} onChange={(e) => set({ showNames: e.target.checked })} /> Mostrar nombre corto (6 y 9 jugadas; en 12 y 18 los nombres van en la hoja del coach)
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-[#49F05A]" checked={c.coachSheet} onChange={(e) => set({ coachSheet: e.target.checked })} /> Incluir hoja del coach
          </label>
          <p className="rounded-lg bg-ink-2 p-3 text-xs text-mist">
            Caben <b className="text-snow">{copiesPerSheet}</b> tarjetas por hoja {paper.label}. Imprime al 100% (sin “ajustar a página”) para conservar el tamaño.
          </p>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold uppercase">Jugadas ({c.refs.length})</h2>
            <div className="flex flex-wrap gap-2">
              {playbooks.length > 0 && (
                <label className="flex items-center gap-2">
                  <span className="sr-only">Cargar desde playbook</span>
                  <select className="input h-9 w-auto py-0 text-sm" defaultValue="" onChange={(e) => e.target.value && loadPlaybook(e.target.value)}>
                    <option value="">Cargar playbook…</option>
                    {playbooks.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.teamName}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)}>
                <Plus size={15} /> Agregar
              </Button>
              {c.refs.length > 0 && (
                <Button size="sm" variant="ghost" onClick={() => set({ refs: [] })}>
                  Limpiar
                </Button>
              )}
            </div>
          </div>
          {c.refs.length === 0 ? (
            <EmptyState icon={<Watch size={22} />} title="Elige tus jugadas" description="Carga tu playbook o agrega jugadas de la biblioteca. Se numeran automáticamente: 01, 02, 03…" action={<Button onClick={() => setPickerOpen(true)}><BookOpen size={17} /> Elegir jugadas</Button>} />
          ) : (
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
              {c.refs.map((ref, i) => {
                const p = plays[i];
                return (
                  <li key={`${ref.source}-${ref.id}-${i}`} className="flex items-center gap-2 rounded-xl border border-line bg-ink-2 p-2">
                    <span className="w-7 shrink-0 text-center font-display text-lg font-bold text-volt">{pad2(c.start + i)}</span>
                    <div className="w-16 shrink-0 overflow-hidden rounded border border-line">{p && <PlayDiagram diagram={p.diagram} compact showNotes={false} />}</div>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p?.name ?? "No disponible"}</span>
                    <span className="flex shrink-0">
                      <IconButton label="Subir" className="h-7 w-7" disabled={i === 0} onClick={() => move(i, -1)}>
                        <ArrowUp size={14} />
                      </IconButton>
                      <IconButton label="Bajar" className="h-7 w-7" disabled={i === c.refs.length - 1} onClick={() => move(i, 1)}>
                        <ArrowDown size={14} />
                      </IconButton>
                      <IconButton label="Quitar" className="h-7 w-7 hover:text-coral" onClick={() => set({ refs: c.refs.filter((_, k) => k !== i) })}>
                        <X size={14} />
                      </IconButton>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          {c.refs.length > perCard && (
            <p className="mt-3 text-sm text-amber">
              Tienes {plural(c.refs.length, "jugada", "jugadas")}: se generarán {plural(cardGroups.length, "tarjeta distinta", "tarjetas distintas")} de {perCard} jugadas.
            </p>
          )}
        </Card>
      </div>

      {/* Hoja generada */}
      {generated && c.refs.length > 0 && (
        <div ref={sheetRef} className="mt-8 scroll-mt-20 print:mt-0">
          <h2 className="no-print h-display mb-3 text-2xl">Vista previa de la hoja</h2>
          <div className="print-sheet space-y-6 overflow-x-auto print:space-y-0">
            {cardGroups.map((group, gi) => (
              <section key={gi} className="print-page mx-auto w-fit rounded-lg bg-white p-4 shadow-xl print:rounded-none print:p-0 print:shadow-none">
                <p className="mb-2 text-[0.7rem] font-semibold text-[#666] print-muted">
                  FLAGLAB 5x5 · Tarjeta {gi + 1} · Jugadas {pad2(c.start + gi * perCard)}–{pad2(c.start + gi * perCard + group.length - 1)} · Recorta por la línea negra
                </p>
                <div className="grid w-fit" style={{ gap: `${GAP_CM}cm`, gridTemplateColumns: `repeat(${cols}, ${size.w}cm)` }}>
                  {Array.from({ length: copiesPerSheet }).map((_, k) => (
                    <WristbandCard key={k} plays={group} layout={c.layout} start={c.start + gi * perCard} showNames={c.showNames} size={c.size} copy={k + 1} />
                  ))}
                </div>
              </section>
            ))}
            {c.coachSheet && (
              <section className="print-page mx-auto max-w-[800px] rounded-lg bg-white p-8 text-[#111] shadow-xl print:rounded-none print:p-0 print:shadow-none">
                <h3 className="mb-4 font-display text-3xl font-extrabold uppercase">Hoja del coach</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#111] text-left">
                      <th className="py-1.5">#</th>
                      <th className="py-1.5">Jugada</th>
                      <th className="py-1.5">Categoría</th>
                      <th className="py-1.5">Lectura principal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plays.map((p, i) => (
                      <tr key={i} className="border-b border-[#e3e3e3] align-top">
                        <td className="py-1.5 pr-2 font-display text-lg font-bold">{pad2(c.start + i)}</td>
                        <td className="py-1.5 pr-2 font-semibold">{p?.name}</td>
                        <td className="py-1.5 pr-2 text-[#555] print-muted">{p?.category}</td>
                        <td className="py-1.5 text-[#333]">{p?.primaryRead}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>
      )}

      <PlayPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Agregar a la muñequera"
        exclude={c.refs}
        onConfirm={(items) => set({ refs: [...c.refs, ...items.map((i) => i.ref)] })}
      />
    </div>
  );
}

export default function WristbandsPage() {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <Wristbands />
    </Suspense>
  );
}
