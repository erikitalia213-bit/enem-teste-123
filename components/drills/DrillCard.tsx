import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Badge, levelTone } from "@/components/ui";
import type { Drill } from "@/lib/types";
import { DRILL_META } from "./drillMeta";

export function DrillCard({ drill }: { drill: Drill }) {
  const meta = DRILL_META[drill.category];
  const Icon = meta.icon;
  return (
    <Link href={`/app/drills/${drill.id}/`} className="card card-hover group relative flex flex-col overflow-hidden p-4">
      <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: meta.color }} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}>
          <Icon size={21} />
        </span>
        <Badge tone={levelTone(drill.level)}>{drill.level}</Badge>
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>
        {drill.category}
      </p>
      <h3 className="font-display text-xl font-bold uppercase leading-tight group-hover:text-volt">{drill.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-mist-2">{drill.objective}</p>
      <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-xs text-mist">
        <span className="inline-flex items-center gap-1">
          <Clock size={13} /> {drill.duration} min
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={13} /> {drill.players.ideal}
        </span>
        <span>{drill.ages.length === 5 ? "Todas las edades" : drill.ages.join(" · ")}</span>
      </div>
    </Link>
  );
}
