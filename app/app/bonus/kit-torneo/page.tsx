"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ClipboardCheck, ListOrdered, Minus, Plus, Printer, Settings2, Shuffle, Table2, Trash2, Trophy, Users } from "lucide-react";
import { Button, Card, EmptyState, Field, IconButton, PageHeader, cn, useToast } from "@/components/ui";
import { uid } from "@/lib/field";
import { useRoster } from "@/lib/hooks";
import { KEYS, useStored } from "@/lib/storage";

interface Team {
  id: string;
  name: string;
}
interface Match {
  id: string;
  round: number;
  field: number;
  time: string;
  home: string;
  away: string;
  scoreHome: string;
  scoreAway: string;
}
interface Tournament {
  name: string;
  date: string;
  venue: string;
  startTime: string;
  matchMinutes: number;
  breakMinutes: number;
  fields: number;
  pointsWin: number;
  pointsTie: number;
  ourTeam: string;
  teams: Team[];
  matches: Match[];
  stats: Record<string, { td: number; rec: number; int: number; flags: number }>;
  checks: string[];
  notes: string;
}

const DEFAULT: Tournament = {
  name: "Torneo de Tocho Bandera",
  date: "",
  venue: "",
  startTime: "09:00",
  matchMinutes: 20,
  breakMinutes: 5,
  fields: 2,
  pointsWin: 3,
  pointsTie: 1,
  ourTeam: "",
  teams: [],
  matches: [],
  stats: {},
  checks: [],
  notes: "",
};

const TOURNAMENT_CHECKLIST = [
  "Reglamento del torneo impreso y compartido",
  "Campos marcados con conos (zona de anotación y mitad)",
  "Balones oficiales por campo",
  "Flags de dos colores y repuestos",
  "Árbitros o responsables por campo",
  "Silbatos y cronómetros",
  "Tabla de partidos visible",
  "Hojas de resultados",
  "Botiquín y contacto de emergencia",
  "Agua y sombra para equipos",
  "Premiación y diplomas",
  "Responsable de fotos y resultados",
];

const STAT_COLS = [
  { key: "td", label: "TD" },
  { key: "rec", label: "REC" },
  { key: "int", label: "INT" },
  { key: "flags", label: "FLG" },
] as const;

function addMinutes(hhmm: string, mins: number) {
  const [h, m] = hhmm.split(":").map(Number);
  const t = (h || 0) * 60 + (m || 0) + mins;
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** Calendario todos contra todos (método del círculo). */
function roundRobin(t: Tournament): Match[] {
  const ids = t.teams.map((x) => x.id);
  if (ids.length < 2) return [];
  const list = ids.length % 2 ? [...ids, "BYE"] : ids.slice();
  const n = list.length;
  const out: Match[] = [];
  let slot = 0;
  for (let r = 0; r < n - 1; r++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = list[i];
      const b = list[n - 1 - i];
      if (a !== "BYE" && b !== "BYE") pairs.push(r % 2 ? [b, a] : [a, b]);
    }
    pairs.forEach((p, k) => {
      const field = (k % Math.max(1, t.fields)) + 1;
      if (k > 0 && k % Math.max(1, t.fields) === 0) slot++;
      out.push({ id: uid("m"), round: r + 1, field, time: addMinutes(t.startTime, slot * (t.matchMinutes + t.breakMinutes)), home: p[0], away: p[1], scoreHome: "", scoreAway: "" });
    });
    slot++;
    list.splice(1, 0, list.pop()!);
  }
  return out;
}

type Tab = "equipos" | "partidos" | "clasificacion" | "roster" | "checklist" | "plan";

export default function KitTorneoPage() {
  const toast = useToast();
  const [stored, setStored] = useStored<Tournament>(KEYS.tournament, DEFAULT);
  const t: Tournament = { ...DEFAULT, ...stored };
  const set = (patch: Partial<Tournament>) => setStored((prev) => ({ ...DEFAULT, ...prev, ...patch }));
  const { items: roster } = useRoster();
  const [tab, setTab] = useState<Tab>("equipos");
  const [newTeam, setNewTeam] = useState("");
  const teamName = (id: string) => t.teams.find((x) => x.id === id)?.name ?? "—";

  const standings = useMemo(() => {
    const rows = t.teams.map((team) => ({ id: team.id, name: team.name, pj: 0, g: 0, e: 0, p: 0, pf: 0, pc: 0, pts: 0 }));
    const get = (id: string) => rows.find((r) => r.id === id);
    for (const m of t.matches) {
      if (m.scoreHome === "" || m.scoreAway === "") continue;
      const h = get(m.home);
      const a = get(m.away);
      if (!h || !a) continue;
      const sh = Number(m.scoreHome);
      const sa = Number(m.scoreAway);
      h.pj++;
      a.pj++;
      h.pf += sh;
      h.pc += sa;
      a.pf += sa;
      a.pc += sh;
      if (sh > sa) {
        h.g++;
        a.p++;
        h.pts += t.pointsWin;
      } else if (sh < sa) {
        a.g++;
        h.p++;
        a.pts += t.pointsWin;
      } else {
        h.e++;
        a.e++;
        h.pts += t.pointsTie;
        a.pts += t.pointsTie;
      }
    }
    return rows.sort((x, y) => y.pts - x.pts || y.pf - y.pc - (x.pf - x.pc) || y.pf - x.pf);
  }, [t.teams, t.matches, t.pointsWin, t.pointsTie]);

  const ourMatches = t.matches.filter((m) => m.home === t.ourTeam || m.away === t.ourTeam).sort((a, b) => a.time.localeCompare(b.time));

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "equipos", label: "Equipos", icon: Settings2 },
    { id: "partidos", label: "Tabla de partidos", icon: CalendarClock },
    { id: "clasificacion", label: "Resultados y clasificación", icon: Trophy },
    { id: "roster", label: "Roster y stats", icon: Users },
    { id: "checklist", label: "Checklist", icon: ClipboardCheck },
    { id: "plan", label: "Plan del día", icon: ListOrdered },
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Bonus 4 · Kit de Torneo"
        title={t.name || "Kit de Torneo"}
        description="Organiza un torneo completo: equipos, calendario automático, resultados, clasificación, stats, checklist y plan del día."
        actions={
          <Button onClick={() => window.print()}>
            <Printer size={17} /> Imprimir sección
          </Button>
        }
      />

      <div className="no-print no-scrollbar mb-5 flex gap-1.5 overflow-x-auto" role="tablist">
        {tabs.map((x) => {
          const Icon = x.icon;
          return (
            <button key={x.id} role="tab" type="button" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold", tab === x.id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:text-snow")}>
              <Icon size={16} /> {x.label}
            </button>
          );
        })}
      </div>

      <div className="print-sheet">
        <div className="print-only mb-4">
          <h1 className="font-display text-4xl font-extrabold uppercase">{t.name}</h1>
          <p>
            {t.date && new Date(t.date + "T12:00").toLocaleDateString("es-MX", { dateStyle: "long" })} {t.venue && `· ${t.venue}`}
          </p>
        </div>

        {tab === "equipos" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="no-print space-y-3 p-4">
              <h2 className="font-display text-xl font-bold uppercase">Datos del torneo</h2>
              <Field label="Nombre">{(id) => <input id={id} className="input" value={t.name} onChange={(e) => set({ name: e.target.value })} />}</Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha">{(id) => <input id={id} type="date" className="input" value={t.date} onChange={(e) => set({ date: e.target.value })} />}</Field>
                <Field label="Sede">{(id) => <input id={id} className="input" value={t.venue} onChange={(e) => set({ venue: e.target.value })} />}</Field>
                <Field label="Hora de inicio">{(id) => <input id={id} type="time" className="input" value={t.startTime} onChange={(e) => set({ startTime: e.target.value })} />}</Field>
                <Field label="Campos disponibles">{(id) => <input id={id} type="number" min={1} max={8} className="input" value={t.fields} onChange={(e) => set({ fields: Math.max(1, Number(e.target.value) || 1) })} />}</Field>
                <Field label="Minutos por partido">{(id) => <input id={id} type="number" min={5} max={60} className="input" value={t.matchMinutes} onChange={(e) => set({ matchMinutes: Math.max(5, Number(e.target.value) || 20) })} />}</Field>
                <Field label="Descanso entre partidos">{(id) => <input id={id} type="number" min={0} max={30} className="input" value={t.breakMinutes} onChange={(e) => set({ breakMinutes: Math.max(0, Number(e.target.value) || 0) })} />}</Field>
                <Field label="Puntos por victoria">{(id) => <input id={id} type="number" min={1} max={5} className="input" value={t.pointsWin} onChange={(e) => set({ pointsWin: Number(e.target.value) || 3 })} />}</Field>
                <Field label="Puntos por empate">{(id) => <input id={id} type="number" min={0} max={3} className="input" value={t.pointsTie} onChange={(e) => set({ pointsTie: Number(e.target.value) || 0 })} />}</Field>
              </div>
            </Card>
            <Card className="space-y-3 p-4">
              <h2 className="font-display text-xl font-bold uppercase">Equipos ({t.teams.length})</h2>
              <form
                className="no-print flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newTeam.trim()) return;
                  set({ teams: [...t.teams, { id: uid("eq"), name: newTeam.trim() }] });
                  setNewTeam("");
                }}
              >
                <label className="flex-1">
                  <span className="sr-only">Nombre del equipo</span>
                  <input className="input" placeholder="Nombre del equipo" value={newTeam} onChange={(e) => setNewTeam(e.target.value)} />
                </label>
                <Button type="submit">
                  <Plus size={16} /> Agregar
                </Button>
              </form>
              <ul className="divide-y divide-line">
                {t.teams.map((team, i) => (
                  <li key={team.id} className="flex items-center gap-2 py-2">
                    <span className="w-6 font-display font-bold text-volt">{i + 1}</span>
                    <input className="input h-9 flex-1" value={team.name} aria-label={`Nombre del equipo ${i + 1}`} onChange={(e) => set({ teams: t.teams.map((x) => (x.id === team.id ? { ...x, name: e.target.value } : x)) })} />
                    <label className="no-print flex items-center gap-1 text-xs text-mist">
                      <input type="radio" name="our" className="accent-[#49F05A]" checked={t.ourTeam === team.id} onChange={() => set({ ourTeam: team.id })} /> Mi equipo
                    </label>
                    <IconButton label={`Quitar ${team.name}`} className="no-print hover:text-coral" onClick={() => set({ teams: t.teams.filter((x) => x.id !== team.id), matches: t.matches.filter((m) => m.home !== team.id && m.away !== team.id) })}>
                      <Trash2 size={15} />
                    </IconButton>
                  </li>
                ))}
              </ul>
              <Button
                className="no-print w-full"
                variant="outline"
                disabled={t.teams.length < 2}
                onClick={() => {
                  if (t.matches.length && !window.confirm("Se reemplazará la tabla de partidos actual. ¿Continuar?")) return;
                  set({ matches: roundRobin(t) });
                  setTab("partidos");
                  toast("Calendario generado");
                }}
              >
                <Shuffle size={16} /> Generar calendario todos contra todos
              </Button>
            </Card>
          </div>
        )}

        {tab === "partidos" &&
          (t.matches.length === 0 ? (
            <EmptyState icon={<CalendarClock size={22} />} title="Sin calendario" description="Agrega al menos 2 equipos y genera el calendario." action={<Button onClick={() => setTab("equipos")}>Ir a equipos</Button>} />
          ) : (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mist">
                  <tr>
                    <th className="px-4 py-3">Ronda</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Campo</th>
                    <th className="px-4 py-3">Local</th>
                    <th className="px-4 py-3 text-center">Marcador</th>
                    <th className="px-4 py-3">Visitante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {t.matches.map((m) => (
                    <tr key={m.id} className={cn((m.home === t.ourTeam || m.away === t.ourTeam) && "bg-volt/[0.05]")}>
                      <td className="px-4 py-2.5 font-display text-lg font-bold">{m.round}</td>
                      <td className="px-4 py-2.5">{m.time}</td>
                      <td className="px-4 py-2.5">{m.field}</td>
                      <td className="px-4 py-2.5 font-semibold">{teamName(m.home)}</td>
                      <td className="px-4 py-2.5 text-center text-mist">{m.scoreHome !== "" && m.scoreAway !== "" ? `${m.scoreHome} - ${m.scoreAway}` : "___ - ___"}</td>
                      <td className="px-4 py-2.5 font-semibold">{teamName(m.away)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ))}

        {tab === "clasificacion" && (
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Card className="p-4">
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold uppercase">
                <Table2 size={18} className="text-volt" /> Resultados
              </h2>
              {t.matches.length === 0 ? (
                <p className="text-sm text-mist">Genera el calendario para capturar resultados.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {t.matches.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 py-2 text-sm">
                      <span className="w-12 shrink-0 text-xs text-mist">R{m.round} · {m.time}</span>
                      <span className="min-w-0 flex-1 truncate text-right font-semibold">{teamName(m.home)}</span>
                      <input aria-label={`Puntos de ${teamName(m.home)}`} inputMode="numeric" className="input h-9 w-12 px-1 text-center" value={m.scoreHome} onChange={(e) => set({ matches: t.matches.map((x) => (x.id === m.id ? { ...x, scoreHome: e.target.value.replace(/\D/g, "") } : x)) })} />
                      <span className="text-mist">-</span>
                      <input aria-label={`Puntos de ${teamName(m.away)}`} inputMode="numeric" className="input h-9 w-12 px-1 text-center" value={m.scoreAway} onChange={(e) => set({ matches: t.matches.map((x) => (x.id === m.id ? { ...x, scoreAway: e.target.value.replace(/\D/g, "") } : x)) })} />
                      <span className="min-w-0 flex-1 truncate font-semibold">{teamName(m.away)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="overflow-x-auto p-4">
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold uppercase">
                <Trophy size={18} className="text-amber" /> Clasificación
              </h2>
              <table className="w-full min-w-[420px] text-sm">
                <thead className="text-xs uppercase tracking-wider text-mist">
                  <tr className="border-b border-line">
                    <th className="py-2 text-left">#</th>
                    <th className="py-2 text-left">Equipo</th>
                    {["PJ", "G", "E", "P", "PF", "PC", "DIF", "PTS"].map((h) => (
                      <th key={h} className="py-2 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {standings.map((r, i) => (
                    <tr key={r.id} className={cn(r.id === t.ourTeam && "text-volt")}>
                      <td className="py-2 font-display text-lg font-bold">{i + 1}</td>
                      <td className="py-2 font-semibold">{r.name}</td>
                      <td className="py-2 text-center">{r.pj}</td>
                      <td className="py-2 text-center">{r.g}</td>
                      <td className="py-2 text-center">{r.e}</td>
                      <td className="py-2 text-center">{r.p}</td>
                      <td className="py-2 text-center">{r.pf}</td>
                      <td className="py-2 text-center">{r.pc}</td>
                      <td className="py-2 text-center">{r.pf - r.pc}</td>
                      <td className="py-2 text-center font-display text-lg font-bold">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-mist">Victoria {t.pointsWin} pts · Empate {t.pointsTie} pt · Desempate: diferencia y puntos a favor.</p>
            </Card>
          </div>
        )}

        {tab === "roster" && (
          <Card className="overflow-x-auto p-4">
            <h2 className="mb-1 font-display text-xl font-bold uppercase">Roster y stats del torneo</h2>
            <p className="mb-3 text-sm text-mist">Toma a los jugadores de Mi equipo. Registra touchdowns, recepciones, intercepciones y flags del torneo.</p>
            {roster.length === 0 ? (
              <p className="text-sm text-amber">Agrega jugadores en Mi equipo para usar esta tabla.</p>
            ) : (
              <table className="w-full min-w-[520px] text-sm">
                <thead className="text-xs uppercase tracking-wider text-mist">
                  <tr className="border-b border-line">
                    <th className="py-2 text-left">#</th>
                    <th className="py-2 text-left">Jugador</th>
                    <th className="py-2 text-left">Pos.</th>
                    {STAT_COLS.map((c) => (
                      <th key={c.key} className="py-2 text-center">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {roster.map((p) => {
                    const st = t.stats[p.id] ?? { td: 0, rec: 0, int: 0, flags: 0 };
                    const bump = (k: (typeof STAT_COLS)[number]["key"], d: number) => set({ stats: { ...t.stats, [p.id]: { ...st, [k]: Math.max(0, st[k] + d) } } });
                    return (
                      <tr key={p.id}>
                        <td className="py-2 font-display text-lg font-bold text-volt">{p.number}</td>
                        <td className="py-2 font-semibold">{p.name}</td>
                        <td className="py-2 text-mist">{p.primary}</td>
                        {STAT_COLS.map((c) => (
                          <td key={c.key} className="py-2">
                            <div className="flex items-center justify-center gap-1">
                              <IconButton label={`Restar ${c.label} a ${p.name}`} className="no-print h-7 w-7" onClick={() => bump(c.key, -1)}>
                                <Minus size={13} />
                              </IconButton>
                              <span className="w-6 text-center font-display text-lg font-bold">{st[c.key]}</span>
                              <IconButton label={`Sumar ${c.label} a ${p.name}`} className="no-print h-7 w-7 text-volt" onClick={() => bump(c.key, 1)}>
                                <Plus size={13} />
                              </IconButton>
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        )}

        {tab === "checklist" && (
          <Card className="p-4">
            <h2 className="mb-3 font-display text-xl font-bold uppercase">Checklist del organizador</h2>
            <ul className="grid gap-1 md:grid-cols-2">
              {TOURNAMENT_CHECKLIST.map((it) => (
                <li key={it}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
                    <input type="checkbox" className="h-5 w-5 accent-[#49F05A]" checked={t.checks.includes(it)} onChange={() => set({ checks: t.checks.includes(it) ? t.checks.filter((x) => x !== it) : [...t.checks, it] })} />
                    <span className="text-sm">{it}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "plan" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-4">
              <h2 className="mb-3 font-display text-xl font-bold uppercase">Plan del día {t.ourTeam ? `· ${teamName(t.ourTeam)}` : ""}</h2>
              {!t.ourTeam && <p className="no-print mb-3 text-sm text-amber">Marca “Mi equipo” en la pestaña Equipos para ver tus partidos.</p>}
              <ol className="relative space-y-3 border-l border-line pl-5">
                {[
                  { time: addMinutes(t.startTime, -60), text: "Llegada del coach: revisar campos y material" },
                  { time: addMinutes(t.startTime, -45), text: "Llegada del equipo: flags, uniformes y muñequeras" },
                  { time: addMinutes(t.startTime, -30), text: "Calentamiento de partido (15 min)" },
                  { time: addMinutes(t.startTime, -10), text: "Repaso de 3-4 jugadas y mensaje al equipo" },
                  ...ourMatches.map((m) => ({ time: m.time, text: `Partido vs ${teamName(m.home === t.ourTeam ? m.away : m.home)} · Campo ${m.field}` })),
                  ...(ourMatches.length ? [{ time: addMinutes(ourMatches[ourMatches.length - 1].time, t.matchMinutes + 15), text: "Estiramiento, hidratación y reconocimiento al equipo" }] : []),
                ].map((row, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-volt bg-ink" aria-hidden="true" />
                    <p className="font-display text-lg font-bold text-volt print-accent">{row.time}</p>
                    <p className="text-sm">{row.text}</p>
                  </li>
                ))}
              </ol>
            </Card>
            <Card className="p-4">
              <Field label="Notas del día (rotaciones, jugadas clave, contactos)">
                {(id) => <textarea id={id} className="input min-h-[260px] text-sm" value={t.notes} onChange={(e) => set({ notes: e.target.value })} />}
              </Field>
              <Button
                variant="danger"
                size="sm"
                className="no-print mt-4"
                onClick={() => {
                  if (window.confirm("¿Borrar todos los datos del torneo?")) setStored(DEFAULT);
                }}
              >
                <Trash2 size={15} /> Reiniciar torneo
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
