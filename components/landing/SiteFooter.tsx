import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BRAND, ORDER_BUMPS } from "@/config";
import { COPY } from "@/data/copy";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-mist">{BRAND.tagline}</p>
          </div>
          <nav aria-label="Enlaces" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3 sm:gap-x-12">
            <Link href="/entrar/" className="text-mist-2 hover:text-snow">
              Entrar a la app
            </Link>
            <a href="#precio" className="text-mist-2 hover:text-snow">
              Precio
            </a>
            <a href="#faq" className="text-mist-2 hover:text-snow">
              Preguntas frecuentes
            </a>
            {Object.values(ORDER_BUMPS).map((b) => (
              <Link key={b.slug} href={`/extras/${b.slug}/`} className="text-mist-2 hover:text-snow">
                {b.name}
              </Link>
            ))}
            {BRAND.supportEmail && (
              <a href={`mailto:${BRAND.supportEmail}`} className="text-mist-2 hover:text-snow">
                Soporte
              </a>
            )}
          </nav>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-mist">{COPY.footer.disclaimer}</p>
        <p className="mt-2 text-xs text-mist">© {new Date().getFullYear()} FLAGLAB 5x5. Hecho para coaches en México.</p>
      </div>
    </footer>
  );
}
