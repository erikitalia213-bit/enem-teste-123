"use client";

import Link from "next/link";
import { memo, type ReactNode } from "react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { Badge, levelTone } from "@/components/ui";
import { formationName } from "@/lib/field";
import type { Play } from "@/lib/types";

function PlayCardBase({ play, href, actions, number }: { play: Play; href: string; actions?: ReactNode; number?: string }) {
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <Link href={href} className="block" aria-label={`Ver jugada ${play.name}`}>
        <div className="relative border-b border-line">
          <PlayDiagram diagram={play.diagram} title={play.name} showNotes={false} />
          {number && <span className="absolute left-2 top-2 rounded-md bg-volt px-1.5 py-0.5 font-display text-sm font-bold text-ink">{number}</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="min-w-0">
            <h3 className="truncate font-display text-xl font-bold uppercase leading-tight group-hover:text-volt">{play.name}</h3>
          </Link>
          <Badge tone={levelTone(play.level)} className="shrink-0">
            {play.level}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-mist">
          {play.category} · {formationName(play.formation)}
        </p>
        {play.objective && <p className="mt-2 line-clamp-2 text-sm text-mist-2">{play.objective}</p>}
        {actions && <div className="mt-auto flex flex-wrap gap-1.5 pt-3">{actions}</div>}
      </div>
    </article>
  );
}

export const PlayCard = memo(PlayCardBase);
