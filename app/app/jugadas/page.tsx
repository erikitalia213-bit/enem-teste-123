"use client";

import { useMemo, useState } from "react";
import { BookmarkPlus, Copy, Library, PenTool, Plus, Search, Shapes, Trash2 } from "lucide-react";
import { PlayCard } from "@/components/plays/PlayCard";
import { Button, EmptyState, IconButton, LinkButton, PageHeader, useToast } from "@/components/ui";
import { uid } from "@/lib/field";
import { useAddToPlaybook, usePlays } from "@/lib/hooks";

export default function MisJugadasPage() {
  const toast = useToast();
  const { items, upsert, remove, hydrated } = usePlays();
  const { add } = useAddToPlaybook();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return items
      .filter((p) => !n || `${p.name} ${p.category}`.toLowerCase().includes(n))
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [items, q]);

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Mis jugadas"
        title="Tus diseños"
        description="Jugadas que creaste o editaste. Se guardan en este dispositivo."
        actions={
          <>
            <LinkButton href="/app/crear/">
              <Plus size={17} /> Crear jugada
            </LinkButton>
            <LinkButton href="/app/biblioteca/" variant="secondary">
              <Library size={17} /> Biblioteca
            </LinkButton>
          </>
        }
      />

      {hydrated && items.length === 0 ? (
        <EmptyState
          icon={<Shapes size={22} />}
          title="Aún no tienes jugadas"
          description="Crea tu primera jugada desde cero o toma una de la biblioteca y adáptala a tu equipo."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <LinkButton href="/app/crear/">
                <PenTool size={17} /> Crear mi primera jugada
              </LinkButton>
              <LinkButton href="/app/biblioteca/" variant="secondary">
                Explorar la biblioteca
              </LinkButton>
            </div>
          }
        />
      ) : (
        <>
          <label className="relative mb-4 block max-w-md">
            <span className="sr-only">Buscar en mis jugadas</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
            <input className="input h-11 pl-10" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => (
              <PlayCard
                key={p.id}
                play={p}
                href={`/app/crear/?id=${p.id}`}
                actions={
                  <>
                    <LinkButton size="sm" href={`/app/crear/?id=${p.id}`}>
                      <PenTool size={15} /> Editar
                    </LinkButton>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const r = add({ id: p.id, source: "user" }, p);
                        toast(r.added ? "Agregada a tu playbook" : "Ya está en tu playbook");
                      }}
                    >
                      <BookmarkPlus size={15} /> Playbook
                    </Button>
                    <IconButton
                      label="Duplicar"
                      onClick={() => {
                        const copy = { ...p, id: uid("jug"), name: `${p.name} (copia)`, createdAt: Date.now(), updatedAt: Date.now() };
                        upsert(copy);
                        toast("Jugada duplicada");
                      }}
                    >
                      <Copy size={16} />
                    </IconButton>
                    <IconButton
                      label="Borrar"
                      className="hover:text-coral"
                      onClick={() => {
                        if (window.confirm(`¿Borrar “${p.name}”?`)) {
                          remove(p.id);
                          toast("Jugada borrada");
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </>
                }
              />
            ))}
          </div>
          {filtered.length === 0 && <p className="text-mist">No hay jugadas que coincidan con “{q}”.</p>}
        </>
      )}
    </div>
  );
}
