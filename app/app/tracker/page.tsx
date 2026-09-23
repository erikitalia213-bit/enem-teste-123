"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Minus, Pencil, Plus, Printer, Save, Trash2, Trophy, UserPlus } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, IconButton, PageHeader, Segmented, cn, useToast } from "@/components/ui";
import { uid } from "@/lib/field";
import { useRoster, useTracker } from "@/lib/hooks";
import { STAT_KEYS, STAT_LABELS, STAT_SHORT, type StatKey, type StatLine, type TrackerSession } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);
const blankLine = (playerId: string, playerName: string): StatLine => ({ playerId, playerName, completions: 0, receptions: 0, touchdowns: 0, interceptions: 0, flags: 0, notes: "" });

function newSession(roster: { id: string; name: string; number: string }[]): TrackerSession {
  const now = Date.now();
  return {
    id: uid("trk"),
    kind: "Entrenamiento",
    date: today(),
    opponent: "",
    scoreUs: "",
    scoreThem: "",
    lines: roster.map((p) => blankLine(p.id, p.number ? `#${p.number} ${p.name}` : p.name)),
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

function SessionEditor({ initial, onDone }: { initial: TrackerSession; onDone: () => void }) {
  const toast = useToast();
  const { upsert } = useTracker();
  const [s, setS] = useState(initial);
  const [guest, setGuest] = useState("");
  const setLine = (i: number, patch: Partial<StatLine>) => setS((prev) => ({ ...prev, lines: prev.lines.map((l, k) => (k === i ? { ...l, ...patch } : l)) }));
  const bump = (i: number, key: StatKey, d: number) => setLine(i, { [key]: Math.max(0, s.lines[i][key] + d) } as Partial<StatLine>);
  const totals = STAT_KEYS.reduce((acc, k) => ({ ...acc, [k]: s.lines.reduce((a, l) => a + l[k], 0) }), {} as Record<StatKey, number>);

  const save = () => {
    upsert({ ...s, updatedAt: Date.now() });
    toast("Sesión guardada");
    onDone();
  };

  return (
    <div className="animate-fade-up">
      <button type="button" onClick={onDone} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
        <ArrowLeft size={16} /> Tracker
      </button>
      <PageHeader
        eyebrow="Registro de estadísticas"
        title={s.kind === "Partido" ? `Partido${s.opponent ? ` vs ${s.opponent}` : ""}` : "Entrenamiento"}
        actions={
          <Button onClick={save} size="lg">
            <Save size={18} /> Guardar sesión
          </Button>
        }
      />
      <Card className="mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <span className="label">Tipo</span>
          <Segmented label="Tipo de sesión" value={s.kind} onChange={(v) => setS({ ...s, kind: v })} options={[{ value: "Entrenamiento", label: "Entreno" }, { value: "Partido", label: "Partido" }]} />
        </div>
        <Field label="Fecha">{(id) => <input id={id} type="date" className="input" value={s.date} onChange={(e) => setS({ ...s, date: e.target.value })} />}</Field>
        {s.kind === "Partido" && (
          <>
            <Field label="Rival">{(id) => <input id={id} className="input" value={s.opponent} onChange={(e) => setS({ ...s, opponent: e.target.value })} />}</Field>
            <Field label="Nuestros puntos">{(id) => <input id={id} className="input" inputMode="numeric" value={s.scoreUs ?? ""} onChange={(e) => setS({ ...s, scoreUs: e.target.value.replace(/\D/g, "") })} />}</Field>
            <Field label="Puntos rival">{(id) => <input id={id} className="input" inputMode="numeric" value={s.scoreThem ?? ""} onChange={(e) => setS({ ...s, scoreThem: e.target.value.replace(/\D/g, "") })} />}</Field>
          </>
        )}
      </Card>

      {s.lines.length === 0 && (
        <p className="card mb-4 p-4 text-sm text-amber">
          No hay jugadores. Agrega jugadores en <Link href="/app/equipo/" className="underline">Mi equipo</Link> o agrega un invitado abajo.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {s.lines.map((l, i) => (
          <Card key={`${l.playerId}-${i}`} className="p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="truncate font-semibold">{l.playerName}</p>
              <IconButton label={`Quitar a ${l.playerName} de la sesión`} className="h-7 w-7 hover:text-coral" onClick={() => setS({ ...s, lines: s.lines.filter((_, k) => k !== i) })}>
                <Trash2 size={14} />
              </IconButton>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {STAT_KEYS.map((k) => (
                <div key={k} className="flex flex-col items-center rounded-lg border border-line bg-ink-2 py-1.5">
                  <span className="text-[0.62rem] font-bold uppercase tracking-wider text-mist" title={STAT_LABELS[k]}>
                    {STAT_SHORT[k]}
                  </span>
                  <button type="button" className="flex h-9 w-full items-center justify-center text-volt hover:bg-volt/10" aria-label={`Sumar ${STAT_LABELS[k]} a ${l.playerName}`} onClick={() => bump(i, k, 1)}>
                    <Plus size={16} />
                  </button>
                  <span className="font-display text-2xl font-bold leading-none">{l[k]}</span>
                  <button type="button" className="flex h-8 w-full items-center justify-center text-mist hover:bg-white/5" aria-label={`Restar ${STAT_LABELS[k]} a ${l.playerName}`} onClick={() => bump(i, k, -1)}>
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-2 block">
              <span className="sr-only">Notas de {l.playerName}</span>
              <input className="input h-9 text-sm" placeholder="Notas…" value={l.notes} onChange={(e) => setLine(i, { notes: e.target.value })} />
            </label>
          </Card>
        ))}
      </div>

      <form
        className="mt-4 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!guest.trim()) return;
          setS({ ...s, lines: [...s.lines, blankLine(uid("inv"), guest.trim())] });
          setGuest("");
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Nombre del jugador invitado</span>
          <input className="input" placeholder="Agregar jugador invitado…" value={guest} onChange={(e) => setGuest(e.target.value)} />
        </label>
        <Button type="submit" variant="secondary">
          <UserPlus size={16} /> Agregar
        </Button>
      </form>

      <Card className="mt-4 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mist">Totales de la sesión</p>
        <div className="flex flex-wrap gap-4">
          {STAT_KEYS.map((k) => (
            <div key={k}>
              <p className="font-display text-3xl font-bold text-volt">{totals[k]}</p>
              <p className="text-xs text-mist">{STAT_LABELS[k]}</p>
            </div>
          ))}
        </div>
        <Field label="Notas de la sesión" className="mt-4">
          {(id) => <textarea id={id} className="input min-h-[70px] text-sm" value={s.notes} onChange={(e) => setS({ ...s, notes: e.target.value })} />}
        </Field>
      </Card>
    </div>
  );
}

export default function TrackerPage() {
  const { items: sessions, remove, hydrated } = useTracker();
  const { items: roster } = useRoster();
  const [editing, setEditing] = useState<TrackerSession | null>(null);
  const [sortKey, setSortKey] = useState<StatKey>("touchdowns");
  const [kindFilter, setKindFilter] = useState<"Todas" | "Entrenamiento" | "Partido">("Todas");

  const filtered = useMemo(() => sessions.filter((s) => kindFilter === "Todas" || s.kind === kindFilter), [sessions, kindFilter]);

  const agg = useMemo(() => {
    const map = new Map<string, StatLine & { sessions: number }>();
    for (const s of filtered)
      for (const l of s.lines) {
        const key = l.playerId;
        const current = map.get(key) ?? { ...blankLine(l.playerId, l.playerName), sessions: 0 };
        STAT_KEYS.forEach((k) => (current[k] += l[k]));
        current.sessions += 1;
        current.playerName = roster.find((p) => p.id === l.playerId)?.name ?? l.playerName;
        map.set(key, current);
      }
    return Array.from(map.values()).sort((a, b) => b[sortKey] - a[sortKey]);
  }, [filtered, roster, sortKey]);

  const matches = sessions.filter((s) => s.kind === "Partido");
  const record = matches.reduce(
    (acc, m) => {
      const us = Number(m.scoreUs);
      const them = Number(m.scoreThem);
      if (m.scoreUs === "" || m.scoreThem === "" || Number.isNaN(us) || Number.isNaN(them)) return acc;
      if (us > them) acc.w++;
      else if (us < them) acc.l++;
      else acc.t++;
      return acc;
    },
    { w: 0, l: 0, t: 0 },
  );
  const leader = (k: StatKey) => {
    const top = agg.slice().sort((a, b) => b[k] - a[k])[0];
    return top && top[k] > 0 ? top : null;
  };

  if (editing) return <SessionEditor key={editing.id} initial={editing} onDone={() => setEditing(null)} />;

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Tracker"
        title="Estadísticas del equipo"
        description="Registra pases completos, recepciones, touchdowns, intercepciones y flags retiradas en entrenamientos y partidos."
        actions={
          <>
            <Button onClick={() => setEditing(newSession(roster))}>
              <Plus size={17} /> Nueva sesión
            </Button>
            {sessions.length > 0 && (
              <Button variant="secondary" onClick={() => window.print()}>
                <Printer size={17} /> Imprimir
              </Button>
            )}
          </>
        }
      />

      {hydrated && sessions.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={22} />}
          title="Sin sesiones registradas"
          description={roster.length ? "Crea una sesión y usa los botones + y − para registrar estadísticas en tiempo real." : "Primero registra a tus jugadores en Mi equipo. También puedes agregar invitados dentro de la sesión."}
          action={<Button onClick={() => setEditing(newSession(roster))}><Plus size={17} /> Registrar primera sesión</Button>}
        />
      ) : (
        <div className="print-sheet space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-mist">Sesiones</p>
              <p className="font-display text-4xl font-extrabold">{sessions.length}</p>
              <p className="text-xs text-mist">{sessions.length - matches.length} entrenamientos · {matches.length} partidos</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-mist">Récord</p>
              <p className="font-display text-4xl font-extrabold">
                {record.w}-{record.l}
                {record.t ? `-${record.t}` : ""}
              </p>
              <p className="text-xs text-mist">Ganados-perdidos{record.t ? "-empates" : ""}</p>
            </Card>
            {(["touchdowns", "flags"] as StatKey[]).map((k) => {
              const l = leader(k);
              return (
                <Card key={k} className="p-4">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-mist">
                    <Trophy size={13} className="text-amber" /> Líder en {STAT_LABELS[k].toLowerCase()}
                  </p>
                  {l ? (
                    <>
                      <p className="truncate font-display text-2xl font-bold">{l.playerName}</p>
                      <p className="text-sm text-volt">{l[k]}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-mist">Sin datos todavía</p>
                  )}
                </Card>
              );
            })}
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4">
              <h2 className="font-display text-2xl font-bold uppercase">Resumen por jugador</h2>
              <div className="no-print flex flex-wrap items-center gap-2">
                <Segmented label="Tipo" value={kindFilter} onChange={setKindFilter} options={[{ value: "Todas", label: "Todas" }, { value: "Entrenamiento", label: "Entrenos" }, { value: "Partido", label: "Partidos" }]} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-xs uppercase tracking-wider text-mist">
                  <tr className="border-b border-line">
                    <th className="px-4 py-2.5 text-left">Jugador</th>
                    <th className="px-2 py-2.5 text-center">Ses.</th>
                    {STAT_KEYS.map((k) => (
                      <th key={k} className="px-2 py-2.5 text-center">
                        <button type="button" onClick={() => setSortKey(k)} className={cn("font-bold uppercase", sortKey === k ? "text-volt" : "hover:text-snow")} title={`Ordenar por ${STAT_LABELS[k]}`}>
                          {STAT_SHORT[k]}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {agg.map((a) => (
                    <tr key={a.playerId}>
                      <td className="px-4 py-2.5 font-semibold">{a.playerName}</td>
                      <td className="px-2 py-2.5 text-center text-mist">{a.sessions}</td>
                      {STAT_KEYS.map((k) => (
                        <td key={k} className={cn("px-2 py-2.5 text-center font-display text-lg font-bold", sortKey === k && "text-volt")}>
                          {a[k]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line px-4 py-2 text-xs text-mist">
              {STAT_KEYS.map((k) => `${STAT_SHORT[k]} = ${STAT_LABELS[k]}`).join(" · ")}
            </p>
          </Card>

          <section>
            <h2 className="h-display mb-3 text-2xl">Sesiones</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sessions
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((s) => {
                  const td = s.lines.reduce((a, l) => a + l.touchdowns, 0);
                  return (
                    <Card key={s.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge tone={s.kind === "Partido" ? "amber" : "volt"}>{s.kind}</Badge>
                          <p className="mt-1.5 font-semibold">
                            {new Date(s.date + "T12:00").toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                            {s.opponent && ` · vs ${s.opponent}`}
                          </p>
                          <p className="text-sm text-mist">
                            {s.kind === "Partido" && s.scoreUs !== "" && s.scoreThem !== "" ? `${s.scoreUs} - ${s.scoreThem} · ` : ""}
                            {s.lines.length} jugadores · {td} TD
                          </p>
                        </div>
                        <div className="no-print flex">
                          <IconButton label="Editar sesión" onClick={() => setEditing(s)}>
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton label="Borrar sesión" className="hover:text-coral" onClick={() => window.confirm("¿Borrar esta sesión?") && remove(s.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
