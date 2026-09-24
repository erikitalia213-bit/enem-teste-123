"use client";

import { plural } from "@/lib/cn";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, Download, FileUp, GripVertical, Plus, Printer, Trash2, Watch, X } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { PlayPicker } from "@/components/plays/PlayPicker";
import { Badge, Button, Card, EmptyState, Field, IconButton, LinkButton, PageHeader, cn, useToast } from "@/components/ui";
import { PLAYBOOK_SECTIONS, emptyPlaybook, usePlaybooks, usePlays, useProfile, useResolvePlay } from "@/lib/hooks";
import { countPlays, flattenPlaybook, moveRef, pad2, removeRef } from "@/lib/playbook";
import { KEYS, downloadFile, useStored } from "@/lib/storage";
import { slugify } from "@/lib/exportImage";
import type { Play, Playbook, PlaybookSectionId } from "@/lib/types";

type DragInfo = { section: PlaybookSectionId; index: number };

export default function PlaybookPage() {
  const toast = useToast();
  const { profile } = useProfile();
  const { items: playbooks, upsert, remove, hydrated } = usePlaybooks();
  const { items: userPlays, upsert: upsertPlay } = usePlays();
  const [prefs, setPrefs] = useStored<{ activePlaybook?: string }>(KEYS.prefs, {});
  const resolve = useResolvePlay();
  const [pickerFor, setPickerFor] = useState<PlaybookSectionId | null>(null);
  const [dragging, setDragging] = useState<DragInfo | null>(null);
  const [dropTarget, setDropTarget] = useState<DragInfo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pb = playbooks.find((p) => p.id === prefs.activePlaybook) ?? playbooks[0];

  const create = () => {
    const next = emptyPlaybook(profile?.coachName, profile?.teamName);
    upsert(next);
    setPrefs((p) => ({ ...p, activePlaybook: next.id }));
    toast("Playbook creado");
  };

  const update = (patch: Partial<Playbook>) => pb && upsert({ ...pb, ...patch, updatedAt: Date.now() });

  const exportJson = () => {
    if (!pb) return;
    const flat = flattenPlaybook(pb);
    const plays = flat.filter((f) => f.ref.source === "user").map((f) => userPlays.find((p) => p.id === f.ref.id)).filter(Boolean);
    downloadFile(`playbook-${slugify(pb.teamName)}.json`, JSON.stringify({ app: "FLAGLAB 5x5", type: "playbook", playbook: pb, plays }, null, 2));
    toast("Playbook exportado");
  };

  const importJson = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as { type?: string; playbook?: Playbook; plays?: Play[] };
      if (data.type !== "playbook" || !data.playbook) throw new Error();
      (data.plays ?? []).forEach((p) => upsertPlay(p));
      const imported = { ...data.playbook, id: `pb_${Date.now().toString(36)}`, updatedAt: Date.now() };
      upsert(imported);
      setPrefs((p) => ({ ...p, activePlaybook: imported.id }));
      toast("Playbook importado");
    } catch {
      toast("El archivo no es un playbook válido", "error");
    }
  };

  const onDrop = (to: DragInfo) => {
    if (!pb || !dragging) return;
    upsert(moveRef(pb, dragging, to));
    setDragging(null);
    setDropTarget(null);
  };

  if (!hydrated) return <div className="card h-96 animate-pulse" />;

  if (!pb)
    return (
      <div className="animate-fade-up">
        <PageHeader eyebrow="Mi playbook" title="Tu libro de jugadas" description="Organiza tus jugadas por secciones, numéralas e imprímelas para el partido." />
        <EmptyState
          icon={<BookOpen size={22} />}
          title="Crea tu primer playbook"
          description="Elige jugadas de la biblioteca o de tus diseños y organízalas en ofensiva, defensiva, red zone, conversión y situaciones especiales."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={create}>
                <Plus size={17} /> Crear playbook
              </Button>
              <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                <FileUp size={17} /> Importar
              </Button>
            </div>
          }
        />
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
      </div>
    );

  const flat = flattenPlaybook(pb);
  const numberOf = (section: PlaybookSectionId, index: number) => flat.find((f) => f.section === section && f.index === index)?.number ?? 0;
  const allRefs = flat.map((f) => f.ref);

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Mi playbook"
        title={pb.teamName || "Mi playbook"}
        description={`${plural(countPlays(pb), "jugada", "jugadas")} · Arrastra para reordenar o usa las flechas.`}
        actions={
          <>
            <LinkButton href={`/app/playbook/imprimir/?id=${pb.id}`}>
              <Printer size={17} /> Imprimir playbook
            </LinkButton>
            <Button variant="secondary" onClick={exportJson}>
              <Download size={17} /> Exportar
            </Button>
            <LinkButton variant="secondary" href={`/app/munequeras/?playbook=${pb.id}`}>
              <Watch size={17} /> Muñequeras
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          {playbooks.length > 1 && (
            <Card className="p-4">
              <Field label="Playbook activo">
                {(id) => (
                  <select id={id} className="input" value={pb.id} onChange={(e) => setPrefs((p) => ({ ...p, activePlaybook: e.target.value }))}>
                    {playbooks.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.teamName} {p.season ? `· ${p.season}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </Card>
          )}
          <Card className="space-y-3 p-4">
            <h2 className="font-display text-xl font-bold uppercase">Datos del playbook</h2>
            <Field label="Nombre del equipo">{(id) => <input id={id} className="input" value={pb.teamName} onChange={(e) => update({ teamName: e.target.value })} />}</Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Categoría">{(id) => <input id={id} className="input" placeholder="Ej. Sub-12 mixto" value={pb.category} onChange={(e) => update({ category: e.target.value })} />}</Field>
              <Field label="Temporada">{(id) => <input id={id} className="input" value={pb.season} onChange={(e) => update({ season: e.target.value })} />}</Field>
            </div>
            <Field label="Coach">{(id) => <input id={id} className="input" value={pb.coach} onChange={(e) => update({ coach: e.target.value })} />}</Field>
            <Field label="Notas">{(id) => <textarea id={id} className="input min-h-[90px] text-sm" placeholder="Reglas de la liga, señales, recordatorios…" value={pb.notes} onChange={(e) => update({ notes: e.target.value })} />}</Field>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={create}>
              <Plus size={15} /> Nuevo playbook
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              <FileUp size={15} /> Importar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm(`¿Borrar el playbook “${pb.teamName}”? Las jugadas no se borran.`)) {
                  remove(pb.id);
                  setPrefs((p) => ({ ...p, activePlaybook: undefined }));
                }
              }}
            >
              <Trash2 size={15} /> Borrar
            </Button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
          </div>
        </div>

        <div className="space-y-5">
          {PLAYBOOK_SECTIONS.map((s) => {
            const refs = pb.sections[s.id];
            return (
              <section
                key={s.id}
                aria-labelledby={`sec-${s.id}`}
                className={cn("card p-3 sm:p-4", dropTarget?.section === s.id && refs.length === 0 && "ring-2 ring-volt/50")}
                onDragOver={(e) => {
                  if (dragging && refs.length === 0) {
                    e.preventDefault();
                    setDropTarget({ section: s.id, index: 0 });
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (refs.length === 0) onDrop({ section: s.id, index: 0 });
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 id={`sec-${s.id}`} className="font-display text-2xl font-bold uppercase">
                    {s.label} <span className="text-base text-mist">({refs.length})</span>
                  </h2>
                  <Button size="sm" variant="outline" onClick={() => setPickerFor(s.id)}>
                    <Plus size={15} /> Agregar
                  </Button>
                </div>
                {refs.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-line-2 px-4 py-6 text-center text-sm text-mist">
                    Sin jugadas. Agrega desde la biblioteca o arrastra una jugada aquí.
                  </p>
                ) : (
                  <ol className="space-y-2">
                    {refs.map((ref, index) => {
                      const play = resolve(ref);
                      const isTarget = dropTarget?.section === s.id && dropTarget.index === index;
                      return (
                        <li
                          key={`${ref.source}-${ref.id}`}
                          draggable
                          onDragStart={(e) => {
                            setDragging({ section: s.id, index });
                            e.dataTransfer.effectAllowed = "move";
                          }}
                          onDragEnd={() => {
                            setDragging(null);
                            setDropTarget(null);
                          }}
                          onDragOver={(e) => {
                            if (!dragging) return;
                            e.preventDefault();
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const after = e.clientY > rect.top + rect.height / 2;
                            setDropTarget({ section: s.id, index: after ? index + 1 : index });
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (dropTarget) onDrop(dropTarget);
                          }}
                          className={cn(
                            "group flex items-center gap-2 rounded-xl border bg-ink-2 p-2 transition-colors",
                            dragging?.section === s.id && dragging.index === index ? "opacity-40" : "",
                            isTarget ? "border-volt border-t-4" : dropTarget?.section === s.id && dropTarget.index === index + 1 && index === refs.length - 1 ? "border-volt border-b-4" : "border-line",
                          )}
                        >
                          <GripVertical size={18} className="hidden shrink-0 cursor-grab text-mist sm:block" aria-hidden="true" />
                          <span className="w-8 shrink-0 text-center font-display text-xl font-bold text-volt">{pad2(numberOf(s.id, index))}</span>
                          <div className="w-20 shrink-0 overflow-hidden rounded-md border border-line sm:w-24">
                            {play ? <PlayDiagram diagram={play.diagram} compact showNotes={false} /> : <div className="aspect-[100/86] bg-line" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            {play ? (
                              <Link href={ref.source === "library" ? `/app/biblioteca/${ref.id}/` : ref.source === "user" ? `/app/crear/?id=${ref.id}` : `/app/extras/playbook-defensivo/`} className="block truncate font-semibold hover:text-volt">
                                {play.name}
                              </Link>
                            ) : (
                              <span className="block truncate text-coral">Jugada no disponible</span>
                            )}
                            <span className="flex flex-wrap items-center gap-1.5 text-xs text-mist">
                              {play?.category}
                              {ref.source === "user" && <Badge tone="sky">Mía</Badge>}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center">
                            <label className="sr-only" htmlFor={`mv-${s.id}-${index}`}>
                              Mover a sección
                            </label>
                            <select
                              id={`mv-${s.id}-${index}`}
                              className="input hidden h-8 w-auto py-0 text-xs md:block"
                              value={s.id}
                              onChange={(e) => upsert(moveRef(pb, { section: s.id, index }, { section: e.target.value as PlaybookSectionId, index: 999 }))}
                            >
                              {PLAYBOOK_SECTIONS.map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                            <IconButton label="Subir" disabled={index === 0} onClick={() => upsert(moveRef(pb, { section: s.id, index }, { section: s.id, index: index - 1 }))}>
                              <ArrowUp size={16} />
                            </IconButton>
                            <IconButton label="Bajar" disabled={index === refs.length - 1} onClick={() => upsert(moveRef(pb, { section: s.id, index }, { section: s.id, index: index + 2 }))}>
                              <ArrowDown size={16} />
                            </IconButton>
                            <IconButton label="Quitar del playbook" className="hover:text-coral" onClick={() => upsert(removeRef(pb, s.id, index))}>
                              <X size={16} />
                            </IconButton>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <PlayPicker
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        title={`Agregar a ${PLAYBOOK_SECTIONS.find((s) => s.id === pickerFor)?.label ?? ""}`}
        exclude={allRefs}
        onConfirm={(items) => {
          if (!pickerFor) return;
          update({ sections: { ...pb.sections, [pickerFor]: [...pb.sections[pickerFor], ...items.map((i) => i.ref)] } });
          toast(`${items.length} ${items.length === 1 ? "jugada agregada" : "jugadas agregadas"}`);
        }}
      />
    </div>
  );
}
