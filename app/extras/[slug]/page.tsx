import Link from "next/link";
import { TrackOnView } from "@/components/AnalyticsTracker";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Users } from "lucide-react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CheckoutButton } from "@/components/landing/CheckoutButton";
import { DiagramSvg } from "@/components/diagram/PlayDiagram";
import { ORDER_BUMPS, PRICING, formatPrice, type OrderBumpId } from "@/config";
import { BUMP_PAGES } from "@/data/bumpPages";
import { DEFENSE_SCHEMES } from "@/data/defense";
import { EXTRA_SESSIONS } from "@/data/readySessions";
import { SCHOOL_KIT_CLASSES } from "@/data/schoolKit";

const bySlug = (slug: string) => (Object.keys(ORDER_BUMPS) as OrderBumpId[]).find((k) => ORDER_BUMPS[k].slug === slug);

export function generateStaticParams() {
  return Object.values(ORDER_BUMPS).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = bySlug(slug);
  if (!id) return {};
  return { title: ORDER_BUMPS[id].name, description: BUMP_PAGES[id].intro };
}

export default async function BumpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = bySlug(slug);
  if (!id) notFound();
  const bump = ORDER_BUMPS[id];
  const page = BUMP_PAGES[id];
  return (
    <>
      <TrackOnView event="ViewContent" params={{ content_ids: [id], content_type: "product", content_name: ORDER_BUMPS[id].name, value: ORDER_BUMPS[id].price, currency: "MXN" }} />
      <SiteHeader />
      <main id="contenido" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-mist hover:text-snow">
          <ArrowLeft size={16} /> FLAGLAB 5x5
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="eyebrow">Complemento de FLAGLAB 5x5</p>
            <h1 className="h-display mt-2 text-5xl md:text-6xl">{bump.name}</h1>
            <p className="mt-3 font-display text-2xl font-bold uppercase text-volt">{page.tagline}</p>
            <p className="mt-4 text-lg text-mist-2">{page.intro}</p>
            <h2 className="mt-8 font-display text-2xl font-bold uppercase">Incluye</h2>
            <ul className="mt-3 space-y-2.5">
              {page.includes.map((it) => (
                <li key={it} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt text-ink">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-snow/90">{it}</span>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 flex items-center gap-2 font-display text-2xl font-bold uppercase">
              <Users size={20} className="text-volt" /> Para quién es
            </h2>
            <ul className="mt-3 space-y-1.5 text-mist-2">
              {page.forWho.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="card p-6 text-center">
              <p className="text-sm text-mist">Agrégalo al finalizar tu compra de FLAGLAB 5x5</p>
              <p className="mt-2 font-display text-6xl font-extrabold">{formatPrice(bump.price)}</p>
              <p className="text-sm text-mist-2">Complemento de pago único</p>
              <CheckoutButton size="lg" className="mt-5 w-full" location={`bump-${id}`}>
                Quiero FLAGLAB + este complemento
              </CheckoutButton>
              <p className="mt-3 text-xs text-mist">
                FLAGLAB 5x5: {formatPrice(PRICING.offer)} · {bump.name}: +{formatPrice(bump.price)}
              </p>
              {bump.checkoutUrl && (
                <CheckoutButton size="md" product={id} className="mt-3 w-full bg-transparent text-volt shadow-none ring-1 ring-volt/50 hover:bg-volt/10" location={`bump-solo-${id}`}>
                  Ya tengo FLAGLAB: comprar solo esto
                </CheckoutButton>
              )}
              <Link href={page.appPath} className="mt-4 inline-block text-sm font-semibold text-volt hover:underline">
                ¿Ya lo tienes? Ábrelo en la app →
              </Link>
            </div>
            {id === "defensive_playbook" && (
              <div className="grid grid-cols-2 gap-2">
                {DEFENSE_SCHEMES.slice(0, 4).map((s) => (
                  <div key={s.id} className="card overflow-hidden">
                    <DiagramSvg diagram={s.diagram} compact showNotes={false} title={s.name} />
                    <p className="truncate px-2 py-1.5 text-xs font-semibold">{s.name}</p>
                  </div>
                ))}
              </div>
            )}
            {id === "extra_trainings" && (
              <div className="card p-4">
                <p className="mb-2 text-sm font-semibold text-mist-2">Algunas sesiones del pack</p>
                <ul className="space-y-1 text-sm">
                  {EXTRA_SESSIONS.filter((_, i) => i % 5 === 0).map((s) => (
                    <li key={s.id} className="flex justify-between gap-2 border-b border-line py-1.5 last:border-0">
                      <span className="truncate">{s.title}</span>
                      <span className="shrink-0 text-mist">{s.duration} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {id === "school_coach_kit" && (
              <div className="card p-4">
                <p className="mb-2 text-sm font-semibold text-mist-2">Clases incluidas (21-40)</p>
                <ol className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                  {SCHOOL_KIT_CLASSES.map((c) => (
                    <li key={c.id} className="truncate">
                      <b className="text-volt">{c.number}</b> {c.title}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
