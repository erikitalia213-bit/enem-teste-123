import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { criarClienteServidor } from "@/lib/supabase/server";
import { supabaseConfigurado } from "@/lib/supabase/env";

const TIPOS: EmailOtpType[] = ["invite", "magiclink", "email", "signup", "recovery", "email_change"];

/** Só aceita caminhos internos (evita redirecionamento aberto). */
function destinoSeguro(valor: string | null, padrao: string): string {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//") || valor.includes("\\")) return padrao;
  return valor;
}

/**
 * Destino dos links dos e-mails (convite e link mágico).
 * Os templates usam {{ .TokenHash }}, então o link funciona em qualquer aparelho.
 * Também aceita ?code= (fluxo PKCE padrão do Supabase).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const tipo = url.searchParams.get("type") as EmailOtpType | null;
  const padrao = tipo === "invite" ? "/onboarding" : "/hoje";
  const proximo = destinoSeguro(url.searchParams.get("next"), padrao);

  if (!supabaseConfigurado) return NextResponse.redirect(new URL("/login?erro=config", url.origin));

  const supabase = await criarClienteServidor();
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");

  let ok = false;
  if (tokenHash && tipo && TIPOS.includes(tipo)) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tipo })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  return NextResponse.redirect(new URL(ok ? proximo : "/login?erro=link", url.origin));
}
