import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getServerSupabase } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

/**
 * Destino de los enlaces de Supabase (confirmación de correo, enlace mágico,
 * recuperación de contraseña). Intercambia el código por una sesión (cookies).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const rawNext = url.searchParams.get("next") ?? "/app/";
  // Evita redirecciones abiertas: solo rutas internas.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app/";
  if (!supabaseConfigured) return NextResponse.redirect(new URL("/entrar/", url.origin));

  const supabase = await getServerSupabase();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  return NextResponse.redirect(new URL(ok ? next : "/entrar/?error=link", url.origin));
}
