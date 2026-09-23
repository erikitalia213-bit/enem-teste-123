"use client";

import { BumpGate } from "@/components/app/BumpGate";
import { useContent } from "@/components/app/ContentProvider";
import { ReadySessionList } from "@/components/training/ReadySessionList";
import { PageHeader, Badge } from "@/components/ui";

function Pack50() {
  const sessions = useContent().extraSessions ?? [];
  const groups = Array.from(new Set(sessions.map((s) => s.group!)));
  return (
    <div className="animate-fade-up">
      <PageHeader eyebrow="Extra" title="Pack 50 Entrenamientos Extra" description="Sesiones por tema: infantiles, posiciones, pretemporada, semana de partido, sesiones de 30 minutos y condiciones especiales." actions={<Badge tone="volt">{sessions.length} sesiones</Badge>} />
      <ReadySessionList sessions={sessions} groups={groups} />
    </div>
  );
}

export default function Pack50Page() {
  return (
    <BumpGate id="extra_trainings">
      <Pack50 />
    </BumpGate>
  );
}
