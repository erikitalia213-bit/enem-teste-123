import Link from "next/link";
import {
  BookOpen,
  Check,
  CheckSquare,
  ClipboardList,
  Crosshair,
  Dumbbell,
  FileX2,
  GraduationCap,
  Hand,
  HelpCircle,
  Library,
  PenTool,
  School,
  ShieldCheck,
  ShieldHalf,
  Smartphone,
  Timer,
  Trophy,
  Users,
  Watch,
  CalendarDays,
  X,
  FolderX,
  AlarmClock,
} from "lucide-react";
import { TrackOnView } from "@/components/AnalyticsTracker";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { Demo, type DemoData } from "@/components/landing/Demo";
import { StickyCta } from "@/components/landing/StickyCta";
import { CheckoutButton } from "@/components/landing/CheckoutButton";
import { DiagramSvg } from "@/components/diagram/PlayDiagram";
import { COPY } from "@/data/copy";
import { PLAY_CATEGORIES, PLAY_MAP } from "@/data/plays";
import { CLASSES } from "@/data/classes";
import { BONUSES } from "@/data/bonuses";
import { GUARANTEE, ORDER_BUMPS, PRICING, formatPrice } from "@/config";
import { formationName } from "@/lib/field";
import { DRILLS } from "@/data/drills";
import { generateTraining } from "@/lib/generator";
import type { TrainingGoal } from "@/lib/types";

const DEMO_GOALS: TrainingGoal[] = ["Flag pulling", "Pase", "Recepción", "Rutas", "Agilidad", "Defensa"];
const WRIST_IDS = ["pc-01", "cs-10", "pp-01", "rz-02", "sc-01", "mo-10", "cz-01", "pp-03", "rz-01"];

/** Datos de la demo calculados en el servidor: la página pública solo envía esta muestra. */
function demoData(): DemoData {
  const sessions: DemoData["sessions"] = {};
  for (const goal of DEMO_GOALS) {
    const t = generateTraining({ age: "9-11", level: "Principiante", duration: 60, players: 10, goal, seed: 42 }, DRILLS);
    sessions[goal] = t.blocks.map((b) => ({ id: b.id, phase: b.phase, title: b.title, objective: b.objective, minutes: b.minutes }));
  }
  const wristband = WRIST_IDS.filter((id) => PLAY_MAP[id]).map((id) => ({ id, name: PLAY_MAP[id].name, diagram: PLAY_MAP[id].diagram }));
  return { sessions, wristband };
}

const PROBLEM_ICONS = [FileX2, AlarmClock, FolderX];
const FEATURE_ICONS = [PenTool, Library, Timer, Dumbbell, BookOpen, Watch, GraduationCap, Users];
const BONUS_ICONS = [ClipboardList, CheckSquare, CalendarDays, Trophy, Crosshair, Hand];
const SHOWCASE = ["pc-04", "pp-03", "rz-01", "cs-03", "sc-01", "mo-02"];

function SectionTitle({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto mb-12 max-w-3xl text-center" : "mb-10 max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-mist-2">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage() {
  const savings = Math.round((1 - PRICING.offer / PRICING.regular) * 100);
  return (
    <>
      <TrackOnView event="ViewContent" params={{ content_ids: ["core_flaglab"], content_type: "product", content_name: "FLAGLAB 5x5", value: PRICING.offer, currency: "MXN" }} />
      <SiteHeader />
      <main id="contenido">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden="true" />
          <div className="absolute left-1/2 top-0 -z-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-pitch/60 blur-[120px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-12 md:px-6 md:pt-20 lg:grid-cols-[1fr_1.05fr] lg:pb-32">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-volt">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" /> {COPY.hero.eyebrow}
              </p>
              <h1 className="h-display text-[2.9rem] leading-[0.92] sm:text-7xl xl:text-[5.2rem]">
                {COPY.hero.titleLines.map((l, i) => (
                  <span key={l} className={i === COPY.hero.titleLines.length - 1 ? "block text-volt" : "block"}>
                    {l}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-mist-2 sm:text-xl">{COPY.hero.subtitle}</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <CheckoutButton size="xl" location="hero">
                  {COPY.hero.cta}
                </CheckoutButton>
                <div className="leading-tight">
                  <p className="text-sm text-mist line-through">{formatPrice(PRICING.regular)}</p>
                  <p className="font-display text-3xl font-extrabold">
                    {formatPrice(PRICING.offer)} <span className="text-base font-bold text-volt">{COPY.hero.priceTag}</span>
                  </p>
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist-2">
                {COPY.hero.microcopy.map((m) => (
                  <li key={m} className="inline-flex items-center gap-1.5">
                    <Check size={16} className="text-volt" /> {m}
                  </li>
                ))}
              </ul>
            </div>
            <HeroMockup />
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section aria-label="Contenido incluido" className="border-y border-line bg-ink-2">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-line px-4 md:grid-cols-4 md:divide-x md:px-6">
            {COPY.stats.map((s) => (
              <div key={s.label} className="px-4 py-7 text-center">
                <p className="font-display text-5xl font-extrabold text-volt">{s.value}</p>
                <p className="text-sm font-semibold uppercase tracking-wider text-mist-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= DEMO ================= */}
        <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-16 md:px-6">
          <SectionTitle eyebrow="Demo en vivo" title={COPY.demo.title} subtitle={COPY.demo.subtitle} />
          <Demo data={demoData()} />
        </section>

        {/* ================= PROBLEMA ================= */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <SectionTitle title={COPY.problem.title} />
          <div className="grid gap-4 sm:grid-cols-3">
            {COPY.problem.items.map((it, i) => {
              const Icon = PROBLEM_ICONS[i];
              return (
                <div key={it.title} className="card relative p-5">
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-coral/15 text-coral">
                    <X size={14} />
                  </span>
                  <Icon size={26} className="text-mist" />
                  <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight">{it.title}</h3>
                  <p className="mt-2 text-sm text-mist">{it.text}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-10 text-center font-display text-3xl font-bold uppercase text-mist-2 md:text-4xl">
            {COPY.problem.closing.split(".")[0]}. <span className="text-snow">{COPY.problem.closing.split(".")[1]}.</span>
          </p>
        </section>

        {/* ================= TRANSFORMACIÓN ================= */}
        <section className="relative border-y border-line bg-gradient-to-b from-pitch/30 to-ink py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionTitle eyebrow="El sistema" title={COPY.transformation.title} subtitle={COPY.transformation.subtitle} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COPY.transformation.features.map((f, i) => {
                const Icon = FEATURE_ICONS[i];
                return (
                  <div key={f.title} className="card card-hover p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt text-ink">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-bold uppercase leading-tight">{f.title}</h3>
                    <p className="mt-2 text-sm text-mist-2">{f.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CÓMO FUNCIONA ================= */}
        <section id="como-funciona" className="scroll-mt-20 border-y border-line bg-ink-2 py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionTitle eyebrow="4 pasos" title={COPY.steps.title} />
            <ol className="grid gap-4 md:grid-cols-4">
              {COPY.steps.items.map((s, i) => (
                <li key={s.title} className="relative">
                  <div className="card h-full p-6">
                    <span className="font-display text-6xl font-extrabold leading-none text-volt/90">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight">{s.title}</h3>
                    <p className="mt-2 text-sm text-mist-2">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= BIBLIOTECA ================= */}
        <section id="biblioteca" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 md:px-6">
          <SectionTitle eyebrow="Biblioteca" title={COPY.library.title} subtitle={COPY.library.subtitle} />
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {PLAY_CATEGORIES.map((c) => (
              <span key={c} className="rounded-full border border-line-2 px-3 py-1.5 text-sm font-semibold text-mist-2">
                {c}
              </span>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((id) => {
              const p = PLAY_MAP[id];
              return (
                <article key={id} className="card overflow-hidden">
                  <DiagramSvg diagram={p.diagram} title={p.name} showNotes={false} />
                  <div className="border-t border-line p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-volt">{p.category}</p>
                    <h3 className="font-display text-2xl font-bold uppercase">{p.name}</h3>
                    <p className="text-sm text-mist">
                      {formationName(p.formation)} · {p.level}
                    </p>
                    <p className="mt-2 text-sm text-mist-2">
                      <b className="text-snow">Lectura principal:</b> {p.primaryRead}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-mist">Jugadas originales creadas para FLAGLAB. Cada una con objetivo, descripción, lecturas y consejo para el coach.</p>
        </section>

        {/* ================= PROFESORES ================= */}
        <section id="profesores" className="scroll-mt-20 border-y border-line bg-gradient-to-br from-ink-2 via-ink to-pitch/40 py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">{COPY.teachers.eyebrow}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">{COPY.teachers.title}</h2>
              <p className="mt-4 text-lg text-mist-2">{COPY.teachers.subtitle}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {COPY.teachers.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-mist-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-volt/15 text-volt">
                      <Check size={14} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-mist">
                <School size={18} className="text-volt" /> Secuencia de 20 clases
              </div>
              <ol className="grid gap-1.5 sm:grid-cols-2">
                {CLASSES.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-lg border border-line bg-ink-2 px-3 py-2">
                    <span className="w-7 font-display text-lg font-bold text-volt">{String(c.number).padStart(2, "0")}</span>
                    <span className="truncate text-sm font-semibold">{c.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ================= BONUS ================= */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <SectionTitle eyebrow="Incluido" title={COPY.bonuses.title} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BONUSES.map((b, i) => {
              const Icon = BONUS_ICONS[i];
              return (
                <div key={b.id} className="card relative overflow-hidden p-6">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber/10 blur-2xl" aria-hidden="true" />
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber">
                      <Icon size={21} />
                    </span>
                    <span className="rounded-md border border-amber/30 bg-amber/10 px-2 py-0.5 text-xs font-bold uppercase text-amber">Bonus {b.number}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-mist-2">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PRECIO ================= */}
        <section id="precio" className="scroll-mt-20 border-y border-line bg-ink-2 py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <SectionTitle eyebrow="Precio" title={COPY.pricing.title} subtitle={COPY.pricing.subtitle} />
            <div className="relative overflow-hidden rounded-3xl border-2 border-volt/60 bg-gradient-to-b from-pitch/60 to-ink p-6 shadow-[var(--shadow-glow)] sm:p-10">
              <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
                <ul className="space-y-3">
                  {COPY.pricing.includes.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt text-ink">
                        <Check size={15} strokeWidth={3} />
                      </span>
                      <span className="text-snow/90">{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center md:border-l md:border-line md:pl-10">
                  <p className="text-mist">
                    {COPY.pricing.beforeLabel} <span className="line-through">{formatPrice(PRICING.regular)}</span>
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase tracking-widest text-volt">{COPY.pricing.nowLabel}</p>
                  <p className="font-display text-7xl font-extrabold leading-none sm:text-8xl">{formatPrice(PRICING.offer)}</p>
                  <p className="mt-2 text-sm text-mist-2">
                    {COPY.pricing.note} · Ahorras {savings}%
                  </p>
                  <CheckoutButton size="lg" className="mt-6 w-full" location="pricing">
                    {COPY.pricing.cta}
                  </CheckoutButton>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-mist">
                    <Smartphone size={13} /> Acceso inmediato desde cualquier dispositivo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-center text-sm font-semibold text-mist-2">{COPY.pricing.bumpsTitle}</p>
              <div className="grid gap-3 md:grid-cols-3">
                {Object.values(ORDER_BUMPS).map((b, i) => {
                  const Icon = [ShieldHalf, Dumbbell, School][i];
                  return (
                    <Link key={b.slug} href={`/extras/${b.slug}/`} className="card card-hover flex items-center gap-3 p-4">
                      <Icon size={22} className="shrink-0 text-volt" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{b.name}</span>
                        <span className="text-sm text-mist">+{formatPrice(b.price)}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Garantía (texto neutro y configurable) */}
            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-4 rounded-2xl border border-line bg-ink p-5">
              <ShieldCheck size={30} className="shrink-0 text-volt" />
              <div>
                <h3 className="font-display text-xl font-bold uppercase">{GUARANTEE.title}</h3>
                <p className="mt-1 text-sm text-mist-2">{GUARANTEE.text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-24 md:px-6">
          <SectionTitle eyebrow="Preguntas frecuentes" title="¿Tienes dudas?" />
          <div className="space-y-2.5">
            {COPY.faq.map((f) => (
              <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold">
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="shrink-0 text-volt" /> {f.q}
                  </span>
                  <span className="text-2xl leading-none text-mist transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 pl-[3.25rem] text-mist-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="relative overflow-hidden border-t border-line">
          <div className="absolute inset-0 field-bg opacity-70" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:px-6">
            <h2 className="h-display text-5xl sm:text-6xl md:text-7xl">{COPY.finalCta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-mist-2">{COPY.finalCta.subtitle}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <CheckoutButton size="xl" location="final">
                {COPY.hero.cta}
              </CheckoutButton>
              <p className="text-sm text-mist">
                <span className="line-through">{formatPrice(PRICING.regular)}</span> <b className="text-snow">{formatPrice(PRICING.offer)}</b> · {COPY.pricing.note}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
