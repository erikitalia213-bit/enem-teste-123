/* ============================================================
 *  Checkout desacoplado + atribución de campañas
 *  - Guarda utm_*, fbclid, gclid, src y sck de la visita (30 días)
 *    para no perderlos si el usuario navega antes de comprar.
 *  - Construye el link de pago reenviando esos parámetros.
 *  - Hotmart: además llena `src`/`sck` (sus campos de tracking) si faltan.
 * ============================================================ */

import { ATTRIBUTION_PARAMS, CHECKOUT_PROVIDER, CHECKOUT_URL, ORDER_BUMPS, type CheckoutProvider, type OrderBumpId } from "@/config";

const STORAGE_KEY = "flaglab:attribution";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>>;

/** Extrae los parámetros de atribución de una query string. */
export function pickAttribution(search: string): Attribution {
  const q = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of ATTRIBUTION_PARAMS) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 200);
  }
  return out;
}

/** Guarda la atribución de la visita actual (último toque con parámetros gana). */
export function captureAttribution(search: string = typeof window !== "undefined" ? window.location.search : "") {
  const found = pickAttribution(search);
  if (!Object.keys(found).length) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now(), data: found }));
  } catch {
    /* navegación privada: se usa solo la URL actual */
  }
}

export function storedAttribution(): Attribution {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { at: number; data: Attribution };
    if (Date.now() - parsed.at > TTL_MS) return {};
    return parsed.data ?? {};
  } catch {
    return {};
  }
}

/**
 * Función pura (testeable): agrega la atribución a un link de checkout.
 * Nunca sobrescribe parámetros que el link ya trae.
 */
export function buildCheckoutUrl(base: string, attribution: Attribution, provider: CheckoutProvider = "generic"): string {
  if (!base) return "/#precio";
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return base;
  }
  for (const [k, v] of Object.entries(attribution)) if (v && !url.searchParams.has(k)) url.searchParams.set(k, v);
  if (provider === "hotmart") {
    // Hotmart reporta ventas por `src` y `sck`. Si no vienen, se derivan de las UTM.
    if (!url.searchParams.has("src") && attribution.utm_source) url.searchParams.set("src", attribution.utm_source);
    if (!url.searchParams.has("sck")) {
      const sck = [attribution.utm_source, attribution.utm_medium, attribution.utm_campaign, attribution.utm_content].filter(Boolean).join("|");
      if (sck) url.searchParams.set("sck", sck.slice(0, 200));
    }
  }
  return url.toString();
}

/** Link de checkout para el producto principal o un complemento vendido por separado. */
export function checkoutUrl(product?: OrderBumpId): string {
  const base = product ? ORDER_BUMPS[product].checkoutUrl || CHECKOUT_URL : CHECKOUT_URL;
  if (typeof window === "undefined") return base || "/#precio";
  // La URL actual tiene prioridad sobre lo guardado.
  const attribution = { ...storedAttribution(), ...pickAttribution(window.location.search) };
  return buildCheckoutUrl(base, attribution, CHECKOUT_PROVIDER);
}

export const checkoutConfigured = Boolean(CHECKOUT_URL);
