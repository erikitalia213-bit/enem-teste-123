"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Printer, Trash2, UserPlus, Users, Wand2, X } from "lucide-react";
import { Badge, Button, EmptyState, Field, IconButton, Modal, PageHeader, cn, useToast } from "@/components/ui";
import { uid } from "@/lib/field";
import { useDepthChart, useProfile, useRoster } from "@/lib/hooks";
import type { Player } from "@/lib/types";

const POSITIONS = ["QB", "C", "WR", "Rusher", "Esquina", "Safety", "Apoyador"];

const SLOTS = {
  ataque: [
    { id: "QB", label: "QB", pos: "QB", x: 50, y: 78 },
    { id: "C", label: "Centro", pos: "C", x: 50, y: 52 },
    { id: "X", label: "WR · X", pos: "WR", x: 12, y: 40 },
    { id: "Y", label: "WR · Y", pos: "WR", x: 68, y: 46 },
    { id: "Z", label: "WR · Z", pos: "WR", x: 88, y: 40 },
  ],
  defensa: [
    { id: "R", label: "Rusher", pos: "Rusher", x: 50, y: 78 },
    { id: "CB1", label: "Esquina 1", pos: "Esquina", x: 12, y: 58 },
    { id: "LB", label: "Apoyador", pos: "Apoyador", x: 50, y: 48 },
    { id: "CB2", label: "Esquina 2", pos: "Esquina", x: 88, y: 58 },
    { id: "S", label: "Safety", pos: "Safety", x: 50, y: 18 },
  ],
};

const emptyPlayer = (): Player => ({ id: uid("jgd"), name: "", number: "", primary: "WR", secondary: "", notes: "", createdAt: Date.now() });

export default function EquipoPage() {
  const toast = useToast();
  const { profile } = useProfile();
  const { items: roster, upsert, remove, hydrated } = useRoster();
  const [depth, setDepth] = useDepthChart();
  const [tab, setTab] = useState<"roster" | "depth">("roster");
  const [filter, setFilter] = useState("Todas");
  const [editing, setEditing] = useState<Player | null>(null);

  const sorted = useMemo(
    () =>
      roster
        .filter((p) => filter === "Todas" || p.primary === filter || p.secondary === filter)
        .slice()
        .sort((a, b) => (Number(a.number) || 999) - (Number(b.number) || 999) || a.name.localeCompare(b.name)),
    [roster, filter],
  );
  const byId = (id: string) => roster.find((p) => p.id === id);

  const saveEditing = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast("Escribe el nombre del jugador", "error");
      return;
    }
    const isNew = !roster.some((p) => p.id === editing.id);
    upsert({ ...editing, name: editing.name.trim() });
    toast(isNew ? "Jugador agregado" : "Jugador actualizado");
    setEditing(null);
  };

  const autoFill = () => {
    const next: Record<string, string[]> = {};
    const used: Record<string, Set<string>> = { ataque: new Set(), defensa: new Set() };
    (["ataque", "defensa"] as const).forEach((side) => {
      SLOTS[side].forEach((slot) => {
        const primary = roster.filter((p) => p.primary === slot.pos && !used[side].has(p.id));
        const secondary = roster.filter((p) => p.secondary === slot.pos && !used[side].has(p.id) && !primary.includes(p));
        const picks = [...primary, ...secondary].slice(0, slot.pos === "WR" ? 2 : 3);
        if (picks[0]) used[side].add(picks[0].id);
        next[slot.id] = picks.map((p) => p.id);
      });
    });
    setDepth(next);
    toast("Depth chart sugerido según posiciones");
  };

  const slotList = (id: string) => (depth[id] ?? []).filter((pid) => byId(pid));
  const setSlot = (id: string, list: string[]) => setDepth((d) => ({ ...d, [id]: list }));

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Mi equipo"
        title={profile?.teamName || "Tu roster"}
        description={`${roster.length} jugadores registrados. Solo guarda los datos necesarios para organizar al equipo.`}
        actions={
          <>
            <Button onClick={() => setEditing(emptyPlayer())}>
              <UserPlus size={17} /> Agregar jugador
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={17} /> Imprimir
            </Button>
          </>
        }
      />

      <div className="no-print mb-5 flex gap-1.5" role="tablist" aria-label="Secciones del equipo">
        {(
          [
            ["roster", "Roster"],
            ["depth", "Depth Chart"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("rounded-xl border px-4 py-2 font-display text-lg font-bold uppercase", tab === id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2")}>
            {label}
          </button>
        ))}
      </div>

      {tab === "roster" && (
        <>
          {hydrated && roster.length === 0 ? (
            <EmptyState icon={<Users size={22} />} title="Registra a tu equipo" description="Agrega nombre, número y posiciones. Te servirá para el depth chart y el tracker de estadísticas." action={<Button onClick={() => setEditing(emptyPlayer())}><Plus size={17} /> Agregar primer jugador</Button>} />
          ) : (
            <>
              <div className="no-print no-scrollbar mb-4 flex gap-1.5 overflow-x-auto" role="group" aria-label="Filtrar por posición">
                {["Todas", ...POSITIONS].map((p) => (
                  <button key={p} type="button" aria-pressed={filter === p} onClick={() => setFilter(p)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold", filter === p ? "border-volt bg-volt text-ink" : "border-line-2 text-mist-2")}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="print-sheet card overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-white/[0.02] text-xs uppercase tracking-wider text-mist">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Principal</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Secundaria</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Notas</th>
                      <th className="no-print px-4 py-3 text-right">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {sorted.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-display text-2xl font-bold text-volt">{p.number || "—"}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-mist sm:hidden">
                            {p.primary}
                            {p.secondary ? ` · ${p.secondary}` : ""}
                          </p>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <Badge tone="volt">{p.primary}</Badge>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">{p.secondary ? <Badge>{p.secondary}</Badge> : <span className="text-mist">—</span>}</td>
                        <td className="hidden max-w-xs truncate px-4 py-3 text-mist lg:table-cell">{p.notes}</td>
                        <td className="no-print px-2 py-3 text-right">
                          <IconButton label={`Editar a ${p.name}`} onClick={() => setEditing(p)}>
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton
                            label={`Eliminar a ${p.name}`}
                            className="hover:text-coral"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar a ${p.name} del roster?`)) remove(p.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sorted.length === 0 && <p className="p-6 text-center text-mist">No hay jugadores en esta posición.</p>}
              </div>
            </>
          )}
        </>
      )}

      {tab === "depth" && (
        <div>
          <div className="no-print mb-4 flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={autoFill} disabled={!roster.length}>
              <Wand2 size={17} /> Sugerir según posiciones
            </Button>
            <Button variant="ghost" onClick={() => setDepth({})}>
              Limpiar
            </Button>
            <p className="text-sm text-mist">El primero de cada lista es el titular.</p>
          </div>
          {roster.length === 0 && <p className="card mb-4 p-4 text-sm text-amber">Primero agrega jugadores en la pestaña Roster.</p>}
          <div className="print-sheet grid gap-6 xl:grid-cols-2">
            {(["ataque", "defensa"] as const).map((side) => (
              <section key={side} aria-labelledby={`dc-${side}`}>
                <h2 id={`dc-${side}`} className="h-display mb-3 text-2xl">
                  {side === "ataque" ? "Ataque" : "Defensa"}
                </h2>
                <div className="relative overflow-hidden rounded-2xl border border-line field-bg p-3 print-bg-white">
                  <div className="absolute inset-x-0 top-[66%] h-px bg-white/25" aria-hidden="true" />
                  <div className="relative grid grid-cols-2 gap-3 sm:block sm:h-[520px]">
                    {SLOTS[side].map((slot) => {
                      const list = slotList(slot.id);
                      const available = roster.filter((p) => !list.includes(p.id));
                      return (
                        <div
                          key={slot.id}
                          className="rounded-xl border border-line-2 bg-ink/90 p-2.5 shadow-lg sm:absolute sm:w-[31%] sm:-translate-x-1/2 sm:-translate-y-1/2"
                          style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                        >
                          <p className="mb-1.5 font-display text-sm font-bold uppercase text-volt print-accent">{slot.label}</p>
                          <ol className="space-y-1">
                            {list.map((pid, i) => {
                              const p = byId(pid)!;
                              return (
                                <li key={pid} className="flex items-center gap-1 text-sm">
                                  <span className={cn("w-4 text-xs font-bold", i === 0 ? "text-volt" : "text-mist")}>{i + 1}</span>
                                  <span className="min-w-0 flex-1 truncate">
                                    {p.number && <b className="mr-1">#{p.number}</b>}
                                    {p.name}
                                  </span>
                                  <span className="no-print flex">
                                    <IconButton label="Subir" className="h-6 w-6" disabled={i === 0} onClick={() => { const l = list.slice(); [l[i - 1], l[i]] = [l[i], l[i - 1]]; setSlot(slot.id, l); }}>
                                      <ArrowUp size={12} />
                                    </IconButton>
                                    <IconButton label="Bajar" className="h-6 w-6" disabled={i === list.length - 1} onClick={() => { const l = list.slice(); [l[i + 1], l[i]] = [l[i], l[i + 1]]; setSlot(slot.id, l); }}>
                                      <ArrowDown size={12} />
                                    </IconButton>
                                    <IconButton label="Quitar" className="h-6 w-6" onClick={() => setSlot(slot.id, list.filter((x) => x !== pid))}>
                                      <X size={12} />
                                    </IconButton>
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                          {available.length > 0 && (
                            <label className="no-print mt-1.5 block">
                              <span className="sr-only">Agregar a {slot.label}</span>
                              <select className="input h-8 py-0 text-xs" value="" onChange={(e) => e.target.value && setSlot(slot.id, [...list, e.target.value])}>
                                <option value="">+ Agregar…</option>
                                {available.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.number ? `#${p.number} ` : ""}
                                    {p.name} ({p.primary})
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing && roster.some((p) => p.id === editing.id) ? "Editar jugador" : "Nuevo jugador"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={saveEditing}>Guardar</Button>
          </>
        }
      >
        {editing && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              saveEditing();
            }}
          >
            <div className="grid grid-cols-[1fr_100px] gap-3">
              <Field label="Nombre">{(id) => <input id={id} className="input" autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />}</Field>
              <Field label="Número">{(id) => <input id={id} className="input" inputMode="numeric" maxLength={3} value={editing.number} onChange={(e) => setEditing({ ...editing, number: e.target.value.replace(/\D/g, "") })} />}</Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Posición principal">
                {(id) => (
                  <select id={id} className="input" value={editing.primary} onChange={(e) => setEditing({ ...editing, primary: e.target.value })}>
                    {POSITIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Posición secundaria">
                {(id) => (
                  <select id={id} className="input" value={editing.secondary} onChange={(e) => setEditing({ ...editing, secondary: e.target.value })}>
                    <option value="">Ninguna</option>
                    {POSITIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <Field label="Notas" hint="Solo información deportiva. Evita datos sensibles.">
              {(id) => <textarea id={id} className="input min-h-[80px] text-sm" value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />}
            </Field>
            <button type="submit" className="hidden">
              Guardar
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
