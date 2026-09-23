import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { GA_ID, META_PIXEL_ID } from "@/config";
import type { NormalizedEvent } from "./webhooks";

/* ============================================================
 *  Conversión "Purchase" del lado del servidor.
 *  Se envía SOLO cuando el webhook confirma un pago nuevo (nunca por abrir una página).
 *  - Meta Conversions API: NEXT_PUBLIC_META_PIXEL_ID + META_CAPI_ACCESS_TOKEN
 *  - GA4 Measurement Protocol: NEXT_PUBLIC_GA_ID + GA_API_SECRET
 *  Si faltan las llaves, no hace nada.
 * ============================================================ */

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export function buildMetaPurchase(ev: NormalizedEvent, now = Date.now()) {
  const user_data: Record<string, unknown> = {};
  if (ev.email) user_data.em = [sha256(ev.email)];
  if (ev.buyerName) user_data.fn = [sha256(ev.buyerName.split(" ")[0])];
  const fbclid = ev.tracking.fbclid;
  if (fbclid) user_data.fbc = `fb.1.${now}.${fbclid}`;
  return {
    event_name: "Purchase",
    event_time: Math.floor(now / 1000),
    // Mismo id para reintentos del webhook → Meta deduplica.
    event_id: `${ev.provider}:${ev.orderId}`,
    action_source: "website",
    user_data,
    custom_data: {
      currency: ev.currency ?? "MXN",
      value: ev.value ?? 0,
      content_ids: ev.products,
      content_type: "product",
      order_id: ev.orderId,
    },
  };
}

export async function sendPurchaseConversions(ev: NormalizedEvent): Promise<string[]> {
  const sent: string[] = [];
  const metaToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (META_PIXEL_ID && metaToken) {
    const body: Record<string, unknown> = { data: [buildMetaPurchase(ev)] };
    const test = process.env.META_TEST_EVENT_CODE?.trim();
    if (test) body.test_event_code = test;
    try {
      const r = await fetch(`https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(metaToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      sent.push(`meta:${r.status}`);
    } catch {
      sent.push("meta:error");
    }
  }
  const gaSecret = process.env.GA_API_SECRET?.trim();
  if (GA_ID && gaSecret) {
    try {
      const r = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(GA_ID)}&api_secret=${encodeURIComponent(gaSecret)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: ev.tracking.ga_client_id || `${sha256(ev.email || randomUUID()).slice(0, 10)}.${Math.floor(Date.now() / 1000)}`,
          events: [
            {
              name: "purchase",
              params: { transaction_id: `${ev.provider}:${ev.orderId}`, value: ev.value ?? 0, currency: ev.currency ?? "MXN", items: ev.products.map((p) => ({ item_id: p })) },
            },
          ],
        }),
      });
      sent.push(`ga4:${r.status}`);
    } catch {
      sent.push("ga4:error");
    }
  }
  return sent;
}
