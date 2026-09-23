"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";
import { ClassView } from "@/components/content/ClassView";
import { Button } from "@/components/ui";
import { useContent } from "@/components/app/ContentProvider";
import { EmptyState } from "@/components/ui";

export function ClassDetail({ id }: { id: string }) {
  const CLASSES = useContent().core.classes;
  const c = CLASSES.find((x) => x.id === id);
  if (!c) return <EmptyState title="Clase no encontrada" />;
  const prev = CLASSES[c.number - 2];
  const next = CLASSES[c.number];
  return (
    <div className="animate-fade-up">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/app/clases/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
          <ArrowLeft size={16} /> 20 clases
        </Link>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer size={16} /> Imprimir clase
        </Button>
      </div>
      <div className="print-sheet">
        <ClassView c={c} />
      </div>
      <nav className="no-print mt-8 flex justify-between gap-3" aria-label="Navegación entre clases">
        {prev ? (
          <Link href={`/app/clases/${prev.id}/`} className="card card-hover flex items-center gap-2 p-3 text-sm">
            <ArrowLeft size={16} /> Clase {prev.number}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/app/clases/${next.id}/`} className="card card-hover flex items-center gap-2 p-3 text-right text-sm">
            Clase {next.number}: {next.title} <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </div>
  );
}
