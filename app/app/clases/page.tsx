"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, GraduationCap, Printer, Users } from "lucide-react";
import { ClassView } from "@/components/content/ClassView";
import { Button, PageHeader } from "@/components/ui";
import { CLASSES } from "@/data/classes";

export default function ClasesPage() {
  const [printAll, setPrintAll] = useState(false);
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Profesores de educación física"
        title="20 clases listas para enseñar Tocho Bandera"
        description="Secuencia completa para escuela: de la introducción al mini torneo. Cada clase incluye objetivos, material, calentamiento, actividad principal, juego final, vuelta a la calma y notas de seguridad."
        actions={
          <Button
            onClick={() => {
              setPrintAll(true);
              setTimeout(() => window.print(), 150);
            }}
          >
            <Printer size={17} /> Imprimir las 20 clases
          </Button>
        }
      />
      <div className="no-print grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CLASSES.map((c) => (
          <Link key={c.id} href={`/app/clases/${c.id}/`} className="card card-hover group flex flex-col p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-4xl font-extrabold text-volt">{String(c.number).padStart(2, "0")}</span>
              <GraduationCap size={20} className="text-mist" />
            </div>
            <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight group-hover:text-volt">{c.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-mist-2">{c.objectives[0]}</p>
            <div className="mt-auto flex gap-3 pt-3 text-xs text-mist">
              <span className="inline-flex items-center gap-1">
                <Users size={13} /> {c.age}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {c.duration} min
              </span>
            </div>
          </Link>
        ))}
      </div>
      {printAll && (
        <div className="print-only print-sheet">
          {CLASSES.map((c) => (
            <div key={c.id} className="print-page">
              <ClassView c={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
