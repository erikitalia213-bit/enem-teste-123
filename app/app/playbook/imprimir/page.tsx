"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { Button, EmptyState, LinkButton, Segmented } from "@/components/ui";
import { LogoMark } from "@/components/brand/Logo";
import { PLAYBOOK_SECTIONS, usePlaybooks, useResolvePlay } from "@/lib/hooks";
import { flattenPlaybook, pad2 } from "@/lib/playbook";
import { formationName } from "@/lib/field";

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function PrintView() {
  const sp = useSearchParams();
  const { items, hydrated } = usePlaybooks();
  const resolve = useResolvePlay();
  const [perPage, setPerPage] = useState<1 | 2 | 4>(4);
  const [withNotes, setWithNotes] = useState(true);
  const pb = items.find((p) => p.id === sp.get("id")) ?? items[0];

  if (!hydrated) return <div className="card h-96 animate-pulse" />;
  if (!pb) return <EmptyState title="No hay playbook" description="Crea un playbook primero." action={<LinkButton href="/app/playbook/">Ir a Mi playbook</LinkButton>} />;

  const flat = flattenPlaybook(pb)
    .map((f) => ({ ...f, play: resolve(f.ref) }))
    .filter((f) => f.play);
  const pages = chunk(flat, perPage);
  const sectionLabel = (id: string) => PLAYBOOK_SECTIONS.find((s) => s.id === id)?.label ?? id;

  return (
    <div>
      <div className="no-print mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/app/playbook/" className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
            <ArrowLeft size={16} /> Volver al playbook
          </Link>
          <h1 className="h-display text-4xl">Vista de impresión</h1>
          <p className="text-sm text-mist">Usa “Imprimir” y elige “Guardar como PDF” para exportar. Recomendado: tamaño carta o A4, orientación vertical.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="Jugadas por página"
            value={perPage}
            onChange={setPerPage}
            options={[
              { value: 1, label: "1 x hoja" },
              { value: 2, label: "2 x hoja" },
              { value: 4, label: "4 x hoja" },
            ]}
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-[#49F05A]" checked={withNotes} onChange={(e) => setWithNotes(e.target.checked)} /> Incluir notas
          </label>
          <Button size="lg" onClick={() => window.print()}>
            <Printer size={18} /> IMPRIMIR PLAYBOOK
          </Button>
        </div>
      </div>

      <div className="print-sheet mx-auto max-w-[850px] space-y-6 print:space-y-0">
        {/* Portada */}
        <section className="print-page flex min-h-[1000px] flex-col justify-between rounded-xl bg-white p-12 text-[#111] shadow-xl print:min-h-[250mm] print:rounded-none print:p-0 print:shadow-none">
          <div className="flex items-center gap-3">
            <LogoMark size={40} />
            <span className="font-display text-2xl font-extrabold">FLAGLAB 5x5</span>
          </div>
          <div>
            <p className="font-display text-xl font-bold uppercase tracking-widest text-[#138a22] print-accent">Playbook {pb.season}</p>
            <h1 className="font-display text-7xl font-extrabold uppercase leading-none">{pb.teamName}</h1>
            {pb.category && <p className="mt-3 text-2xl text-[#444] print-muted">{pb.category}</p>}
            <div className="mt-10 grid max-w-md grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold uppercase text-[#666] print-muted">Coach</p>
                <p className="text-lg">{pb.coach || "—"}</p>
              </div>
              <div>
                <p className="font-bold uppercase text-[#666] print-muted">Jugadas</p>
                <p className="text-lg">{flat.length}</p>
              </div>
            </div>
            {pb.notes && <p className="mt-8 max-w-xl whitespace-pre-line border-l-4 border-[#138a22] pl-4 text-[#333]">{pb.notes}</p>}
          </div>
          <p className="text-xs text-[#777] print-muted">Generado con FLAGLAB 5x5 · Herramienta educativa independiente.</p>
        </section>

        {/* Índice */}
        <section className="print-page rounded-xl bg-white p-12 text-[#111] shadow-xl print:rounded-none print:p-0 print:shadow-none">
          <h2 className="mb-6 font-display text-4xl font-extrabold uppercase">Índice</h2>
          {PLAYBOOK_SECTIONS.map((s) => {
            const rows = flat.filter((f) => f.section === s.id);
            if (!rows.length) return null;
            return (
              <div key={s.id} className="print-avoid mb-6">
                <h3 className="mb-2 border-b-2 border-[#111] pb-1 font-display text-xl font-bold uppercase">{s.label}</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.number} className="border-b border-[#e5e5e5]">
                        <td className="w-12 py-1.5 font-display text-lg font-bold">{pad2(r.number)}</td>
                        <td className="py-1.5 font-semibold">{r.play!.name}</td>
                        <td className="py-1.5 text-[#555] print-muted">{formationName(r.play!.formation)}</td>
                        <td className="py-1.5 text-right text-[#555] print-muted">{r.play!.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>

        {/* Jugadas */}
        {pages.map((page, i) => (
          <section key={i} className="print-page rounded-xl bg-white p-8 text-[#111] shadow-xl print:rounded-none print:p-0 print:shadow-none">
            <div className={perPage === 1 ? "" : "grid grid-cols-2 gap-5"}>
              {page.map((f) => {
                const p = f.play!;
                const big = perPage === 1;
                return (
                  <article key={f.number} className={`print-avoid ${perPage === 2 ? "col-span-2" : ""}`}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2 border-b-2 border-[#111] pb-1">
                      <h3 className={`font-display font-extrabold uppercase leading-none ${big ? "text-4xl" : "text-xl"}`}>
                        <span className="mr-2 text-[#138a22] print-accent">{pad2(f.number)}</span>
                        {p.name}
                      </h3>
                      <span className="shrink-0 text-xs font-semibold text-[#555] print-muted">
                        {sectionLabel(f.section)} · {formationName(p.formation)}
                      </span>
                    </div>
                    <div className={perPage === 2 ? "grid grid-cols-[1.2fr_1fr] gap-4" : ""}>
                      <div className="rounded-md border border-[#ddd]">
                        <PlayDiagram diagram={p.diagram} theme="print" title={p.name} />
                      </div>
                      {withNotes && (
                        <div className={`mt-2 space-y-1 ${big ? "text-base" : "text-[0.72rem]"} leading-snug`}>
                          {p.objective && (
                            <p>
                              <b>Objetivo:</b> {p.objective}
                            </p>
                          )}
                          {p.primaryRead && (
                            <p>
                              <b className="text-[#138a22] print-accent">{p.side === "defense" ? "Fortalezas" : "1ª lectura"}:</b> {p.primaryRead}
                            </p>
                          )}
                          {p.secondaryRead && (
                            <p>
                              <b className="text-[#b07d00]">{p.side === "defense" ? "Debilidades" : "2ª lectura"}:</b> {p.secondaryRead}
                            </p>
                          )}
                          {(perPage < 4 || !p.primaryRead) && p.coachTip && (
                            <p>
                              <b>Consejo:</b> {p.coachTip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="mt-4 text-right text-[0.65rem] text-[#888] print-muted">
              {pb.teamName} · Playbook {pb.season} · Pág. {i + 3}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function PrintPlaybookPage() {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <PrintView />
    </Suspense>
  );
}
