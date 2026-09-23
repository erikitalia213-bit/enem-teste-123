"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowUp, Check, Copy, Pencil, Plus, Printer, Trash2 } from "lucide-react";
import { BlockCard, Timeline, blockStarts } from "@/components/training/SessionView";
import { Badge, Button, Card, EmptyState, Field, IconButton, LinkButton, useToast } from "@/components/ui";
import { DRILL_CATEGORIES } from "@/lib/constants";
import { useContent } from "@/components/app/ContentProvider";
import { blockFromDrill } from "@/lib/generator";
import { uid } from "@/lib/field";
import { useTrainings } from "@/lib/hooks";
import type { TrainingBlock, TrainingSession } from "@/lib/types";

function Editor({ initial, startEditing }: { initial: TrainingSession; startEditing: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const { upsert, remove } = useTrainings();
  const DRILLS = useContent().core.drills;
  const getDrill = (id: string) => DRILLS.find((d) => d.id === id);
  const [s, setS] = useState<TrainingSession>(initial);
  const [editing, setEditing] = useState(startEditing);
  const [addDrill, setAddDrill] = useState("");
  const total = s.blocks.reduce((a, b) => a + b.minutes, 0);
  const starts = blockStarts(s.blocks);

  const patch = (p: Partial<TrainingSession>) => setS((prev) => ({ ...prev, ...p }));
  const patchBlock = (id: string, p: Partial<TrainingBlock>) => setS((prev) => ({ ...prev, blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) }));
  const moveBlock = (i: number, dir: -1 | 1) =>
    setS((prev) => {
      const blocks = prev.blocks.slice();
      const j = i + dir;
      if (j < 0 || j >= blocks.length) return prev;
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      return { ...prev, blocks };
    });

  const save = () => {
    const next = { ...s, duration: total, updatedAt: Date.now() };
    upsert(next);
    setS(next);
    setEditing(false);
    toast("Cambios guardados");
  };

  const duplicate = () => {
    const copy = { ...s, id: uid("ent"), title: `${s.title} (copia)`, createdAt: Date.now(), updatedAt: Date.now(), blocks: s.blocks.map((b) => ({ ...b, id: uid("blk") })) };
    upsert(copy);
    toast("Entrenamiento duplicado");
    router.push(`/app/entrenamientos/ver/?id=${copy.id}`);
  };

  return (
    <div className="animate-fade-up">
      <Link href="/app/entrenamientos/" className="no-print mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
        <ArrowLeft size={16} /> Entrenamientos
      </Link>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Entrenamiento</p>
          {editing ? (
            <input className="input mt-1 h-12 max-w-xl font-display text-2xl font-bold uppercase" value={s.title} onChange={(e) => patch({ title: e.target.value })} aria-label="Título del entrenamiento" />
          ) : (
            <h1 className="h-display text-4xl md:text-5xl">{s.title}</h1>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="volt">{s.goal}</Badge>
            <Badge>{s.age === "Adultos" ? "Adultos" : `${s.age} años`}</Badge>
            <Badge>{s.level}</Badge>
            <Badge>{s.players} jugadores</Badge>
            <Badge tone={total === s.duration || editing ? "default" : "amber"}>{total} min</Badge>
          </div>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          {editing ? (
            <Button onClick={save}>
              <Check size={17} /> Guardar cambios
            </Button>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Pencil size={17} /> Editar
            </Button>
          )}
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer size={17} /> Imprimir
          </Button>
          <Button variant="secondary" onClick={duplicate}>
            <Copy size={17} /> Duplicar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!window.confirm("¿Borrar este entrenamiento?")) return;
              remove(s.id);
              router.push("/app/entrenamientos/");
            }}
            aria-label="Borrar entrenamiento"
          >
            <Trash2 size={17} />
          </Button>
        </div>
      </div>

      <div className="print-sheet space-y-4">
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-[1fr_200px]">
            <Timeline blocks={s.blocks} />
            {editing ? (
              <Field label="Fecha">{(id) => <input id={id} type="date" className="input" value={s.date ?? ""} onChange={(e) => patch({ date: e.target.value })} />}</Field>
            ) : (
              s.date && <p className="text-sm text-mist-2">Fecha: {new Date(s.date + "T12:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p>
            )}
          </div>
          {editing ? (
            <Field label="Notas del entrenamiento" className="mt-4">
              {(id) => <textarea id={id} className="input min-h-[70px] text-sm" value={s.notes} placeholder="Asistencia, material extra, recordatorios…" onChange={(e) => patch({ notes: e.target.value })} />}
            </Field>
          ) : (
            s.notes && <p className="mt-3 whitespace-pre-line border-l-2 border-volt pl-3 text-sm text-mist-2">{s.notes}</p>
          )}
        </Card>

        {s.blocks.map((b, i) =>
          editing ? (
            <Card key={b.id} className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-2xl font-bold text-volt">{i + 1}</span>
                <input className="input h-9 w-auto flex-1 font-semibold" value={b.phase} onChange={(e) => patchBlock(b.id, { phase: e.target.value })} aria-label="Fase" />
                <label className="flex items-center gap-1.5 text-sm">
                  <span className="sr-only">Minutos</span>
                  <input type="number" min={1} max={90} className="input h-9 w-20 text-center" value={b.minutes} onChange={(e) => patchBlock(b.id, { minutes: Math.max(1, Number(e.target.value) || 1) })} />
                  min
                </label>
                <IconButton label="Subir bloque" disabled={i === 0} onClick={() => moveBlock(i, -1)}>
                  <ArrowUp size={16} />
                </IconButton>
                <IconButton label="Bajar bloque" disabled={i === s.blocks.length - 1} onClick={() => moveBlock(i, 1)}>
                  <ArrowDown size={16} />
                </IconButton>
                <IconButton label="Eliminar bloque" className="hover:text-coral" onClick={() => patch({ blocks: s.blocks.filter((x) => x.id !== b.id) })}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
              <Field label="Cambiar ejercicio">
                {(id) => (
                  <select
                    id={id}
                    className="input"
                    value={b.drillId ?? ""}
                    onChange={(e) => {
                      const d = getDrill(e.target.value);
                      if (d) patchBlock(b.id, { ...blockFromDrill(d, b.phase, b.minutes, s.age), id: b.id });
                    }}
                  >
                    {!b.drillId && <option value="">Personalizado</option>}
                    {DRILL_CATEGORIES.map((cat) => (
                      <optgroup key={cat} label={cat}>
                        {DRILLS.filter((d) => d.category === cat).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.level})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                )}
              </Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Título">{(id) => <input id={id} className="input" value={b.title} onChange={(e) => patchBlock(b.id, { title: e.target.value })} />}</Field>
                <Field label="Material">{(id) => <input id={id} className="input" value={b.material} onChange={(e) => patchBlock(b.id, { material: e.target.value })} />}</Field>
                <Field label="Objetivo">{(id) => <textarea id={id} className="input min-h-[60px] text-sm" value={b.objective} onChange={(e) => patchBlock(b.id, { objective: e.target.value })} />}</Field>
                <Field label="Organización">{(id) => <textarea id={id} className="input min-h-[60px] text-sm" value={b.organization} onChange={(e) => patchBlock(b.id, { organization: e.target.value })} />}</Field>
                <Field label="Ejecución (un paso por línea)">
                  {(id) => <textarea id={id} className="input min-h-[110px] text-sm" value={b.execution.join("\n")} onChange={(e) => patchBlock(b.id, { execution: e.target.value.split("\n") })} />}
                </Field>
                <Field label="Consejo del coach">{(id) => <textarea id={id} className="input min-h-[110px] text-sm" value={b.coachTip} onChange={(e) => patchBlock(b.id, { coachTip: e.target.value })} />}</Field>
              </div>
            </Card>
          ) : (
            <BlockCard key={b.id} block={b} index={i} startMinute={starts[i]} />
          ),
        )}

        {editing && (
          <Card className="flex flex-col gap-2 p-4 sm:flex-row sm:items-end">
            <Field label="Agregar bloque con un drill" className="flex-1">
              {(id) => (
                <select id={id} className="input" value={addDrill} onChange={(e) => setAddDrill(e.target.value)}>
                  <option value="">Elige un drill…</option>
                  {DRILLS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.category} · {d.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Button
              variant="secondary"
              disabled={!addDrill}
              onClick={() => {
                const d = getDrill(addDrill);
                if (!d) return;
                patch({ blocks: [...s.blocks, blockFromDrill(d, d.category, d.duration, s.age)] });
                setAddDrill("");
              }}
            >
              <Plus size={16} /> Agregar bloque
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

function Loader() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const { items, hydrated } = useTrainings();
  if (!hydrated) return <div className="card h-96 animate-pulse" />;
  const t = items.find((x) => x.id === id);
  if (!t)
    return <EmptyState title="Entrenamiento no encontrado" description="Puede que se haya borrado o esté guardado en otro dispositivo." action={<LinkButton href="/app/entrenamientos/">Ir al generador</LinkButton>} />;
  return <Editor key={t.id} initial={t} startEditing={sp.get("editar") === "1"} />;
}

export default function VerEntrenamientoPage() {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <Loader />
    </Suspense>
  );
}
