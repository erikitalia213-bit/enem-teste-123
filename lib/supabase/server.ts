import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Cliente do Supabase para Server Components, Server Actions e Route Handlers.
 * Usa a sessão da aluna (cookies) — todas as consultas passam pelo RLS.
 */
export async function criarClienteServidor() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component: o proxy renova os cookies.
        }
      },
    },
  });
}
