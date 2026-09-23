"use client";

import { Printer, BookOpen } from "lucide-react";
import { Blocks } from "@/components/content/Blocks";
import { LogoMark } from "@/components/brand/Logo";
import { Button, PageHeader } from "@/components/ui";
import { CHAPTERS, MANUAL_SUBTITLE, MANUAL_TITLE } from "@/data/manual";

export default function ManualPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Manual práctico"
        title="Tocho Bandera 5x5"
        description={MANUAL_SUBTITLE}
        actions={
          <Button onClick={() => window.print()}>
            <Printer size={17} /> Imprimir / Guardar PDF
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label="Índice del manual" className="no-print lg:sticky lg:top-8 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto">
          <div className="card p-3">
            <p className="mb-2 flex items-center gap-2 px-2 font-display text-lg font-bold uppercase">
              <BookOpen size={17} className="text-volt" /> Índice
            </p>
            <ol className="space-y-0.5 text-sm">
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="flex gap-2 rounded-lg px-2 py-1.5 text-mist-2 hover:bg-white/5 hover:text-snow">
                    <span className="w-6 shrink-0 font-display font-bold text-volt">{c.number === 0 ? "·" : String(c.number).padStart(2, "0")}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="print-sheet min-w-0">
          {/* Portada solo impresión */}
          <section className="print-only print-page">
            <div style={{ minHeight: "240mm", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoMark size={40} />
                <b style={{ fontSize: 22 }}>FLAGLAB 5x5</b>
              </div>
              <div>
                <p className="print-accent" style={{ fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Manual práctico
                </p>
                <h1 className="font-display" style={{ fontSize: 72, fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase" }}>
                  {MANUAL_TITLE}
                </h1>
                <p style={{ fontSize: 20, marginTop: 16 }}>{MANUAL_SUBTITLE}</p>
              </div>
              <p className="print-muted" style={{ fontSize: 11 }}>
                FLAGLAB es una herramienta educativa independiente. No está afiliada a ninguna liga ni federación.
              </p>
            </div>
          </section>

          <div className="space-y-6">
            {CHAPTERS.map((c) => (
              <article key={c.id} id={c.id} className="card scroll-mt-24 p-5 sm:p-8 print:break-before-page print:border-0 print:p-0">
                <header className="mb-5 border-b border-line pb-4">
                  <p className="eyebrow print-accent">{c.number === 0 ? "Antes de empezar" : `Capítulo ${c.number}`}</p>
                  <h2 className="h-display mt-1 text-4xl md:text-5xl">{c.title}</h2>
                  <p className="mt-2 text-mist-2 print-muted">{c.summary}</p>
                </header>
                <div className="prose-flag max-w-3xl">
                  <Blocks blocks={c.blocks} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
