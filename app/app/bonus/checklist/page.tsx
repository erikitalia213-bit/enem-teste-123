"use client";

import { CheckSquare, Printer, RotateCcw } from "lucide-react";
import { Button, Card, PageHeader, cn } from "@/components/ui";
import { MATCH_CHECKLIST } from "@/data/bonuses";
import { KEYS, useStored } from "@/lib/storage";

export default function ChecklistPage() {
  const [done, setDone] = useStored<string[]>(KEYS.checklist, []);
  const total = MATCH_CHECKLIST.reduce((a, g) => a + g.items.length, 0);
  const pct = Math.round((done.length / total) * 100);
  const toggle = (key: string) => setDone((d) => (d.includes(key) ? d.filter((x) => x !== key) : [...d, key]));

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Bonus 2"
        title="Checklist del Día de Partido"
        description="Márcala en tu celular o imprímela. Se guarda tu avance hasta que la reinicies."
        actions={
          <>
            <Button onClick={() => window.print()}>
              <Printer size={17} /> Imprimir
            </Button>
            <Button variant="secondary" onClick={() => window.confirm("¿Reiniciar la checklist?") && setDone([])}>
              <RotateCcw size={17} /> Reiniciar
            </Button>
          </>
        }
      />
      <Card className="no-print mb-5 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {done.length} de {total} listos
          </span>
          <span className="font-display text-2xl font-bold text-volt">{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance de la checklist">
          <div className="h-full rounded-full bg-volt transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>
      <div className="print-sheet columns-1 gap-4 md:columns-2 xl:columns-3">
        {MATCH_CHECKLIST.map((g) => (
          <Card key={g.group} className="print-avoid mb-4 break-inside-avoid p-4">
            <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-bold uppercase">
              <CheckSquare size={18} className="text-volt print-accent" /> {g.group}
            </h2>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const key = `${g.group}:${it}`;
                const checked = done.includes(key);
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-white/[0.03]">
                      <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#49F05A]" checked={checked} onChange={() => toggle(key)} />
                      <span className={cn("text-sm", checked && "text-mist line-through print:no-underline")}>{it}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
