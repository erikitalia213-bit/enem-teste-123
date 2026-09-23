import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo />
      <h1 className="h-display text-6xl">
        Jugada <span className="text-volt">no encontrada</span>
      </h1>
      <p className="max-w-md text-mist-2">La página que buscas no existe o cambió de lugar.</p>
      <div className="flex gap-2">
        <Link href="/" className="rounded-xl bg-volt px-5 py-3 font-semibold text-ink">
          Ir al inicio
        </Link>
        <Link href="/app/" className="rounded-xl border border-line-2 px-5 py-3 font-semibold">
          Abrir la app
        </Link>
      </div>
    </main>
  );
}
