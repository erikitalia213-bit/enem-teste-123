"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, ChevronDown, ClipboardList, GraduationCap, Printer, Trophy, CalendarRange } from "lucide-react";
import { BumpGate } from "@/components/app/BumpGate";
import { LogoMark } from "@/components/brand/Logo";
import { ClassView } from "@/components/content/ClassView";
import { Button, Card, Field, PageHeader, cn } from "@/components/ui";
import { DIPLOMA_TYPES, RUBRIC, RUBRIC_LEVELS, SCHOOL_KIT_CLASSES, SCHOOL_PLAN, SCHOOL_TOURNAMENT_GUIDE } from "@/data/schoolKit";

type Tab = "clases" | "plan" | "evaluacion" | "torneo" | "diplomas";

export default function KitEscolarPage() {
  const [tab, setTab] = useState<Tab>("clases");
  const [open, setOpen] = useState<string | null>(SCHOOL_KIT_CLASSES[0].id);
  const [printClass, setPrintClass] = useState<string | null>(null);
  const [dip, setDip] = useState({ names: "", type: DIPLOMA_TYPES[2], school: "", event: "Unidad de Tocho Bandera", date: new Date().toISOString().slice(0, 10), signer: "" });
  const names = dip.names
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  const tabs: { id: Tab; label: string; icon: typeof Award }[] = [
    { id: "clases", label: "20 clases", icon: GraduationCap },
    { id: "plan", label: "Planificación", icon: CalendarRange },
    { id: "evaluacion", label: "Evaluación", icon: ClipboardList },
    { id: "torneo", label: "Torneo escolar", icon: Trophy },
    { id: "diplomas", label: "Diplomas", icon: Award },
  ];

  return (
    <BumpGate id="escolar">
      <div className="animate-fade-up">
        <PageHeader
          eyebrow="Extra"
          title="Kit Coach Escolar"
          description="20 clases adicionales, planificación de 8 semanas, rúbrica de evaluación, guía de torneo escolar y diplomas editables."
          actions={
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={17} /> Imprimir sección
            </Button>
          }
        />
        <div className="no-print no-scrollbar mb-5 flex gap-1.5 overflow-x-auto" role="tablist">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold", tab === t.id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2 hover:text-snow")}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "clases" && (
          <ol className="space-y-2.5">
            {SCHOOL_KIT_CLASSES.map((c) => {
              const isOpen = open === c.id;
              return (
                <li key={c.id} className={cn("card overflow-hidden", printClass && printClass !== c.id && "print:hidden", printClass === c.id && "print-sheet")}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)} className="no-print flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.02]">
                    <span className="w-12 font-display text-3xl font-extrabold text-volt">{c.number}</span>
                    <span className="flex-1">
                      <span className="block font-display text-xl font-bold uppercase">{c.title}</span>
                      <span className="text-xs text-mist">
                        {c.age} · {c.duration} min
                      </span>
                    </span>
                    <ChevronDown size={20} className={cn("text-mist transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {(isOpen || printClass === c.id) && (
                    <div className="border-t border-line p-4">
                      <ClassView c={c} />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="no-print mt-4"
                        onClick={() => {
                          setPrintClass(c.id);
                          setTimeout(() => {
                            window.print();
                            setPrintClass(null);
                          }, 120);
                        }}
                      >
                        <Printer size={15} /> Imprimir esta clase
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {tab === "plan" && (
          <Card className="print-sheet overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mist">
                <tr>
                  <th className="px-4 py-3">Semana</th>
                  <th className="px-4 py-3">Tema</th>
                  <th className="px-4 py-3">Clases</th>
                  <th className="px-4 py-3">Evidencia de aprendizaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SCHOOL_PLAN.map((w) => (
                  <tr key={w.week} className="align-top">
                    <td className="px-4 py-3 font-display text-2xl font-bold text-volt print-accent">{w.week}</td>
                    <td className="px-4 py-3 font-semibold">{w.theme}</td>
                    <td className="px-4 py-3 text-snow/85">{w.classes.join(" · ")}</td>
                    <td className="px-4 py-3 text-snow/85">{w.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-line px-4 py-3 text-xs text-mist">Clases 01-20: sección “20 clases” del producto principal. Clases 21-40: este kit.</p>
          </Card>
        )}

        {tab === "evaluacion" && (
          <div className="print-sheet space-y-5">
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-mist">
                  <tr>
                    <th className="px-3 py-3">Criterio</th>
                    {RUBRIC_LEVELS.map((l) => (
                      <th key={l} className="px-3 py-3">
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {RUBRIC.map((r) => (
                    <tr key={r.criterion} className="align-top">
                      <td className="px-3 py-3 font-semibold text-volt print-accent">{r.criterion}</td>
                      {r.levels.map((l, i) => (
                        <td key={i} className="px-3 py-3 text-snow/85">
                          {l}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card className="print-page overflow-x-auto p-4">
              <h2 className="mb-3 font-display text-2xl font-bold uppercase">Hoja de registro del grupo</h2>
              <p className="mb-3 text-xs text-mist">Grupo: ______________ Fecha: ______________ Escala 1 a 4 según la rúbrica.</p>
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-line-2 px-2 py-1.5 text-left">#</th>
                    <th className="border border-line-2 px-2 py-1.5 text-left">Alumno</th>
                    {RUBRIC.map((r) => (
                      <th key={r.criterion} className="border border-line-2 px-2 py-1.5 text-xs">
                        {r.criterion}
                      </th>
                    ))}
                    <th className="border border-line-2 px-2 py-1.5 text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <tr key={i}>
                      <td className="border border-line-2 px-2 py-2 text-xs text-mist">{i + 1}</td>
                      <td className="w-56 border border-line-2 px-2 py-2" />
                      {RUBRIC.map((r) => (
                        <td key={r.criterion} className="border border-line-2 px-2 py-2" />
                      ))}
                      <td className="border border-line-2 px-2 py-2" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {tab === "torneo" && (
          <div className="print-sheet grid gap-4 md:grid-cols-2">
            {SCHOOL_TOURNAMENT_GUIDE.map((s, i) => (
              <Card key={s.step} className="print-avoid flex gap-3 p-4">
                <span className="font-display text-4xl font-extrabold text-volt print-accent">{i + 1}</span>
                <div>
                  <h2 className="font-display text-xl font-bold uppercase">{s.step}</h2>
                  <p className="mt-1 text-sm text-snow/85">{s.detail}</p>
                </div>
              </Card>
            ))}
            <Card className="no-print p-4 md:col-span-2">
              <p className="text-sm text-mist-2">
                Usa el{" "}
                <Link href="/app/bonus/kit-torneo/" className="font-semibold text-volt hover:underline">
                  Kit de Torneo
                </Link>{" "}
                para generar el calendario, capturar resultados y calcular la clasificación automáticamente.
              </p>
            </Card>
          </div>
        )}

        {tab === "diplomas" && (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <Card className="no-print h-fit space-y-3 p-4">
              <h2 className="font-display text-xl font-bold uppercase">Datos del diploma</h2>
              <Field label="Nombres (uno por línea)">{(id) => <textarea id={id} className="input min-h-[140px] text-sm" placeholder={"Ana López\nCarlos Ruiz"} value={dip.names} onChange={(e) => setDip({ ...dip, names: e.target.value })} />}</Field>
              <Field label="Reconocimiento">
                {(id) => (
                  <select id={id} className="input" value={dip.type} onChange={(e) => setDip({ ...dip, type: e.target.value })}>
                    {DIPLOMA_TYPES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="Escuela o equipo">{(id) => <input id={id} className="input" value={dip.school} onChange={(e) => setDip({ ...dip, school: e.target.value })} />}</Field>
              <Field label="Evento">{(id) => <input id={id} className="input" value={dip.event} onChange={(e) => setDip({ ...dip, event: e.target.value })} />}</Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Fecha">{(id) => <input id={id} type="date" className="input" value={dip.date} onChange={(e) => setDip({ ...dip, date: e.target.value })} />}</Field>
                <Field label="Firma">{(id) => <input id={id} className="input" placeholder="Prof. …" value={dip.signer} onChange={(e) => setDip({ ...dip, signer: e.target.value })} />}</Field>
              </div>
              <Button className="w-full" disabled={!names.length} onClick={() => window.print()}>
                <Printer size={17} /> Imprimir {names.length || ""} diplomas
              </Button>
            </Card>
            <div className="print-sheet space-y-5">
              <style>{`@media print { @page { size: landscape; margin: 10mm; } }`}</style>
              {(names.length ? names : ["Nombre del alumno"]).map((n, i) => (
                <section key={i} className="print-page mx-auto flex aspect-[1.414/1] w-full max-w-3xl flex-col items-center justify-between rounded-lg border-[10px] border-double border-[#173B20] bg-white p-8 text-center text-[#111] shadow-xl print:h-[180mm] print:max-w-none print:shadow-none">
                  <div className="flex items-center gap-2">
                    <LogoMark size={30} />
                    <span className="font-display text-lg font-bold uppercase tracking-widest">{dip.school || "Escuela"}</span>
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-[#138a22] print-accent">Reconocimiento</p>
                    <h2 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">{dip.type}</h2>
                    <p className="mt-4 text-sm">Se otorga a</p>
                    <p className="font-display text-4xl font-bold">{n}</p>
                    <p className="mt-3 text-sm text-[#444] print-muted">por su participación en {dip.event || "la unidad de Tocho Bandera"}.</p>
                  </div>
                  <div className="flex w-full items-end justify-between text-xs">
                    <span>{dip.date && new Date(dip.date + "T12:00").toLocaleDateString("es-MX", { dateStyle: "long" })}</span>
                    <span className="border-t border-[#111] px-8 pt-1">{dip.signer || "Firma"}</span>
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </BumpGate>
  );
}
