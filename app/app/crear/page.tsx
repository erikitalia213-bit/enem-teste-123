"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { PlayCreator } from "@/components/creator/PlayCreator";
import { EmptyState, LinkButton } from "@/components/ui";
import { PLAY_MAP } from "@/data/plays";
import { cloneDiagram, uid } from "@/lib/field";
import { newDiagramFor } from "@/lib/diagramOps";
import { usePlays } from "@/lib/hooks";
import type { Play } from "@/lib/types";

function Loading() {
  return <div className="card h-[60vh] animate-pulse" aria-busy="true" aria-label="Cargando creador" />;
}

function blankPlay(): Play {
  const now = Date.now();
  return {
    id: uid("jug"),
    name: "",
    side: "offense",
    formation: "spread",
    category: "Mis jugadas",
    level: "Principiante",
    diagram: newDiagramFor("offense", "spread"),
    objective: "",
    description: "",
    primaryRead: "",
    secondaryRead: "",
    coachTip: "",
    source: "user",
    createdAt: now,
    updatedAt: now,
  };
}

function fromLibrary(id: string): Play | null {
  const lib = PLAY_MAP[id];
  if (!lib) return null;
  const now = Date.now();
  return { ...lib, id: uid("jug"), name: lib.name, diagram: cloneDiagram(lib.diagram), source: "user", createdAt: now, updatedAt: now };
}

function NewCreator({ from }: { from: string | null }) {
  const [initial] = useState<Play>(() => (from && fromLibrary(from)) || blankPlay());
  return <PlayCreator initial={initial} isNew />;
}

function CreatorLoader() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const from = sp.get("from");
  const nuevo = sp.get("nuevo");
  const { items, hydrated } = usePlays();
  if (!hydrated) return <Loading />;
  if (id) {
    const play = items.find((p) => p.id === id);
    if (!play)
      return (
        <EmptyState
          icon={<SearchX size={22} />}
          title="No encontramos esta jugada"
          description="Puede que se haya borrado o que esté guardada en otro dispositivo."
          action={<LinkButton href="/app/crear/">Crear una jugada nueva</LinkButton>}
        />
      );
    return <PlayCreator key={id} initial={play} isNew={false} />;
  }
  return <NewCreator key={`${from ?? ""}-${nuevo ?? ""}`} from={from} />;
}

export default function CrearPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreatorLoader />
    </Suspense>
  );
}
