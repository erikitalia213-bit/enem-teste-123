"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Cliente do Supabase para componentes do navegador (sessão em cookies). */
export function criarClienteNavegador() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
