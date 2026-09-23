/* ============================================================
 *  Webhooks de pago: validación y normalización (funciones puras, testeables).
 *  Hotmart (webhook 2.0) y Kiwify. Las rutas /api/webhooks/* los usan.
 * ============================================================ */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { ProductId } from "@/lib/entitlements";

export type WebhookAction = "grant" | "revoke" | "ignore";

export interface NormalizedEvent {
  provider: "hotmart" | "kiwify";
  /** Identificador único del evento (para no procesarlo dos veces). */
  eventId: string;
  eventType: string;
  action: WebhookAction;
  orderId: string;
  email: string;
  products: ProductId[];
  /** Id del producto en la plataforma que no está en el mapa (para diagnosticar). */
  unmappedProductId?: string;
  value?: number;
  currency?: string;
  buyerName?: string;
  tracking: Record<string, string>;
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

/* ---------------- Hotmart ---------------- */

const HOTMART_GRANT = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const HOTMART_REVOKE = new Set(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_CANCELED", "PURCHASE_PROTEST"]);

/** Hotmart envía el "hottok" configurado en el encabezado X-HOTMART-HOTTOK. */
export function verifyHotmart(headerToken: string | null, body: unknown, secret: string | undefined): boolean {
  if (!secret) return false;
  const token = headerToken ?? str(obj(body).hottok);
  return Boolean(token) && safeEqual(token, secret);
}

export function parseHotmart(body: unknown, productMap: Record<string, ProductId>): NormalizedEvent | null {
  const b = obj(body);
  const data = obj(b.data);
  const purchase = obj(data.purchase);
  const product = obj(data.product);
  const buyer = obj(data.buyer);
  const eventType = str(b.event).toUpperCase();
  const orderId = str(purchase.transaction);
  if (!eventType || !orderId) return null;
  const extId = str(product.id);
  const mapped = productMap[extId];
  const price = obj(purchase.price);
  const origin = obj(purchase.origin);
  const tracking: Record<string, string> = {};
  for (const [k, v] of Object.entries({ src: origin.src, sck: origin.sck, xcod: origin.xcod })) if (str(v)) tracking[k] = str(v);

  let action: WebhookAction = HOTMART_GRANT.has(eventType) ? "grant" : HOTMART_REVOKE.has(eventType) ? "revoke" : "ignore";
  if (!mapped) action = "ignore";
  return {
    provider: "hotmart",
    eventId: str(b.id) || `${orderId}:${eventType}`,
    eventType,
    action,
    orderId,
    email: str(buyer.email).trim().toLowerCase(),
    products: mapped ? [mapped] : [],
    unmappedProductId: mapped ? undefined : extId,
    value: num(price.value),
    currency: str(price.currency_value) || undefined,
    buyerName: str(buyer.name) || undefined,
    tracking,
  };
}

/* ---------------- Kiwify ---------------- */

/** Kiwify firma el cuerpo crudo con HMAC-SHA1 (token del webhook) y lo manda en ?signature= */
export function verifyKiwify(rawBody: string, signature: string | null, secret: string | undefined): boolean {
  if (!secret || !signature) return false;
  const expected = createHmac("sha1", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature.trim().toLowerCase());
}

const KIWIFY_GRANT = new Set(["paid", "approved", "order_approved"]);
const KIWIFY_REVOKE = new Set(["refunded", "chargedback", "order_refunded", "chargeback", "subscription_canceled"]);

export function parseKiwify(body: unknown, productMap: Record<string, ProductId>): NormalizedEvent | null {
  const b = obj(body);
  const orderId = str(b.order_id);
  const status = str(b.order_status).toLowerCase();
  const eventType = str(b.webhook_event_type).toLowerCase() || status;
  if (!orderId || !eventType) return null;
  const product = obj(b.Product);
  const customer = obj(b.Customer);
  const commissions = obj(b.Commissions);
  const extId = str(product.product_id);
  const mapped = productMap[extId];
  const trackingRaw = obj(b.TrackingParameters);
  const tracking: Record<string, string> = {};
  for (const [k, v] of Object.entries(trackingRaw)) if (str(v)) tracking[k] = str(v);

  let action: WebhookAction = KIWIFY_REVOKE.has(eventType) || KIWIFY_REVOKE.has(status) ? "revoke" : KIWIFY_GRANT.has(eventType) || status === "paid" ? "grant" : "ignore";
  if (!mapped) action = "ignore";
  // Kiwify manda valores en centavos (charge_amount).
  const cents = num(commissions.charge_amount) ?? num(commissions.product_base_price);
  return {
    provider: "kiwify",
    eventId: `${orderId}:${eventType}`,
    eventType,
    action,
    orderId,
    email: str(customer.email).trim().toLowerCase(),
    products: mapped ? [mapped] : [],
    unmappedProductId: mapped ? undefined : extId,
    value: cents !== undefined ? cents / 100 : undefined,
    currency: str(commissions.currency) || undefined,
    buyerName: str(customer.full_name) || str(customer.first_name) || undefined,
    tracking,
  };
}
