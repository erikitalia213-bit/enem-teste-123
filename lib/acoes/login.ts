"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { COOKIE_SESSAO_E2E, emailsAprovadosE2E, modoTesteE2E } from "@/lib/dados/modo";
import { supabaseConfigurado } from "@/lib/supabase/env";

export type EstadoLogin =
  | { status: "ocioso" }
  | { status: "enviado"; email: string }
  | { status: "sem-compra"; email: string }
  | { status: "aguarde"; email: string }
  | { status: "erro"; mensagem: string; email?: string };

const emailSchema = z.email("Digite um e-mail válido.");

/** Envia o link mágico somente para e-mails com compra aprovada. */
export async function solicitarLinkDeAcesso(_anterior: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const bruto = String(formData.get("email") ?? "").trim().toLowerCase();
  const validado = emailSchema.safeParse(bruto);
  if (!validado.success) return { status: "erro", mensagem: "Digite um e-mail válido.", email: bruto };
  const email = validado.data;

  if (modoTesteE2E) {
    if (!emailsAprovadosE2E().includes(email)) return { status: "sem-compra", email };
    (await cookies()).set(COOKIE_SESSAO_E2E, email, { httpOnly: true, sameSite: "lax", path: "/" });
    redirect("/hoje");
  }

  if (!supabaseConfigurado || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { status: "erro", mensagem: "O app ainda não foi configurado (Supabase). Fale com o suporte.", email };
  }

  const { criarClienteAdmin } = await import("@/lib/supabase/admin");
  const { enviarAcesso } = await import("@/lib/auth/enviarAcesso");

  const { data: temAcesso, error } = await criarClienteAdmin().rpc("email_tem_acesso", { p_email: email });
  if (error) {
    console.error("[login] erro ao verificar compra", error);
    return { status: "erro", mensagem: "Não conseguimos verificar sua compra agora. Tente de novo em instantes.", email };
  }
  if (!temAcesso) return { status: "sem-compra", email };

  try {
    await enviarAcesso(email, null);
    return { status: "enviado", email };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/rate|seconds|segundos|too many|security purposes/i.test(msg)) return { status: "aguarde", email };
    console.error("[login] erro ao enviar link", msg);
    return { status: "erro", mensagem: "Não foi possível enviar o e-mail agora. Tente de novo em 1 minuto.", email };
  }
}
