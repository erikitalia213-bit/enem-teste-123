"use client";

import { PageHeader, Badge } from "@/components/ui";
import { ReadySessionList } from "@/components/training/ReadySessionList";
import { READY_SESSIONS } from "@/data/readySessions";

export default function EntrenamientosListosPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Bonus 1"
        title="50 entrenamientos listos"
        description="Sesiones completas organizadas por nivel. Ábrelas, imprímelas o guárdalas en tus entrenamientos para editarlas."
        actions={<Badge tone="volt">20 principiante · 18 intermedio · 12 avanzado</Badge>}
      />
      <ReadySessionList sessions={READY_SESSIONS} groups={["Principiante", "Intermedio", "Avanzado"]} />
    </div>
  );
}
