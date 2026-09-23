"use client";

import { useMemo, useState } from "react";
import { PenTool, Timer, Watch } from "lucide-react";
import { PlayDiagram } from "@/components/diagram/PlayDiagram";
import { cn } from "@/components/ui";
import { ROUTE_TYPES, buildDiagram } from "@/lib/field";
import type { Diagram, RouteType, TrainingGoal } from "@/lib/types";

export type DemoBlock = { id: string; phase: string; title: string; objective: string; minutes: number };
export type DemoData = { sessions: Partial<Record<TrainingGoal, DemoBlock[]>>; wristband: { id: string; name: string; diagram: Diagram }[] };

const DEMO_ROUTES = ROUTE_TYPES.filter((r) => r.id !== "custom" && r.id !== "screen");

function RouteDemo() {
  const [route, setRoute] = useState<RouteType>("corner");
  const diagram = useMemo(
    () =>
      buildDiagram({
        formation: "twins",
        routes: [
          { p: "Y", r: route, read: 1 },
          { p: "Z", r: route === "go" ? "hook" : "go", read: 2 },
          { p: "X", r: "slant" },
          { p: "C", r: "hook", depth: 4 },
        ],
      }),
    [route],
  );
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_260px]">
      <div className="overflow-hidden rounded-2xl border border-line">
        <PlayDiagram diagram={diagram} title={`Ruta ${route} para Y`} />
      </div>
      <div>
        <p className="mb-2 text-sm text-mist-2">
          Elige la ruta de <b className="text-volt">Y</b> (lectura principal):
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_ROUTES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={route === r.id}
              onClick={() => setRoute(r.id)}
              className={cn("h-11 rounded-xl border text-sm font-bold transition-colors", route === r.id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:text-snow")}
            >
              {r.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-mist">En la app también mueves jugadores, dibujas rutas punto por punto, cambias colores y agregas notas.</p>
      </div>
    </div>
  );
}

function TrainingDemo({ sessions }: { sessions: DemoData["sessions"] }) {
  const goals = Object.keys(sessions) as TrainingGoal[];
  const [goal, setGoal] = useState<TrainingGoal>(goals[0]);
  const blocks = sessions[goal] ?? [];
  return (
    <div className="grid gap-5 md:grid-cols-[240px_1fr]">
      <div>
        <p className="mb-2 text-sm text-mist-2">Objetivo del entrenamiento (9-11 años · 60 min):</p>
        <div className="flex flex-wrap gap-1.5 md:flex-col">
          {goals.map((g) => (
            <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className={cn("rounded-lg border px-3 py-2 text-left text-sm font-semibold", goal === g ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:text-snow")}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <ol className="space-y-2">
        {blocks.map((b) => (
          <li key={b.id} className="flex items-center gap-3 rounded-xl border border-line bg-ink-2 p-3">
            <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-volt text-ink">
              <span className="font-display text-xl font-extrabold leading-none">{b.minutes}</span>
              <span className="text-[0.55rem] font-bold uppercase">min</span>
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-wider text-volt">{b.phase}</span>
              <span className="block truncate font-semibold">{b.title}</span>
              <span className="block truncate text-xs text-mist">{b.objective}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WristbandDemo({ plays }: { plays: DemoData["wristband"] }) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_260px]">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-2 shadow-2xl">
        <div className="grid grid-cols-3 border-2 border-[#111]">
          {plays.map((p, i) => (
            <div key={p.id} className="border border-[#bbb] p-1">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-lg font-extrabold leading-none text-[#111]">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate text-[0.55rem] font-bold uppercase text-[#111]">{p.name}</span>
              </div>
              <PlayDiagram diagram={p.diagram} theme="print" compact showNotes={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm text-mist-2">
        <p>
          Elige tus jugadas y FLAGLAB genera tarjetas numeradas <b className="text-snow">01, 02, 03…</b> con mini diagrama.
        </p>
        <ul className="mt-3 space-y-1.5">
          <li>• 6, 9, 12 o 18 jugadas por tarjeta</li>
          <li>• Papel carta o A4</li>
          <li>• Hoja del coach con la lista numerada</li>
        </ul>
      </div>
    </div>
  );
}

const TABS = [
  { id: "jugada", label: "Crea una jugada", icon: PenTool },
  { id: "entreno", label: "Genera un entrenamiento", icon: Timer },
  { id: "muneca", label: "Imprime tu muñequera", icon: Watch },
] as const;

export function Demo({ data }: { data: DemoData }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("jugada");
  return (
    <div className="card overflow-hidden">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line p-2" role="tablist" aria-label="Demo de FLAGLAB">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors", tab === t.id ? "bg-volt text-ink" : "text-mist-2 hover:bg-white/5 hover:text-snow")}>
              <Icon size={17} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 sm:p-6" role="tabpanel">
        {tab === "jugada" && <RouteDemo />}
        {tab === "entreno" && <TrainingDemo sessions={data.sessions} />}
        {tab === "muneca" && <WristbandDemo plays={data.wristband} />}
      </div>
    </div>
  );
}
