"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Clock, Lightbulb, ListOrdered, Package, Printer, Shuffle, Target, Users, LayoutGrid } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { DRILL_META } from "@/components/drills/drillMeta";
import { Badge, Button, Card, levelTone } from "@/components/ui";
import { useContent } from "@/components/app/ContentProvider";

export function DrillDetail({ id }: { id: string }) {
  const DRILLS = useContent().core.drills;
  const d = DRILLS.find((x) => x.id === id);
  if (!d) return <Card className="p-8 text-center">Drill no encontrado.</Card>;
  const meta = DRILL_META[d.category];
  const Icon = meta.icon;
  const related = DRILLS.filter((x) => x.category === d.category && x.id !== d.id).slice(0, 3);
  return (
    <div className="animate-fade-up">
      <Link href="/app/drills/" className="no-print mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
        <ArrowLeft size={16} /> Drills
      </Link>
      <article className="print-sheet">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}>
              <Icon size={30} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                {d.category}
              </p>
              <h1 className="h-display text-4xl md:text-5xl">{d.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={levelTone(d.level)}>{d.level}</Badge>
                <Badge>
                  <Clock size={12} /> {d.duration} min
                </Badge>
                <Badge>
                  <Users size={12} /> {d.players.ideal} (mín. {d.players.min})
                </Badge>
                <Badge>{d.ages.length === 5 ? "Todas las edades" : d.ages.map((a) => (a === "Adultos" ? a : `${a}`)).join(" · ")}</Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="no-print" onClick={() => window.print()}>
            <Printer size={17} /> Imprimir
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-4 p-5 lg:col-span-2">
            <Section icon={Target} title="Objetivo">
              <p>{d.objective}</p>
            </Section>
            <Section icon={LayoutGrid} title="Organización">
              <p>{d.setup}</p>
            </Section>
            <Section icon={ListOrdered} title="Cómo hacerlo">
              <ol className="list-decimal space-y-1.5 pl-5">
                {d.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </Section>
          </Card>
          <div className="space-y-4">
            <Card className="p-5">
              <Section icon={Package} title="Material">
                <ul className="list-disc space-y-1 pl-5">
                  {d.material.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </Section>
            </Card>
            <Card className="border-sky/30 p-5">
              <Section icon={Lightbulb} title="Consejo del coach" tone="text-sky">
                <p>{d.coachTip}</p>
              </Section>
            </Card>
          </div>
          <Card className="p-5">
            <Section icon={Shuffle} title="Variaciones">
              <ul className="list-disc space-y-1 pl-5">
                {d.variations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </Section>
          </Card>
          <Card className="p-5 lg:col-span-2">
            <Section icon={AlertTriangle} title="Errores comunes" tone="text-coral">
              <ul className="list-disc space-y-1 pl-5">
                {d.commonErrors.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </Section>
          </Card>
        </div>
      </article>
      {related.length > 0 && (
        <section className="no-print mt-10">
          <h2 className="h-display mb-4 text-2xl">Más de {d.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <DrillCard key={r.id} drill={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, children, tone = "text-volt" }: { icon: typeof Target; title: string; children: React.ReactNode; tone?: string }) {
  return (
    <section className="print-avoid">
      <h2 className={`mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${tone} print-accent`}>
        <Icon size={15} /> {title}
      </h2>
      <div className="text-snow/90">{children}</div>
    </section>
  );
}
