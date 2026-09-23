"use client";

import { useState } from "react";
import { BookmarkPlus, Printer, ShieldCheck } from "lucide-react";
import { BumpGate } from "@/components/app/BumpGate";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { Badge, Button, Card, PageHeader, cn, levelTone, useToast } from "@/components/ui";
import { DEFENSE_GROUPS } from "@/lib/constants";
import { useContent } from "@/components/app/ContentProvider";
import { formationName } from "@/lib/field";
import { defenseAsPlay, useAddToPlaybook } from "@/lib/hooks";

function PlaybookDefensivo() {
  const { schemes: DEFENSE_SCHEMES, concepts: DEFENSE_CONCEPTS, situations: DEFENSE_SITUATIONS } = useContent().defense!;
  const toast = useToast();
  const { add } = useAddToPlaybook();
  const [group, setGroup] = useState<string>("Todas");
  const [tab, setTab] = useState<"esquemas" | "conceptos" | "situaciones">("esquemas");
  const list = DEFENSE_SCHEMES.filter((s) => group === "Todas" || s.group === group);

  return (
      <div className="animate-fade-up">
        <PageHeader
          eyebrow="Extra"
          title="Playbook Defensivo 5x5"
          description="30 esquemas defensivos con diagrama, conceptos, coberturas y guía de situaciones."
          actions={
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={17} /> Imprimir
            </Button>
          }
        />
        <div className="no-print mb-5 flex gap-1.5" role="tablist">
          {(
            [
              ["esquemas", "30 esquemas"],
              ["conceptos", "Conceptos"],
              ["situaciones", "Situaciones"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("rounded-xl border px-4 py-2 font-display text-lg font-bold uppercase", tab === id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2")}>
              {label}
            </button>
          ))}
        </div>

        {tab === "esquemas" && (
          <>
            <div className="no-print no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
              {["Todas", ...DEFENSE_GROUPS].map((g) => (
                <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold", group === g ? "border-volt bg-volt text-ink" : "border-line-2 text-mist-2")}>
                  {g}
                </button>
              ))}
            </div>
            <div className="print-sheet grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((s) => (
                <Card key={s.id} className="print-avoid flex flex-col overflow-hidden">
                  <div className="no-print border-b border-line">
                    <PlayDiagram diagram={s.diagram} title={s.name} />
                  </div>
                  <div className="print-only border-b">
                    <PlayDiagram diagram={s.diagram} title={s.name} theme="print" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-2xl font-bold uppercase leading-tight">
                        <span className="text-volt print-accent">{String(DEFENSE_SCHEMES.indexOf(s) + 1).padStart(2, "0")}</span> {s.name}
                      </h2>
                      <Badge tone={levelTone(s.level)}>{s.level}</Badge>
                    </div>
                    <p className="text-xs text-mist">
                      {s.group} · contra {formationName(s.vs)}
                    </p>
                    <p className="mt-2 text-sm text-snow/90">{s.concept}</p>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold uppercase text-volt print-accent">Fortalezas</p>
                        <ul className="mt-1 space-y-0.5 text-snow/80">
                          {s.strengths.map((x) => (
                            <li key={x}>+ {x}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-coral">Debilidades</p>
                        <ul className="mt-1 space-y-0.5 text-snow/80">
                          {s.weaknesses.map((x) => (
                            <li key={x}>− {x}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-3 text-sm">
                      <b className="text-amber">Cuándo usarla:</b> <span className="text-snow/85">{s.whenToUse}</span>
                    </p>
                    <p className="mt-1 text-sm">
                      <b className="text-sky">Consejo:</b> <span className="text-snow/85">{s.coachTip}</span>
                    </p>
                    <div className="no-print mt-auto pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const r = add({ id: s.id, source: "defense" }, defenseAsPlay(s));
                          toast(r.added ? "Agregada a Defensiva en tu playbook" : "Ya está en tu playbook");
                        }}
                      >
                        <BookmarkPlus size={15} /> Agregar a mi playbook
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "conceptos" && (
          <div className="print-sheet grid gap-4 md:grid-cols-2">
            {DEFENSE_CONCEPTS.map((c) => (
              <Card key={c.title} className="print-avoid p-5">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
                  <ShieldCheck size={20} className="text-volt" /> {c.title}
                </h2>
                <div className="mt-2 space-y-2 text-snow/85">
                  {c.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "situaciones" && (
          <Card className="print-sheet overflow-x-auto p-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mist">
                <tr>
                  <th className="px-4 py-3">Situación</th>
                  <th className="px-4 py-3">Defensa sugerida</th>
                  <th className="px-4 py-3">Por qué</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {DEFENSE_SITUATIONS.map((s) => (
                  <tr key={s.situation}>
                    <td className="px-4 py-3 font-semibold">{s.situation}</td>
                    <td className="px-4 py-3 text-volt print-accent">{s.call}</td>
                    <td className="px-4 py-3 text-snow/80">{s.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
  );
}

export default function PlaybookDefensivoPage() {
  return (
    <BumpGate id="defensive_playbook">
      <PlaybookDefensivo />
    </BumpGate>
  );
}
