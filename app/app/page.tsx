"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Dumbbell, FolderOpen, Library, PenTool, Shapes, Timer, Users, Watch, BarChart3, Zap, Sparkles } from "lucide-react";
import PlayDiagram from "@/components/diagram/PlayDiagram";
import { Badge, LinkButton, Stat, levelTone } from "@/components/ui";
import { PLAYS } from "@/data/plays";
import { DRILLS } from "@/data/drills";
import { usePlaybooks, usePlays, useProfile, useRoster, useTrainings } from "@/lib/hooks";

const CARDS = [
  { href: "/app/crear/", title: "Crear jugada", desc: "Diseña rutas y formaciones en el campo.", icon: PenTool, accent: true },
  { href: "/app/jugadas/", title: "Mis jugadas", desc: "Tus diseños guardados.", icon: Shapes },
  { href: "/app/playbook/", title: "Mi playbook", desc: "Organiza e imprime tus jugadas.", icon: BookOpen },
  { href: "/app/entrenamientos/", title: "Generar entrenamiento", desc: "Sesiones completas en segundos.", icon: Timer, accent: true },
  { href: "/app/drills/", title: "Biblioteca de drills", desc: `${DRILLS.length} ejercicios con instrucciones.`, icon: Dumbbell },
  { href: "/app/munequeras/", title: "Wristbands", desc: "Tarjetas para muñequera numeradas.", icon: Watch },
  { href: "/app/equipo/", title: "Mi equipo", desc: "Roster y depth chart.", icon: Users },
  { href: "/app/recursos/", title: "Recursos", desc: "Manual, clases, bonus y guías.", icon: FolderOpen },
];

function dayIndex() {
  const d = new Date();
  return (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % PLAYS.length;
}

export default function Dashboard() {
  const { profile } = useProfile();
  const { items: plays } = usePlays();
  const { items: trainings } = useTrainings();
  const { items: playbooks } = usePlaybooks();
  const { items: roster } = useRoster();
  const playOfDay = PLAYS[dayIndex()];
  const firstName = profile?.coachName.split(" ").slice(0, 2).join(" ");

  return (
    <div className="animate-fade-up">
      {/* Saludo */}
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-pitch/70 via-ink-2 to-ink p-6 md:p-8">
        <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">FLAGLAB 5x5 {profile?.teamName ? `· ${profile.teamName}` : ""}</p>
            <h1 className="h-display mt-2 text-4xl sm:text-5xl md:text-6xl">
              Listo, coach{firstName ? <span className="text-volt"> {firstName}</span> : null}.
              <br />
              ¿Qué vamos a preparar hoy?
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/app/entrenamientos/" size="lg">
              <Timer size={18} /> Generar entrenamiento
            </LinkButton>
            <LinkButton href="/app/crear/" size="lg" variant="secondary">
              <PenTool size={18} /> Crear jugada
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Resumen" className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Jugadas guardadas" value={plays.length} icon={<Shapes size={16} />} href="/app/jugadas/" />
        <Stat label="Entrenamientos" value={trainings.length} icon={<Timer size={16} />} href="/app/entrenamientos/" />
        <Stat label="Playbooks" value={playbooks.length} icon={<BookOpen size={16} />} href="/app/playbook/" />
        <Stat label="Jugadores" value={roster.length} icon={<Users size={16} />} href="/app/equipo/" />
      </section>

      {/* Herramientas */}
      <section aria-labelledby="herramientas" className="mb-10">
        <h2 id="herramientas" className="h-display mb-4 text-2xl">Herramientas</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href} className="card card-hover group flex min-h-[150px] flex-col justify-between p-4 md:p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.accent ? "bg-volt text-ink" : "bg-white/5 text-volt"}`}>
                  <Icon size={21} />
                </span>
                <span>
                  <span className="flex items-center gap-1 font-display text-xl font-bold uppercase leading-tight">
                    {c.title}
                    <ArrowRight size={16} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-sm text-mist">{c.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Acceso rápido */}
        <section aria-labelledby="acceso" className="card p-5">
          <h2 id="acceso" className="h-display mb-4 flex items-center gap-2 text-2xl">
            <Zap size={20} className="text-volt" /> Acceso rápido
          </h2>
          <ul className="divide-y divide-line">
            {[
              { href: "/app/biblioteca/", icon: Library, t: "Biblioteca de 130 jugadas", d: "Filtra por categoría, nivel y formación." },
              { href: "/app/bonus/entrenamientos-listos/", icon: Sparkles, t: "50 entrenamientos listos", d: "Elige uno y llévalo al campo hoy." },
              { href: "/app/munequeras/", icon: Watch, t: "Imprimir tarjetas para muñequera", d: "6, 9, 12 o 18 jugadas por tarjeta." },
              { href: "/app/tracker/", icon: BarChart3, t: "Registrar estadísticas", d: "Pases, recepciones, TD, INT y flags." },
              { href: "/app/manual/", icon: BookOpen, t: "Manual práctico", d: "18 capítulos para consultar e imprimir." },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.href}>
                  <Link href={q.href} className="group flex items-center gap-3 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-volt">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold group-hover:text-volt">{q.t}</span>
                      <span className="block truncate text-sm text-mist">{q.d}</span>
                    </span>
                    <ArrowRight size={16} className="text-mist group-hover:text-volt" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Jugada del día */}
        <section aria-labelledby="jugada-dia" className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 id="jugada-dia" className="h-display text-2xl">Jugada del día</h2>
            <Badge tone={levelTone(playOfDay.level)}>{playOfDay.level}</Badge>
          </div>
          <Link href={`/app/biblioteca/${playOfDay.id}/`} className="block p-5">
            <div className="overflow-hidden rounded-xl border border-line">
              <PlayDiagram diagram={playOfDay.diagram} title={playOfDay.name} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold uppercase">{playOfDay.name}</p>
            <p className="text-sm text-mist">
              {playOfDay.category} · {playOfDay.objective}
            </p>
          </Link>
        </section>
      </div>

      {/* Recientes */}
      {(plays.length > 0 || trainings.length > 0) && (
        <section aria-labelledby="recientes" className="mt-10">
          <h2 id="recientes" className="h-display mb-4 text-2xl">Lo último que trabajaste</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plays.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/app/crear/?id=${p.id}`} className="card card-hover flex items-center gap-3 p-3">
                <div className="w-24 shrink-0 overflow-hidden rounded-lg border border-line">
                  <PlayDiagram diagram={p.diagram} compact showNotes={false} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-xs text-mist">Jugada · {p.category}</p>
                </div>
              </Link>
            ))}
            {trainings.slice(0, 3).map((t) => (
              <Link key={t.id} href={`/app/entrenamientos/ver/?id=${t.id}`} className="card card-hover flex items-center gap-3 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-volt/10 text-volt">
                  <Timer size={22} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{t.title}</p>
                  <p className="text-xs text-mist">
                    Entrenamiento · {t.blocks.length} bloques · {t.duration} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
