/* ============================================================
 *  Checkout centralizado
 *  Todos los botones de compra usan checkoutUrl().
 *  Cambia CHECKOUT_URL en config.ts (Hotmart, Kiwify, etc.)
 * ============================================================ */

import { CHECKOUT_URL, FORWARDED_QUERY_PARAMS, ORDER_BUMPS, type OrderBumpId } from "@/config";

/** Devuelve la URL de checkout con los parámetros UTM de la visita actual. */
export function checkoutUrl(product?: OrderBumpId): string {
  const base = product ? ORDER_BUMPS[product].checkoutUrl : CHECKOUT_URL;
  if (!base || base === "#") return "/#precio";
  if (typeof window === "undefined") return base;
  try {
    const url = new URL(base);
    const current = new URLSearchParams(window.location.search);
    for (const key of FORWARDED_QUERY_PARAMS) {
      const v = current.get(key);
      if (v && !url.searchParams.has(key)) url.searchParams.set(key, v);
    }
    return url.toString();
  } catch {
    return base;
  }
}

export const checkoutConfigured = CHECKOUT_URL !== "#" && CHECKOUT_URL !== "";
