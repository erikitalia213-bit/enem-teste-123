import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { LEGAL } from "@/config";

/** Dato legal configurable; si falta, se muestra un marcador visible para no publicar datos inventados. */
export function LegalValue({ value, env }: { value: string; env: string }) {
  return value ? <b>{value}</b> : <mark className="rounded bg-amber/20 px-1 text-amber">[pendiente: configura {env}]</mark>;
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p className="eyebrow">Información legal</p>
        <h1 className="h-display mt-2 text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-mist">Última actualización: {LEGAL.lastUpdated}</p>
        <div className="legal mt-8 space-y-4 leading-relaxed text-mist-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-snow [&_li]:ml-5 [&_li]:list-disc [&_b]:text-snow">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
