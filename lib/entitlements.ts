/* ============================================================
 *  Entitlements (productos que un usuario puede tener)
 *  El webhook de la plataforma de pago los otorga; la app los lee
 *  desde Supabase (tabla public.entitlements, protegida con RLS).
 * ============================================================ */

export const PRODUCTS = ["core_flaglab", "defensive_playbook", "extra_trainings", "school_coach_kit"] as const;
export type ProductId = (typeof PRODUCTS)[number];

export const PRODUCT_NAMES: Record<ProductId, string> = {
  core_flaglab: "FLAGLAB 5x5",
  defensive_playbook: "Playbook Defensivo 5x5",
  extra_trainings: "Pack 50 Entrenamientos Extra",
  school_coach_kit: "Kit Coach Escolar",
};

export const isProductId = (v: unknown): v is ProductId => typeof v === "string" && (PRODUCTS as readonly string[]).includes(v);

/**
 * Convierte un mapa "idExterno:producto,idExterno2:producto2" (variable de entorno)
 * en un objeto. Ignora entradas mal formadas o productos desconocidos.
 */
export function parseProductMap(raw: string | undefined): Record<string, ProductId> {
  const out: Record<string, ProductId> = {};
  for (const part of (raw ?? "").split(",")) {
    const idx = part.lastIndexOf(":");
    if (idx <= 0) continue;
    const ext = part.slice(0, idx).trim();
    const prod = part.slice(idx + 1).trim();
    if (ext && isProductId(prod)) out[ext] = prod;
  }
  return out;
}
