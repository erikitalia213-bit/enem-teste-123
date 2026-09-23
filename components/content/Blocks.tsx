import { Lightbulb } from "lucide-react";
import type { Block } from "@/data/manual-types";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return (
              <p key={i} className="leading-relaxed text-snow/85">
                {b.text}
              </p>
            );
          case "h":
            return (
              <h3 key={i} className="pt-2 font-display text-2xl font-bold uppercase text-snow">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, k) => (
                  <li key={k} className="flex gap-2.5 text-snow/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2">
                {b.items.map((it, k) => (
                  <li key={k} className="flex gap-3 text-snow/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-volt/15 font-display text-sm font-bold text-volt print-accent">{k + 1}</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            );
          case "tip":
            return (
              <aside key={i} className="print-avoid flex gap-3 rounded-xl border border-volt/30 bg-volt/[0.06] p-4">
                <Lightbulb size={20} className="mt-0.5 shrink-0 text-volt print-accent" aria-hidden="true" />
                <p className="text-snow/90">{b.text}</p>
              </aside>
            );
          case "table":
            return (
              <div key={i} className="print-avoid overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-mist-2">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} className="px-3 py-2.5 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {b.rows.map((r, k) => (
                      <tr key={k}>
                        {r.map((c, j) => (
                          <td key={j} className={`px-3 py-2.5 align-top ${j === 0 ? "font-semibold text-snow" : "text-snow/80"}`}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
