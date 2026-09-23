"use client";

import { Printer } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { Button, Card, PageHeader } from "@/components/ui";
import { DRILL_MAP } from "@/data/drills";
import type { GuideSection } from "@/data/bonuses";

export function Guide({ eyebrow, guide }: { eyebrow: string; guide: { title: string; intro: string; sections: GuideSection[]; drills: string[] } }) {
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow={eyebrow}
        title={guide.title}
        description={guide.intro}
        actions={
          <Button onClick={() => window.print()}>
            <Printer size={17} /> Imprimir guía
          </Button>
        }
      />
      <div className="print-sheet grid gap-4 md:grid-cols-2">
        {guide.sections.map((s, i) => (
          <Card key={s.title} className="print-avoid p-5">
            <p className="font-display text-sm font-bold text-volt print-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="font-display text-2xl font-bold uppercase">{s.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {s.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-snow/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <section className="no-print mt-10">
        <h2 className="h-display mb-4 text-2xl">Drills recomendados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {guide.drills.map((id) => DRILL_MAP[id] && <DrillCard key={id} drill={DRILL_MAP[id]} />)}
        </div>
      </section>
    </div>
  );
}
