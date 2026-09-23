/* ============================================================
 *  Analytics opcional (Meta Pixel + Google Analytics)
 *  Solo se activa si hay IDs en config.ts / .env.local
 * ============================================================ */

import { GA_ID, META_PIXEL_ID } from "@/config";

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    gtag?: Gtag;
  }
}

export const analyticsEnabled = Boolean(META_PIXEL_ID || GA_ID);

/** Registra un evento en las plataformas configuradas. */
export function track(event: "PageView" | "ViewContent" | "InitiateCheckout" | "Lead" | "AddToCart", params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (META_PIXEL_ID && window.fbq) window.fbq("track", event, params);
    if (GA_ID && window.gtag) {
      const map: Record<string, string> = { InitiateCheckout: "begin_checkout", ViewContent: "view_item", Lead: "generate_lead", AddToCart: "add_to_cart", PageView: "page_view" };
      window.gtag("event", map[event] ?? event, params);
    }
  } catch {
    /* nunca rompe la página */
  }
}
