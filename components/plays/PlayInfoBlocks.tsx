import { Lightbulb, Target, Crosshair, AlignLeft } from "lucide-react";
import type { Play } from "@/lib/types";

export function PlayInfoBlocks({ play, compact = false }: { play: Play; compact?: boolean }) {
  const rows = [
    { icon: AlignLeft, label: "Descripción", text: play.description, tone: "text-mist-2" },
    { icon: Target, label: play.side === "defense" ? "Fortalezas" : "Lectura principal", text: play.primaryRead, tone: "text-volt" },
    { icon: Crosshair, label: play.side === "defense" ? "Debilidades" : "Lectura secundaria", text: play.secondaryRead, tone: "text-amber" },
    { icon: Lightbulb, label: "Consejo para el coach", text: play.coachTip, tone: "text-sky" },
  ].filter((r) => r.text);
  if (!rows.length) return null;
  return (
    <dl className={compact ? "space-y-2" : "space-y-3"}>
      {rows.map((r) => {
        const Icon = r.icon;
        return (
          <div key={r.label} className={`print-avoid rounded-xl border border-line bg-ink-2/60 ${compact ? "p-2.5" : "p-3.5"}`}>
            <dt className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${r.tone} print-accent`}>
              <Icon size={14} /> {r.label}
            </dt>
            <dd className={`mt-1 ${compact ? "text-sm" : ""} text-snow/90`}>{r.text}</dd>
          </div>
        );
      })}
    </dl>
  );
}

