import "server-only";
import { cache } from "react";
import { PRODUCTS, isProductId, type ProductId } from "@/lib/entitlements";
import { devBypassAuth, supabaseConfigured } from "@/lib/supabase/env";
import { getServerSupabase } from "@/lib/supabase/server";

export interface Account {
  id: string;
  email: string;
  coachName: string;
  teamName: string;
}

export type Access =
  | { status: "ok"; account: Account; entitlements: ProductId[]; mode: "supabase" | "dev" }
  | { status: "anonymous" }
  | { status: "not_configured" };

/**
 * Quién es el usuario y qué productos tiene. Se calcula en el servidor en cada
 * request (cacheado por request). Nunca confía en datos del navegador.
 */
export const getAccess = cache(async (): Promise<Access> => {
  if (devBypassAuth) {
    return {
      status: "ok",
      mode: "dev",
      entitlements: [...PRODUCTS],
      account: { id: "dev-local", email: "dev@localhost", coachName: "Coach Demo", teamName: "Equipo de prueba" },
    };
  }
  if (!supabaseConfigured) return { status: "not_configured" };

  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;
  if (error || !user) return { status: "anonymous" };

  // RLS: el usuario solo puede leer sus propias filas activas.
  const { data: rows } = await supabase.from("entitlements").select("product").eq("status", "active");
  const entitlements = Array.from(new Set((rows ?? []).map((r: { product: string }) => r.product).filter(isProductId)));

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    status: "ok",
    mode: "supabase",
    entitlements,
    account: {
      id: user.id,
      email: user.email ?? "",
      coachName: typeof meta.coach_name === "string" && meta.coach_name ? meta.coach_name : (user.email ?? "Coach").split("@")[0],
      teamName: typeof meta.team_name === "string" ? meta.team_name : "",
    },
  };
});

export const hasProduct = (access: Access, p: ProductId) => access.status === "ok" && access.entitlements.includes(p);
