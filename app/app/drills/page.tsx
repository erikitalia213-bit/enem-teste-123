"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DrillCard } from "@/components/drills/DrillCard";
import { DRILL_META } from "@/components/drills/drillMeta";
import { Button, EmptyState, PageHeader, cn } from "@/components/ui";
import { DRILLS, DRILL_CATEGORIES } from "@/data/drills";
import { AGE_GROUPS, LEVELS } from "@/lib/types";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function DrillsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [level, setLevel] = useState("Todos");
  const [age, setAge] = useState("Todas");

  const list = useMemo(() => {
    const n = norm(q.trim());
    return DRILLS.filter(
      (d) =>
        (cat === "Todas" || d.category === cat) &&
        (level === "Todos" || d.level === level) &&
        (age === "Todas" || d.ages.includes(age as (typeof AGE_GROUPS)[number])) &&
        (!n || norm(`${d.name} ${d.objective} ${d.category}`).includes(n)),
    );
  }, [q, cat, level, age]);

  return (
    <div className="animate-fade-up">
      <PageHeader eyebrow="Biblioteca de drills" title={`${DRILLS.length} ejercicios`} description="Cada drill incluye objetivo, edad, nivel, material, instrucciones, variaciones, errores comunes y consejo del coach." />
      <div className="card mb-5 space-y-3 p-3 sm:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Buscar drills</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
            <input className="input h-11 pl-10" placeholder="Buscar drill…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label>
            <span className="sr-only">Nivel</span>
            <select className="input h-11" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Todos">Todos los niveles</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Edad</span>
            <select className="input h-11" value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="Todas">Todas las edades</option>
              {AGE_GROUPS.map((a) => (
                <option key={a} value={a}>
                  {a === "Adultos" ? a : `${a} años`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categorías de drills">
          {["Todas", ...DRILL_CATEGORIES].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              type="button"
              onClick={() => setCat(c)}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold", cat === c ? "border-volt bg-volt text-ink" : "border-line-2 text-mist-2 hover:text-snow")}
            >
              {c !== "Todas" && <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: DRILL_META[c as keyof typeof DRILL_META].color }} />}
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-mist" aria-live="polite">
        {list.length} drills
      </p>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {list.map((d) => (
            <DrillCard key={d.id} drill={d} />
          ))}
        </div>
      ) : (
        <EmptyState title="Sin resultados" description="Prueba con otros filtros." action={<Button onClick={() => { setQ(""); setCat("Todas"); setLevel("Todos"); setAge("Todas"); }}>Quitar filtros</Button>} />
      )}
    </div>
  );
}
