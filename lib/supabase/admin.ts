import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

let cliente: SupabaseClient | null = null;

/**
 * Cliente com a service role (ignora o RLS). Use SOMENTE no servidor:
 * webhooks, verificação de compra no login e scripts.
 */
export function criarClienteAdmin(): SupabaseClient {
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !chave) {
    throw new Error("Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  }
  cliente ??= createClient(supabaseUrl, chave, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cliente;
}
