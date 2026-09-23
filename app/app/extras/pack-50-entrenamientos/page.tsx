"use client";

import { BumpGate } from "@/components/app/BumpGate";
import { ReadySessionList } from "@/components/training/ReadySessionList";
import { PageHeader, Badge } from "@/components/ui";
import { EXTRA_SESSIONS } from "@/data/readySessions";

const GROUPS = Array.from(new Set(EXTRA_SESSIONS.map((s) => s.group!)));

export default function Pack50Page() {
  return (
    <BumpGate id="pack50">
      <div className="animate-fade-up">
        <PageHeader eyebrow="Extra" title="Pack 50 Entrenamientos Extra" description="Sesiones por tema: infantiles, posiciones, pretemporada, semana de partido, sesiones de 30 minutos y condiciones especiales." actions={<Badge tone="volt">{EXTRA_SESSIONS.length} sesiones</Badge>} />
        <ReadySessionList sessions={EXTRA_SESSIONS} groups={GROUPS} />
      </div>
    </BumpGate>
  );
}
