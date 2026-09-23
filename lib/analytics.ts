/* ============================================================
 *  Analytics del navegador (Meta Pixel + Google Analytics 4)
 *  Eventos permitidos desde el navegador:
 *    PageView · ViewContent · Lead · InitiateCheckout
 *  Purchase NO existe aquí a propósito: solo se envía desde el
 *  servidor cuando el webhook confirma el pago (lib/server/conversions.ts).
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

export type ClientEvent = "PageView" | "ViewContent" | "Lead" | "InitiateCheckout";

export const analyticsEnabled = Boolean(META_PIXEL_ID || GA_ID);

const GA_NAMES: Record<ClientEvent, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  Lead: "sign_up",
  InitiateCheckout: "begin_checkout",
};

/** Registra un evento en las plataformas configuradas. Nunca lanza errores. */
export function track(event: ClientEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const eventID = `${event}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    if (META_PIXEL_ID && window.fbq) window.fbq("track", event, params, { eventID });
    if (GA_ID && window.gtag && event !== "PageView") window.gtag("event", GA_NAMES[event], params);
    if (GA_ID && window.gtag && event === "PageView") window.gtag("event", "page_view", { page_path: window.location.pathname });
  } catch {
    /* el tracking nunca debe romper la página */
  }
}
