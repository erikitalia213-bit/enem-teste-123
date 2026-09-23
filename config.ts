/**
 * ============================================================
 *  FLAGLAB 5x5 — CONFIGURACIÓN CENTRAL (pública)
 * ============================================================
 *  Precios, textos comerciales, links de checkout y analytics.
 *  Todo lo que está aquí puede llegar al navegador: NUNCA pongas
 *  llaves secretas en este archivo. Los secretos van en variables
 *  de entorno SIN el prefijo NEXT_PUBLIC_ (ver .env.example).
 * ============================================================
 */

import type { ProductId } from "@/lib/entitlements";

const env = (value: string | undefined, fallback = "") => (value && value.trim() ? value.trim() : fallback);

/* ---------------- Marca y contacto ---------------- */
export const BRAND = {
  name: "FLAGLAB 5x5",
  shortName: "FLAGLAB",
  tagline: "Crea jugadas, organiza tu playbook y prepara entrenamientos de tocho bandera 5x5.",
  supportEmail: env(process.env.NEXT_PUBLIC_SUPPORT_EMAIL, ""),
  siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
};

/** Datos legales para el Aviso de Privacidad y los Términos. Complétalos antes de lanzar. */
export const LEGAL = {
  /** Nombre o razón social del responsable (persona física o moral). */
  owner: env(process.env.NEXT_PUBLIC_LEGAL_OWNER, ""),
  /** Domicilio para oír y recibir notificaciones. */
  address: env(process.env.NEXT_PUBLIC_LEGAL_ADDRESS, ""),
  /** Correo para solicitudes de privacidad (derechos ARCO). */
  privacyEmail: env(process.env.NEXT_PUBLIC_PRIVACY_EMAIL, env(process.env.NEXT_PUBLIC_SUPPORT_EMAIL, "")),
  lastUpdated: "23 de septiembre de 2026",
};

/* ---------------- Moneda y precios ---------------- */
export const CURRENCY = "MXN";

/** Formatea un precio como "MX$199". */
export const formatPrice = (amount: number) => `MX$${amount.toLocaleString("es-MX")}`;

export const PRICING = {
  /** Precio de referencia (tachado) */
  regular: 599,
  /** Precio de venta actual */
  offer: 199,
};

/* ---------------- Checkout (plataforma externa) ----------------
 * El pago ocurre en Hotmart, Kiwify u otra plataforma. Aquí solo va el link.
 * NEXT_PUBLIC_CHECKOUT_PROVIDER: "hotmart" | "kiwify" | "generic"
 * Mientras no haya link, los botones llevan a la sección de precio.
 */
export type CheckoutProvider = "hotmart" | "kiwify" | "generic";
export const CHECKOUT_PROVIDER = env(process.env.NEXT_PUBLIC_CHECKOUT_PROVIDER, "generic") as CheckoutProvider;
export const CHECKOUT_URL = env(process.env.NEXT_PUBLIC_CHECKOUT_URL, "");

/** Parámetros de atribución que se guardan en la visita y se reenvían al checkout. */
export const ATTRIBUTION_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"] as const;

/* ---------------- Complementos (order bumps) ----------------
 * El id coincide con el entitlement que otorga el webhook.
 * checkoutUrl solo es necesario si vendes el complemento por separado.
 */
export type OrderBumpId = Exclude<ProductId, "core_flaglab">;

export const ORDER_BUMPS: Record<OrderBumpId, { name: string; price: number; slug: string; checkoutUrl: string }> = {
  defensive_playbook: { name: "Playbook Defensivo 5x5", price: 79, slug: "playbook-defensivo", checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_URL_DEFENSIVE, "") },
  extra_trainings: { name: "Pack 50 Entrenamientos Extra", price: 99, slug: "pack-50-entrenamientos", checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_URL_EXTRA_TRAININGS, "") },
  school_coach_kit: { name: "Kit Coach Escolar", price: 79, slug: "kit-coach-escolar", checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_URL_SCHOOL_KIT, "") },
};

/* ---------------- Analytics (IDs públicos) ----------------
 * Vacío = no se carga ningún script de tracking.
 * El evento Purchase se envía desde el servidor (webhook), nunca desde el navegador.
 */
export const META_PIXEL_ID = env(process.env.NEXT_PUBLIC_META_PIXEL_ID, "");
export const GA_ID = env(process.env.NEXT_PUBLIC_GA_ID, "");

/* ---------------- Garantía ----------------
 * Texto neutro. Ajusta según las políticas reales de tu plataforma de pago.
 */
export const GUARANTEE = {
  title: "Compra con confianza",
  text: "Consulta las condiciones de compra y garantía disponibles al finalizar tu pedido.",
};
