"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckSquare, ClipboardList, Crosshair, Dumbbell, GraduationCap, Hand, Lock, ShieldHalf, Sparkles, Trophy, CalendarDays, School } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { BONUSES } from "@/data/bonuses";
import { ORDER_BUMPS, type OrderBumpId } from "@/config";
import { useUnlocked } from "@/lib/hooks";

const BONUS_ICONS = [ClipboardList, CheckSquare, CalendarDays, Trophy, Crosshair, Hand];

const EXTRAS: { id: OrderBumpId; href: string; desc: string; icon: typeof ShieldHalf }[] = [
  { id: "defensa", href: "/app/extras/playbook-defensivo/", desc: "30 esquemas defensivos con diagrama, conceptos y situaciones.", icon: ShieldHalf },
  { id: "pack50", href: "/app/extras/pack-50-entrenamientos/", desc: "50 sesiones por tema: infantiles, posiciones, pretemporada y más.", icon: Dumbbell },
  { id: "escolar", href: "/app/extras/kit-coach-escolar/", desc: "20 clases extra, planificación, evaluación, torneo y diplomas.", icon: School },
];

function ExtraCard({ e }: { e: (typeof EXTRAS)[number] }) {
  const { unlocked } = useUnlocked(e.id);
  const Icon = e.icon;
  return (
    <Link href={e.href} className="card card-hover group flex gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-volt/10 text-volt">
        <Icon size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-xl font-bold uppercase group-hover:text-volt">{ORDER_BUMPS[e.id].name}</span>
          {!unlocked && <Lock size={14} className="text-mist" aria-label="Bloqueado" />}
        </span>
        <span className="mt-1 block text-sm text-mist">{e.desc}</span>
      </span>
    </Link>
  );
}

export default function RecursosPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader eyebrow="Recursos" title="Todo tu material" description="Manual, clases escolares, bonus y complementos. Todo se puede imprimir o guardar como PDF." />

      <section className="mb-10" aria-labelledby="docs">
        <h2 id="docs" className="h-display mb-4 text-2xl">Documentos principales</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/app/manual/" className="card card-hover group relative overflow-hidden p-6">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-volt/10 blur-2xl" aria-hidden="true" />
            <BookOpen className="text-volt" size={30} />
            <p className="mt-4 font-display text-3xl font-extrabold uppercase leading-none group-hover:text-volt">Manual práctico Tocho Bandera 5x5</p>
            <p className="mt-2 text-mist">Introducción + 18 capítulos: fundamentos, jugadas, entrenamientos y organización.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-volt">
              Leer e imprimir <ArrowRight size={15} />
            </span>
          </Link>
          <Link href="/app/clases/" className="card card-hover group relative overflow-hidden p-6">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-sky/10 blur-2xl" aria-hidden="true" />
            <GraduationCap className="text-sky" size={30} />
            <p className="mt-4 font-display text-3xl font-extrabold uppercase leading-none group-hover:text-volt">20 clases listas para enseñar</p>
            <p className="mt-2 text-mist">Para profesores de educación física: de la introducción al mini torneo.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-volt">
              Ver clases <ArrowRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      <section className="mb-10" aria-labelledby="bonus">
        <h2 id="bonus" className="h-display mb-4 flex items-center gap-2 text-2xl">
          <Sparkles size={20} className="text-amber" /> Bonus incluidos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BONUSES.map((b, i) => {
            const Icon = BONUS_ICONS[i];
            return (
              <Link key={b.id} href={b.href} className="card card-hover group flex gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber/10 text-amber">
                  <Icon size={20} />
                </span>
                <span>
                  <Badge tone="amber">Bonus {b.number}</Badge>
                  <span className="mt-1 block font-display text-lg font-bold uppercase leading-tight group-hover:text-volt">{b.title}</span>
                  <span className="block text-sm text-mist">{b.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="extras">
        <h2 id="extras" className="h-display mb-4 text-2xl">Complementos</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {EXTRAS.map((e) => (
            <ExtraCard key={e.id} e={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
