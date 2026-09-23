"use client";

import Link from "next/link";
import { CalendarCheck, Printer } from "lucide-react";
import { Badge, Button, Card, PageHeader, cn } from "@/components/ui";
import { PLAN_30 } from "@/data/bonuses";
import { getReadySession } from "@/data/readySessions";
import { KEYS, useStored } from "@/lib/storage";

const TONE = { Entrenamiento: "volt", Coach: "sky", Descanso: "default", Partido: "amber" } as const;

export default function Plan30Page() {
  const [done, setDone] = useStored<number[]>(KEYS.plan30, []);
  const pct = Math.round((done.length / PLAN_30.length) * 100);
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Bonus 3"
        title="Plan de 30 días para un equipo nuevo"
        description="Del día 1 al primer partido. Cada día tiene una tarea clara: entrenar, organizar o descansar."
        actions={
          <Button onClick={() => window.print()}>
            <Printer size={17} /> Imprimir plan
          </Button>
        }
      />
      <Card className="no-print mb-5 flex items-center gap-4 p-4">
        <CalendarCheck className="text-volt" size={28} />
        <div className="flex-1">
          <p className="text-sm font-semibold">
            Día {Math.min(30, done.length + 1)} de 30 · {pct}% completado
          </p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-volt" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </Card>
      <ol className="print-sheet grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {PLAN_30.map((d) => {
          const checked = done.includes(d.day);
          const session = d.sessionId ? getReadySession(d.sessionId) : undefined;
          return (
            <li key={d.day} className={cn("card print-avoid flex gap-3 p-4", checked && "opacity-60")}>
              <div className="flex flex-col items-center">
                <span className="text-[0.65rem] font-bold uppercase text-mist">Día</span>
                <span className="font-display text-4xl font-extrabold leading-none text-volt print-accent">{d.day}</span>
                <input type="checkbox" aria-label={`Marcar día ${d.day} como hecho`} className="no-print mt-2 h-5 w-5 accent-[#49F05A]" checked={checked} onChange={() => setDone((x) => (x.includes(d.day) ? x.filter((n) => n !== d.day) : [...x, d.day]))} />
              </div>
              <div className="min-w-0 flex-1">
                <Badge tone={TONE[d.kind]}>{d.kind}</Badge>
                <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight">{d.title}</h2>
                <ul className="mt-1.5 space-y-1 text-sm text-snow/85">
                  {d.tasks.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mist" />
                      {t}
                    </li>
                  ))}
                </ul>
                {session && (
                  <Link href="/app/bonus/entrenamientos-listos/" className="no-print mt-2 inline-block text-sm font-semibold text-volt hover:underline">
                    Sesión: {session.title} ({session.duration} min) →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
