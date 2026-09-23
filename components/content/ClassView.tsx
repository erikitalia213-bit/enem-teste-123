import { Clock, Flag, HeartPulse, Package, ShieldAlert, Target, Trophy, Users, Wind } from "lucide-react";
import type { SchoolClass } from "@/lib/types";

const SECTIONS: { key: keyof SchoolClass; label: string; icon: typeof Target; minutes?: string }[] = [
  { key: "objectives", label: "Objetivos", icon: Target },
  { key: "material", label: "Material", icon: Package },
  { key: "warmup", label: "Calentamiento", icon: HeartPulse, minutes: "8-10 min" },
  { key: "main", label: "Actividad principal", icon: Flag, minutes: "20-25 min" },
  { key: "finalGame", label: "Juego final", icon: Trophy, minutes: "8-10 min" },
  { key: "cooldown", label: "Vuelta a la calma", icon: Wind, minutes: "3-5 min" },
  { key: "safety", label: "Notas de seguridad", icon: ShieldAlert },
];

export function ClassView({ c }: { c: SchoolClass }) {
  return (
    <article className="print-avoid">
      <header className="mb-4">
        <p className="eyebrow print-accent">Clase {String(c.number).padStart(2, "0")}</p>
        <h2 className="h-display text-4xl">{c.title}</h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-mist-2 print-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users size={15} /> {c.age}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={15} /> {c.duration} minutos
          </span>
        </div>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {SECTIONS.map((s) => {
          const items = c[s.key] as string[];
          const Icon = s.icon;
          const wide = s.key === "main";
          return (
            <section key={s.key} className={`print-avoid rounded-xl border p-4 ${s.key === "safety" ? "border-coral/30 bg-coral/[0.05]" : "border-line bg-ink-2/60"} ${wide ? "md:col-span-2" : ""}`}>
              <h3 className={`mb-2 flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider ${s.key === "safety" ? "text-coral" : "text-volt"} print-accent`}>
                <span className="inline-flex items-center gap-1.5">
                  <Icon size={15} /> {s.label}
                </span>
                {s.minutes && <span className="font-semibold text-mist print-muted">{s.minutes}</span>}
              </h3>
              <ul className="space-y-1.5 text-sm text-snow/90">
                {items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
