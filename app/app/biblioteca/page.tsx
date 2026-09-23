"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { BookmarkPlus, PenTool, Search, SlidersHorizontal } from "lucide-react";
import { PlayCard } from "@/components/plays/PlayCard";
import { Button, EmptyState, LinkButton, PageHeader, cn, useToast } from "@/components/ui";
import { PLAY_CATEGORIES } from "@/lib/constants";
import { useContent } from "@/components/app/ContentProvider";
import { FORMATIONS } from "@/lib/field";
import { useAddToPlaybook } from "@/lib/hooks";
import { LEVELS } from "@/lib/types";

const PAGE = 24;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function BibliotecaPage() {
  const toast = useToast();
  const PLAYS = useContent().core.plays;
  const { add } = useAddToPlaybook();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [level, setLevel] = useState<string>("Todos");
  const [formation, setFormation] = useState<string>("Todas");
  const [limit, setLimit] = useState(PAGE);
  const dq = useDeferredValue(q);

  const filtered = useMemo(() => {
    const nq = norm(dq.trim());
    return PLAYS.filter(
      (p) =>
        (cat === "Todas" || p.category === cat) &&
        (level === "Todos" || p.level === level) &&
        (formation === "Todas" || p.formation === formation) &&
        (!nq || norm(`${p.name} ${p.objective} ${p.description} ${p.category} ${p.tags?.join(" ") ?? ""}`).includes(nq)),
    );
  }, [PLAYS, dq, cat, level, formation]);

  const reset = () => {
    setQ("");
    setCat("Todas");
    setLevel("Todos");
    setFormation("Todas");
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Biblioteca"
        title={`${PLAYS.length} jugadas listas`}
        description="Jugadas originales de tocho bandera 5x5 con diagrama, objetivo, lecturas y consejos. Agrégalas a tu playbook o edítalas en el creador."
      />

      <div className="card mb-5 space-y-3 p-3 sm:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Buscar jugadas</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
            <input
              className="input h-11 pl-10"
              placeholder="Buscar por nombre, concepto o situación…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE);
              }}
            />
          </label>
          <label>
            <span className="sr-only">Nivel</span>
            <select className="input h-11" value={level} onChange={(e) => { setLevel(e.target.value); setLimit(PAGE); }}>
              <option value="Todos">Todos los niveles</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Formación</span>
            <select className="input h-11" value={formation} onChange={(e) => { setFormation(e.target.value); setLimit(PAGE); }}>
              <option value="Todas">Todas las formaciones</option>
              {FORMATIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categorías">
          {["Todas", ...PLAY_CATEGORIES].map((c) => {
            const count = c === "Todas" ? PLAYS.length : PLAYS.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                onClick={() => { setCat(c); setLimit(PAGE); }}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                  cat === c ? "border-volt bg-volt text-ink" : "border-line-2 text-mist-2 hover:border-mist/50 hover:text-snow",
                )}
              >
                {c} <span className={cat === c ? "text-ink/70" : "text-mist"}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-3 text-sm text-mist" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "jugada" : "jugadas"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal size={22} />} title="Sin resultados" description="Prueba con otra búsqueda o quita algunos filtros." action={<Button onClick={reset}>Quitar filtros</Button>} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filtered.slice(0, limit).map((p) => (
              <PlayCard
                key={p.id}
                play={p}
                href={`/app/biblioteca/${p.id}/`}
                actions={
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        const r = add({ id: p.id, source: "library" }, p);
                        toast(r.added ? `“${p.name}” agregada a tu playbook` : "Ya está en tu playbook");
                      }}
                    >
                      <BookmarkPlus size={15} /> Agregar a mi playbook
                    </Button>
                    <LinkButton size="sm" variant="ghost" href={`/app/crear/?from=${p.id}`} aria-label={`Editar una copia de ${p.name}`}>
                      <PenTool size={15} /> Editar
                    </LinkButton>
                  </>
                }
              />
            ))}
          </div>
          {limit < filtered.length && (
            <div className="mt-6 flex justify-center">
              <Button variant="secondary" size="lg" onClick={() => setLimit((l) => l + PAGE)}>
                Ver más jugadas ({filtered.length - limit} restantes)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
