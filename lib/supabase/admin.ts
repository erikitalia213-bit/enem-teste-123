import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Cliente con la service role key. SOLO para webhooks del servidor.
 * La llave vive en SUPABASE_SERVICE_ROLE_KEY (sin NEXT_PUBLIC_), nunca llega al navegador.
 */
export function getAdminSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
