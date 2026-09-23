"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Copy, Minus, Plus, Printer, RefreshCw, Save, Sparkles, Timer, Trash2, Wand2, CalendarDays } from "lucide-react";
import { BlockCard, Timeline, blockStarts } from "@/components/training/SessionView";
import { Badge, Button, Card, IconButton, LinkButton, PageHeader, Segmented, cn, useToast } from "@/components/ui";
import { DURATION_NOTES } from "@/data/trainingTemplates";
import { generateTraining } from "@/lib/generator";
import { uid } from "@/lib/field";
import { useTrainings } from "@/lib/hooks";
import { useContent } from "@/components/app/ContentProvider";
import { AGE_GROUPS, DURATIONS, LEVELS, TRAINING_GOALS, type AgeGroup, type Level, type TrainingGoal, type TrainingSession } from "@/lib/types";
import { KEYS, useStored } from "@/lib/storage";

interface GenPrefs {
  age: AgeGroup;
  level: Level;
  duration: number;
  players: number;
  goal: TrainingGoal;
}

export default function EntrenamientosPage() {
  const router = useRouter();
  const toast = useToast();
  const { items, upsert, remove } = useTrainings();
  const drills = useContent().core.drills;
  const [prefs, setPrefs] = useStored<{ gen?: GenPrefs }>(KEYS.prefs, {});
  const g: GenPrefs = { age: "9-11", level: "Principiante", duration: 60, players: 10, goal: "Pase", ...prefs.gen };
  const setG = (patch: Partial<GenPrefs>) => setPrefs((p) => ({ ...p, gen: { ...g, ...p.gen, ...patch } }));
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [seed, setSeed] = useState(1);
  const resultRef = useRef<HTMLDivElement>(null);

  const generate = (nextSeed = seed) => {
    const s = generateTraining({ ...g, seed: nextSeed * 7919 + g.players * 31 + g.duration }, drills);
    setSession(s);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const save = (openEditor = false) => {
    if (!session) return;
    upsert(session);
    toast("Entrenamiento guardado");
    if (openEditor) router.push(`/app/entrenamientos/ver/?id=${session.id}&editar=1`);
    else router.push(`/app/entrenamientos/ver/?id=${session.id}`);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Generador de entrenamientos"
        title="Prepara tu sesión en segundos"
        description="Elige edad, nivel, duración, jugadores y objetivo. FLAGLAB arma una sesión completa con ejercicios, tiempos y consejos."
        actions={
          <LinkButton href="/app/bonus/entrenamientos-listos/" variant="secondary">
            <Sparkles size={17} /> 50 entrenamientos listos
          </LinkButton>
        }
      />

      <Card className="no-print p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <span className="label">Edad</span>
              <Segmented label="Edad" value={g.age} onChange={(v) => setG({ age: v })} options={AGE_GROUPS.map((a) => ({ value: a, label: a === "Adultos" ? a : `${a} años` }))} />
            </div>
            <div>
              <span className="label">Nivel</span>
              <Segmented label="Nivel" value={g.level} onChange={(v) => setG({ level: v })} options={LEVELS.map((l) => ({ value: l, label: l }))} />
            </div>
            <div>
              <span className="label">Duración</span>
              <Segmented label="Duración" value={g.duration} onChange={(v) => setG({ duration: v })} options={DURATIONS.map((d) => ({ value: d as number, label: `${d} min` }))} />
            </div>
            <div>
              <label className="label" htmlFor="players">
                Número de jugadores
              </label>
              <div className="flex items-center gap-2">
                <IconButton label="Menos jugadores" className="h-11 w-11 border border-line-2" onClick={() => setG({ players: Math.max(2, g.players - 1) })}>
                  <Minus size={18} />
                </IconButton>
                <input id="players" type="number" min={2} max={40} className="input h-11 w-20 text-center text-lg font-bold" value={g.players} onChange={(e) => setG({ players: Math.max(2, Math.min(40, Number(e.target.value) || 2)) })} />
                <IconButton label="Más jugadores" className="h-11 w-11 border border-line-2" onClick={() => setG({ players: Math.min(40, g.players + 1) })}>
                  <Plus size={18} />
                </IconButton>
              </div>
            </div>
          </div>
          <div>
            <span className="label">Objetivo</span>
            <div role="radiogroup" aria-label="Objetivo" className="grid grid-cols-2 gap-2">
              {TRAINING_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  role="radio"
                  aria-checked={g.goal === goal}
                  onClick={() => setG({ goal })}
                  className={cn(
                    "h-12 rounded-xl border px-3 text-left text-sm font-semibold transition-colors",
                    g.goal === goal ? "border-volt bg-volt/15 text-volt" : "border-line-2 bg-ink-2 text-mist-2 hover:text-snow",
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
            <Button size="lg" className="mt-5 w-full" onClick={() => { setSeed(1); generate(1); }}>
              <Wand2 size={19} /> GENERAR ENTRENAMIENTO
            </Button>
          </div>
        </div>
      </Card>

      {session && (
        <section ref={resultRef} className="mt-8 scroll-mt-20" aria-labelledby="resultado">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Tu sesión</p>
              <h2 id="resultado" className="h-display text-3xl md:text-4xl">{session.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="volt">{session.goal}</Badge>
                <Badge>{session.level}</Badge>
                <Badge>{session.players} jugadores</Badge>
                <Badge>{session.blocks.length} bloques</Badge>
              </div>
            </div>
            <div className="no-print flex flex-wrap gap-2">
              <Button onClick={() => save(false)}>
                <Save size={17} /> Guardar
              </Button>
              <Button variant="secondary" onClick={() => save(true)}>
                Editar
              </Button>
              <Button variant="secondary" onClick={() => { const n = seed + 1; setSeed(n); generate(n); }}>
                <RefreshCw size={17} /> Otra versión
              </Button>
              <Button variant="ghost" onClick={() => window.print()}>
                <Printer size={17} /> Imprimir
              </Button>
            </div>
          </div>
          <div className="print-sheet space-y-4">
            <Card className="p-4">
              <Timeline blocks={session.blocks} />
              {DURATION_NOTES[session.duration] && <p className="mt-3 text-sm text-mist print-muted">{DURATION_NOTES[session.duration]}</p>}
            </Card>
            {session.blocks.map((b, i) => (
              <BlockCard key={b.id} block={b} index={i} startMinute={blockStarts(session.blocks)[i]} />
            ))}
          </div>
        </section>
      )}

      <section className="no-print mt-12" aria-labelledby="guardados">
        <h2 id="guardados" className="h-display mb-4 text-2xl">Entrenamientos guardados ({items.length})</h2>
        {items.length === 0 ? (
          <p className="card p-6 text-center text-mist">Aún no guardas entrenamientos. Genera uno arriba y presiona “Guardar”.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <div key={t.id} className="card card-hover flex flex-col p-4">
                <Link href={`/app/entrenamientos/ver/?id=${t.id}`} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-volt/10 text-volt">
                    <Timer size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold hover:text-volt">{t.title}</span>
                    <span className="flex items-center gap-1 text-xs text-mist">
                      <CalendarDays size={12} /> {t.date ? new Date(t.date + "T12:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "Sin fecha"} · {t.duration} min · {t.level}
                    </span>
                  </span>
                </Link>
                <div className="mt-3 flex gap-1 border-t border-line pt-2">
                  <LinkButton size="sm" variant="ghost" href={`/app/entrenamientos/ver/?id=${t.id}`}>
                    Abrir
                  </LinkButton>
                  <IconButton
                    label="Duplicar"
                    onClick={() => {
                      const copy = { ...t, id: uid("ent"), title: `${t.title} (copia)`, createdAt: Date.now(), updatedAt: Date.now(), blocks: t.blocks.map((b) => ({ ...b, id: uid("blk") })) };
                      upsert(copy);
                      toast("Entrenamiento duplicado");
                    }}
                  >
                    <Copy size={16} />
                  </IconButton>
                  <IconButton
                    label="Borrar"
                    className="ml-auto hover:text-coral"
                    onClick={() => {
                      if (window.confirm(`¿Borrar “${t.title}”?`)) remove(t.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
