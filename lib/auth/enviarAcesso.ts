import "server-only";
import { createClient } from "@supabase/supabase-js";
import { urlApp } from "@/lib/config";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Envia o acesso por e-mail usando o Supabase Auth (que dispara pelo SMTP do Resend):
 * - Quem ainda não tem conta recebe o CONVITE (template "Invite user", boas-vindas).
 * - Quem já tem conta recebe o LINK MÁGICO (template "Magic Link").
 * Os templates usam {{ .TokenHash }} e apontam para /auth/confirmar, então o link
 * funciona mesmo se for aberto em outro aparelho ou navegador.
 */
export async function enviarAcesso(email: string, nome: string | null): Promise<"convite" | "link"> {
  const admin = criarClienteAdmin();
  const emailNorm = email.trim().toLowerCase();

  const { data: perfil, error: erroPerfil } = await admin.from("profiles").select("id").eq("email", emailNorm).maybeSingle();
  if (erroPerfil) throw new Error(`Erro ao consultar perfil: ${erroPerfil.message}`);

  if (!perfil) {
    const { error } = await admin.auth.admin.inviteUserByEmail(emailNorm, {
      data: nome ? { nome: primeiroNome(nome) } : {},
      redirectTo: `${urlApp}/onboarding`,
    });
    if (!error) return "convite";
    // Conta já existe no Auth (ex.: perfil apagado manualmente): cai para o link mágico.
    if (!/already|registered|exists/i.test(error.message)) throw new Error(error.message);
  }

  await enviarLinkMagico(emailNorm);
  return "link";
}

export async function enviarLinkMagico(email: string): Promise<void> {
  const anon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: "implicit" },
  });
  const { error } = await anon.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${urlApp}/hoje` },
  });
  if (error) throw new Error(error.message);
}

/** "MARIA da silva" → "Maria" */
export function primeiroNome(nome: string): string {
  const p = nome.trim().split(/\s+/)[0] ?? "";
  return p ? p.charAt(0).toLocaleUpperCase("pt-BR") + p.slice(1).toLocaleLowerCase("pt-BR") : "";
}
