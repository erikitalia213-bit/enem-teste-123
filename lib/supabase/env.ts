/* Variables públicas de Supabase (seguras en el navegador; la seguridad la da RLS). */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim() ?? "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Modo de desarrollo sin Supabase: SOLO funciona con `next dev` (NODE_ENV !== "production")
 * y FLAGLAB_DEV_BYPASS_AUTH=true. En producción se ignora siempre.
 */
export const devBypassAuth = process.env.NODE_ENV !== "production" && process.env.FLAGLAB_DEV_BYPASS_AUTH === "true";
