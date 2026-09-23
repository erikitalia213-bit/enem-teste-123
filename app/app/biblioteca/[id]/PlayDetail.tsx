"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, BookmarkPlus, Download, PenTool, Printer } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { PlayCard } from "@/components/plays/PlayCard";
import { PlayInfoBlocks } from "@/components/plays/PlayInfoBlocks";
import { Badge, Button, EmptyState, LinkButton, levelTone, useToast } from "@/components/ui";
import { useContent } from "@/components/app/ContentProvider";
import { FORMATION_MAP, formationName } from "@/lib/field";
import { downloadSvgAsPng, slugify } from "@/lib/exportImage";
import { useAddToPlaybook } from "@/lib/hooks";

export function PlayDetail({ id }: { id: string }) {
  const PLAYS = useContent().core.plays;
  const play = PLAYS.find((p) => p.id === id);
  const toast = useToast();
  const { add } = useAddToPlaybook();
  const ref = useRef<HTMLDivElement>(null);
  if (!play) return <EmptyState title="Jugada no encontrada" action={<LinkButton href="/app/biblioteca/">Ir a la biblioteca</LinkButton>} />;
  const related = PLAYS.filter((p) => p.category === play.category && p.id !== play.id).slice(0, 3);
  const idx = PLAYS.findIndex((p) => p.id === id);
  const prev = PLAYS[idx - 1];
  const next = PLAYS[idx + 1];

  return (
    <div className="animate-fade-up">
      <div className="no-print mb-4 flex items-center justify-between gap-2">
        <Link href="/app/biblioteca/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
          <ArrowLeft size={16} /> Biblioteca
        </Link>
        <div className="flex gap-2 text-sm">
          {prev && (
            <Link href={`/app/biblioteca/${prev.id}/`} className="rounded-lg px-2 py-1 text-mist hover:bg-white/5 hover:text-snow">
              ← Anterior
            </Link>
          )}
          {next && (
            <Link href={`/app/biblioteca/${next.id}/`} className="rounded-lg px-2 py-1 text-mist hover:bg-white/5 hover:text-snow">
              Siguiente →
            </Link>
          )}
        </div>
      </div>

      <article className="print-sheet grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div>
          <div ref={ref} className="overflow-hidden rounded-2xl border border-line">
            <div className="no-print">
              <PlayDiagram diagram={play.diagram} title={play.name} />
            </div>
            <div className="print-only">
              <PlayDiagram diagram={play.diagram} title={play.name} theme="print" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-mist print-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-volt" /> Lectura principal</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-amber" /> Lectura secundaria</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-5 rounded bg-snow" /> Ruta de apoyo</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-0 w-5 border-t-2 border-dashed border-mist" /> Motion</span>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="volt">{play.category}</Badge>
            <Badge tone={levelTone(play.level)}>{play.level}</Badge>
            <Badge>{formationName(play.formation)}</Badge>
          </div>
          <h1 className="h-display mt-3 text-5xl md:text-6xl">{play.name}</h1>
          <p className="mt-2 text-lg text-mist-2 print-muted">{play.objective}</p>
          <div className="no-print mt-5 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const r = add({ id: play.id, source: "library" }, play);
                toast(r.added ? `Agregada a ${r.playbook.teamName}` : "Ya está en tu playbook");
              }}
            >
              <BookmarkPlus size={17} /> Agregar a mi playbook
            </Button>
            <LinkButton variant="secondary" href={`/app/crear/?from=${play.id}`}>
              <PenTool size={17} /> Editar copia
            </LinkButton>
            <Button variant="ghost" onClick={() => window.print()}>
              <Printer size={17} /> Imprimir
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                const svg = ref.current?.querySelector(".no-print svg") as SVGSVGElement | null;
                if (svg) downloadSvgAsPng(svg, slugify(play.name));
              }}
            >
              <Download size={17} /> PNG
            </Button>
          </div>
          <div className="mt-6">
            <PlayInfoBlocks play={play} />
          </div>
          {FORMATION_MAP[play.formation] && (
            <p className="mt-4 text-sm text-mist print-muted">
              <span className="font-semibold text-mist-2">Formación {FORMATION_MAP[play.formation].name}:</span> {FORMATION_MAP[play.formation].description}
            </p>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="no-print mt-12" aria-labelledby="relacionadas">
          <h2 id="relacionadas" className="h-display mb-4 text-2xl">Más de {play.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PlayCard key={p.id} play={p} href={`/app/biblioteca/${p.id}/`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
