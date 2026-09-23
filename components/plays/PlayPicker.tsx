"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { Button, Modal, cn } from "@/components/ui";
import { DEFENSE_SCHEMES } from "@/data/defense";
import { PLAYS, PLAY_CATEGORIES } from "@/data/plays";
import { defenseAsPlay, usePlays, useUnlocked } from "@/lib/hooks";
import type { Play, PlayRef } from "@/lib/types";

type Tab = "library" | "user" | "defense";

const DEFENSE_PLAYS = DEFENSE_SCHEMES.map(defenseAsPlay);

export function PlayPicker({
  open,
  onClose,
  onConfirm,
  title = "Agregar jugadas",
  exclude = [],
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (refs: { ref: PlayRef; play: Play }[]) => void;
  title?: string;
  exclude?: PlayRef[];
}) {
  const { items: userPlays } = usePlays();
  const { unlocked: defenseUnlocked } = useUnlocked("defensa");
  const [tab, setTab] = useState<Tab>("library");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [selected, setSelected] = useState<Map<string, { ref: PlayRef; play: Play }>>(new Map());

  const excluded = useMemo(() => new Set(exclude.map((r) => `${r.source}:${r.id}`)), [exclude]);

  const list = useMemo(() => {
    const source = tab === "library" ? PLAYS : tab === "user" ? userPlays : DEFENSE_PLAYS;
    const n = q.trim().toLowerCase();
    return source.filter((p) => (tab !== "library" || cat === "Todas" || p.category === cat) && (!n || p.name.toLowerCase().includes(n)));
  }, [tab, userPlays, q, cat]);

  const toggle = (p: Play) => {
    const src: PlayRef["source"] = tab === "library" ? "library" : tab === "user" ? "user" : "defense";
    const key = `${src}:${p.id}`;
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(key)) next.delete(key);
      else next.set(key, { ref: { id: p.id, source: src }, play: p });
      return next;
    });
  };

  const close = () => {
    setSelected(new Map());
    onClose();
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "library", label: "Biblioteca", count: PLAYS.length },
    { id: "user", label: "Mis jugadas", count: userPlays.length },
    ...(defenseUnlocked ? [{ id: "defense" as Tab, label: "Defensivas", count: DEFENSE_PLAYS.length }] : []),
  ];

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      wide
      footer={
        <>
          <span className="mr-auto self-center text-sm text-mist">{selected.size} seleccionadas</span>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button
            disabled={!selected.size}
            onClick={() => {
              onConfirm(Array.from(selected.values()));
              close();
            }}
          >
            Agregar {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn("rounded-lg border px-3 py-1.5 text-sm font-semibold", tab === t.id ? "border-volt bg-volt/15 text-volt" : "border-line-2 text-mist-2")}
          >
            {t.label} <span className="text-mist">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_220px]">
        <label className="relative block">
          <span className="sr-only">Buscar</span>
          <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
          <input className="input pl-9" placeholder="Buscar jugada…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        {tab === "library" && (
          <label>
            <span className="sr-only">Categoría</span>
            <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option>Todas</option>
              {PLAY_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {list.length === 0 ? (
        <p className="py-10 text-center text-mist">{tab === "user" ? "Todavía no has creado jugadas." : "Sin resultados."}</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {list.map((p) => {
            const src = tab === "library" ? "library" : tab === "user" ? "user" : "defense";
            const key = `${src}:${p.id}`;
            const isSel = selected.has(key);
            const isEx = excluded.has(key);
            return (
              <button
                key={key}
                type="button"
                disabled={isEx}
                aria-pressed={isSel}
                onClick={() => toggle(p)}
                className={cn(
                  "relative overflow-hidden rounded-xl border text-left transition-colors disabled:opacity-40",
                  isSel ? "border-volt ring-2 ring-volt/40" : "border-line hover:border-mist/50",
                )}
              >
                <PlayDiagram diagram={p.diagram} compact showNotes={false} />
                <span className="block truncate px-2 py-1.5 text-sm font-semibold">{p.name}</span>
                {isSel && (
                  <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-volt text-ink">
                    <Check size={15} />
                  </span>
                )}
                {isEx && <span className="absolute left-1.5 top-1.5 rounded bg-ink/80 px-1.5 text-[0.65rem] font-bold">Ya agregada</span>}
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
