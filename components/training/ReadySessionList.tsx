"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Clock, Printer, Save, Search } from "lucide-react";
import { Badge, Button, cn, levelTone, useToast } from "@/components/ui";
import { useLibraryMaps } from "@/lib/hooks";
import { blockFromDrill } from "@/lib/generator";
import { uid } from "@/lib/field";
import { useTrainings } from "@/lib/hooks";
import { TRAINING_GOALS, type AgeGroup, type Drill, type ReadySession, type TrainingSession } from "@/lib/types";

function toAgeGroup(age: string): AgeGroup {
  const n = parseInt(age, 10);
  if (Number.isNaN(n)) return "12-14";
  if (n <= 8) return "6-8";
  if (n <= 11) return "9-11";
  if (n <= 14) return "12-14";
  if (n <= 17) return "15-17";
  return "Adultos";
}

export function readyToTraining(rs: ReadySession, DRILL_MAP: Record<string, Drill>): TrainingSession {
  const age = toAgeGroup(rs.age);
  const now = Date.now();
  const goal = TRAINING_GOALS.find((g) => rs.focus.toLowerCase().includes(g.toLowerCase())) ?? "Juego completo";
  return {
    id: uid("ent"),
    title: rs.title,
    age,
    level: rs.level,
    duration: rs.duration,
    players: 10,
    goal,
    blocks: rs.blocks.map((b) => {
      const d = DRILL_MAP[b.drillId];
      return blockFromDrill(d, d.category, b.minutes, age);
    }),
    notes: rs.coachNote,
    createdAt: now,
    updatedAt: now,
  };
}

export function ReadySessionList({ sessions, groups }: { sessions: ReadySession[]; groups: string[] }) {
  const toast = useToast();
  const { upsert } = useTrainings();
  const DRILL_MAP = useLibraryMaps().drills;
  const [group, setGroup] = useState(groups[0] ?? "Todas");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [printId, setPrintId] = useState<string | null>(null);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return sessions.filter((s) => (group === "Todas" || s.group === group) && (!n || `${s.title} ${s.focus}`.toLowerCase().includes(n)));
  }, [sessions, group, q]);

  return (
    <div>
      <div className="no-print mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="tablist">
          {["Todas", ...groups].map((g) => (
            <button key={g} role="tab" type="button" aria-selected={group === g} onClick={() => setGroup(g)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold", group === g ? "border-volt bg-volt text-ink" : "border-line-2 text-mist-2 hover:text-snow")}>
              {g} <span className={group === g ? "text-ink/60" : "text-mist"}>{g === "Todas" ? sessions.length : sessions.filter((s) => s.group === g).length}</span>
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Buscar sesión</span>
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
          <input className="input pl-9" placeholder="Buscar sesión…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <ol className="space-y-2.5">
        {list.map((s) => {
          const isOpen = open === s.id;
          const rows = s.blocks.map((b, i) => ({ ...b, start: s.blocks.slice(0, i).reduce((a, x) => a + x.minutes, 0), drill: DRILL_MAP[b.drillId] }));
          return (
            <li key={s.id} className={cn("card overflow-hidden", printId && printId !== s.id && "print:hidden", printId === s.id && "print-sheet")}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)} className="no-print flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.02]">
                <span className="w-10 shrink-0 font-display text-3xl font-extrabold text-volt">{String(s.number).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold uppercase leading-tight">{s.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-mist">
                    <Badge tone={levelTone(s.level)}>{s.level}</Badge>
                    <span>{s.age}</span>·<span className="inline-flex items-center gap-1"><Clock size={12} /> {s.duration} min</span>·<span>{s.focus}</span>
                  </span>
                </span>
                <ChevronDown size={20} className={cn("shrink-0 text-mist transition-transform", isOpen && "rotate-180")} />
              </button>
              {(isOpen || printId === s.id) && (
                <div className="border-t border-line p-4">
                  <div className="print-only mb-3">
                    <h2 className="font-display text-3xl font-extrabold uppercase">
                      {String(s.number).padStart(2, "0")} · {s.title}
                    </h2>
                    <p>
                      {s.level} · {s.age} · {s.duration} min · {s.focus}
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-wider text-mist">
                      <tr>
                        <th className="py-1.5 pr-3">Min</th>
                        <th className="py-1.5 pr-3">Ejercicio</th>
                        <th className="hidden py-1.5 pr-3 sm:table-cell">Objetivo</th>
                        <th className="py-1.5 text-right">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {rows.map((r, i) => (
                        <tr key={i} className="align-top">
                          <td className="py-2 pr-3 font-display font-bold text-volt print-accent">{r.start}&apos;</td>
                          <td className="py-2 pr-3">
                            <Link href={`/app/drills/${r.drillId}/`} className="font-semibold hover:text-volt">
                              {r.drill?.name}
                            </Link>
                            <span className="block text-xs text-mist print-muted">{r.drill?.category}</span>
                          </td>
                          <td className="hidden py-2 pr-3 text-mist-2 sm:table-cell">{r.drill?.objective}</td>
                          <td className="py-2 text-right font-semibold">{r.minutes} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 rounded-lg border-l-2 border-volt bg-volt/[0.05] px-3 py-2 text-sm text-snow/90">
                    <b className="text-volt print-accent">Nota del coach:</b> {s.coachNote}
                  </p>
                  <div className="no-print mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        upsert(readyToTraining(s, DRILL_MAP));
                        toast("Guardado en tus entrenamientos. Ahí puedes editarlo.");
                      }}
                    >
                      <Save size={15} /> Guardar en mis entrenamientos
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setPrintId(s.id);
                        setTimeout(() => {
                          window.print();
                          setPrintId(null);
                        }, 120);
                      }}
                    >
                      <Printer size={15} /> Imprimir sesión
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
