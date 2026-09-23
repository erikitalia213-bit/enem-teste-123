import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { COPY } from "@/data/copy";
import { CheckoutButton } from "./CheckoutButton";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" aria-label="FLAGLAB 5x5 inicio">
          <Logo compact />
        </Link>
        <nav aria-label="Secciones" className="hidden items-center gap-6 text-sm font-semibold text-mist-2 lg:flex">
          {COPY.nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-snow">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/entrar/" className="rounded-lg px-3 py-2 text-sm font-semibold text-mist-2 hover:text-snow">
            Entrar
          </Link>
          <CheckoutButton size="md" className="hidden h-10 rounded-xl px-4 text-base sm:inline-flex" location="header">
            Obtener acceso
          </CheckoutButton>
        </div>
      </div>
    </header>
  );
}
