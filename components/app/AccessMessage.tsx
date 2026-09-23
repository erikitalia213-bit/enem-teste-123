import Link from "next/link";
import { Lock, Settings } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SignOutButton } from "@/components/app/SignOutButton";
import { BRAND } from "@/config";

/** Pantallas del servidor cuando el usuario no puede entrar a la app. */
export function AccessMessage({ kind, email }: { kind: "not_configured" | "no_product"; email?: string }) {
  return (
    <main id="contenido" className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="card w-full max-w-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-volt/10 text-volt">{kind === "not_configured" ? <Settings size={26} /> : <Lock size={26} />}</span>
        {kind === "not_configured" ? (
          <>
            <h1 className="h-display mt-4 text-4xl">Configuración pendiente</h1>
            <p className="mt-2 text-mist-2">La app todavía no tiene conectado el sistema de cuentas. Si eres el administrador, configura las variables de Supabase (ver docs/DEPLOY.md).</p>
          </>
        ) : (
          <>
            <h1 className="h-display mt-4 text-4xl">Tu cuenta aún no tiene FLAGLAB</h1>
            <p className="mt-2 text-mist-2">
              Entraste como <b className="text-snow">{email}</b>. Si ya compraste, verifica que sea el mismo correo que usaste en el pago. La activación puede tardar unos minutos después de que se aprueba tu pago.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href="/#precio" className="inline-flex h-11 items-center rounded-xl bg-volt px-5 font-semibold text-ink">
                Obtener acceso
              </Link>
              <SignOutButton />
            </div>
            {BRAND.supportEmail && (
              <p className="mt-5 text-sm text-mist">
                ¿Ya pagaste y no puedes entrar? Escríbenos a{" "}
                <a className="text-volt underline" href={`mailto:${BRAND.supportEmail}`}>
                  {BRAND.supportEmail}
                </a>
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
