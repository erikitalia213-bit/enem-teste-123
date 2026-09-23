"use client";

import { Clock, Lightbulb, Package, Users, Target, ListOrdered } from "lucide-react";
import type { TrainingBlock } from "@/lib/types";

/** Minuto de inicio de cada bloque. */
export function blockStarts(blocks: TrainingBlock[]): number[] {
  const out: number[] = [];
  blocks.reduce((acc, b) => {
    out.push(acc);
    return acc + b.minutes;
  }, 0);
  return out;
}

/** Línea de tiempo del entrenamiento (pantalla e impresión). */
export function Timeline({ blocks }: { blocks: TrainingBlock[] }) {
  const total = blocks.reduce((a, b) => a + b.minutes, 0) || 1;
  const colors = ["#49F05A", "#5AC8FA", "#FFD23F", "#FF7A59", "#FF6BD6", "#9DA3A3", "#3bc44a", "#c7cccc"];
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label="Distribución del tiempo">
        {blocks.map((b, i) => (
          <div key={b.id} style={{ width: `${(b.minutes / total) * 100}%`, backgroundColor: colors[i % colors.length] }} title={`${b.phase}: ${b.minutes} min`} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist print-muted">
        {blocks.map((b, i) => (
          <li key={b.id} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            {b.minutes} min · {b.phase}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlockCard({ block, index, startMinute }: { block: TrainingBlock; index: number; startMinute: number }) {
  return (
    <article className="print-avoid card overflow-hidden">
      <header className="flex items-center gap-3 border-b border-line bg-white/[0.02] px-4 py-3">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-volt text-ink print-bg-white">
          <span className="font-display text-2xl font-extrabold leading-none">{block.minutes}</span>
          <span className="text-[0.6rem] font-bold uppercase">min</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-volt print-accent">
            {index + 1}. {block.phase} · min {startMinute}–{startMinute + block.minutes}
          </p>
          <h3 className="font-display text-2xl font-bold uppercase leading-tight">{block.title}</h3>
        </div>
      </header>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="space-y-3">
          <Info icon={Target} label="Objetivo" text={block.objective} />
          <Info icon={Clock} label="Duración" text={`${block.minutes} minutos`} />
          <Info icon={Package} label="Material" text={block.material} />
          <Info icon={Users} label="Organización" text={block.organization} />
        </div>
        <div className="space-y-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mist print-muted">
              <ListOrdered size={14} /> Ejecución
            </p>
            <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-snow/90">
              {block.execution.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-sky/25 bg-sky/5 p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky">
              <Lightbulb size={14} /> Consejo del coach
            </p>
            <p className="mt-1 text-sm text-snow/90">{block.coachTip}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, text }: { icon: typeof Clock; label: string; text: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mist print-muted">
        <Icon size={14} /> {label}
      </p>
      <p className="mt-0.5 text-sm text-snow/90">{text}</p>
    </div>
  );
}
