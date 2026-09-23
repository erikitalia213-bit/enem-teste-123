/**
 * ============================================================
 *  FLAGLAB 5x5 — CONFIGURACIÓN CENTRAL
 * ============================================================
 *  Todo lo comercial se cambia aquí: precios, checkout,
 *  analytics, códigos de acceso y datos de la marca.
 *  No necesitas tocar componentes para lanzar.
 * ============================================================
 */

const env = (value: string | undefined, fallback = "") => (value && value.trim() ? value.trim() : fallback);

/* ---------------- Marca ---------------- */
export const BRAND = {
  name: "FLAGLAB 5x5",
  shortName: "FLAGLAB",
  tagline: "Planea entrenamientos, crea jugadas y organiza tu equipo de tocho bandera en minutos.",
  supportEmail: "", // ej. "soporte@tudominio.com" (vacío = no se muestra)
  siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL, "https://flaglab5x5.com"),
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

/* ---------------- Checkout ----------------
 * Pega aquí tu link de Hotmart, Kiwify, Stripe Payment Link, Mercado Pago, etc.
 * También puedes definir NEXT_PUBLIC_CHECKOUT_URL en .env.local.
 * Mientras sea "#", los botones llevan a la sección de precio.
 */
export const CHECKOUT_URL = env(process.env.NEXT_PUBLIC_CHECKOUT_URL, "#");

/** Parámetros UTM que se reenvían al checkout si llegan en la URL de la landing. */
export const FORWARDED_QUERY_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "src", "sck"];

/* ---------------- Order bumps ----------------
 * Productos complementarios. Normalmente se configuran dentro de tu
 * plataforma de pago; aquí solo se usan para mostrarlos en la landing
 * y para desbloquear su contenido dentro de la app.
 */
export type OrderBumpId = "defensa" | "pack50" | "escolar";

export const ORDER_BUMPS: Record<OrderBumpId, { name: string; price: number; slug: string; checkoutUrl: string }> = {
  defensa: { name: "Playbook Defensivo 5x5", price: 79, slug: "playbook-defensivo", checkoutUrl: "#" },
  pack50: { name: "Pack 50 Entrenamientos Extra", price: 99, slug: "pack-50-entrenamientos", checkoutUrl: "#" },
  escolar: { name: "Kit Coach Escolar", price: 79, slug: "kit-coach-escolar", checkoutUrl: "#" },
};

/* ---------------- Acceso a la app ----------------
 * ACCESS_CODE vacío = cualquiera que tenga el link entra a la app.
 * Si pones un código (ej. "COACH2026"), se pedirá al entrar.
 * Es una barrera simple del lado del cliente, NO es seguridad real.
 * Para cuentas reales, conecta Supabase (ver docs/SUPABASE.md).
 */
export const ACCESS_CODE: string = "";

/** Códigos para desbloquear order bumps dentro de la app. Vacío = desbloqueado. */
export const BUMP_UNLOCK_CODES: Record<OrderBumpId, string> = {
  defensa: "",
  pack50: "",
  escolar: "",
};

/* ---------------- Analytics ----------------
 * Vacío = no se carga ningún script de tracking.
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
