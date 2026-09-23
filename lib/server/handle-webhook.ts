import "server-only";
import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendPurchaseConversions } from "./conversions";
import type { NormalizedEvent } from "./webhooks";

/**
 * Aplica un evento normalizado: otorga o revoca accesos y lo registra.
 * Es idempotente: si la plataforma reintenta el mismo evento, no se duplica nada
 * y la conversión Purchase no se envía dos veces.
 */
export async function applyWebhookEvent(ev: NormalizedEvent, payload: unknown) {
  const admin = getAdminSupabase();
  if (!admin) return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });

  if (ev.action === "grant") {
    if (!ev.email) return NextResponse.json({ ok: false, error: "missing_email" }, { status: 422 });
    for (const product of ev.products) {
      const { error } = await admin.rpc("grant_entitlement", { p_email: ev.email, p_product: product, p_source: ev.provider, p_order: ev.orderId });
      if (error) return NextResponse.json({ ok: false, error: "grant_failed" }, { status: 500 });
    }
  } else if (ev.action === "revoke") {
    for (const product of ev.products) {
      const { error } = await admin.rpc("revoke_entitlement", { p_source: ev.provider, p_order: ev.orderId, p_product: product });
      if (error) return NextResponse.json({ ok: false, error: "revoke_failed" }, { status: 500 });
    }
  }

  const { data: inserted } = await admin
    .from("webhook_events")
    .upsert(
      { provider: ev.provider, event_id: ev.eventId, event_type: ev.eventType, email: ev.email || null, products: ev.products, action: ev.action, payload },
      { onConflict: "provider,event_id", ignoreDuplicates: true },
    )
    .select("id");
  const firstTime = Boolean(inserted && inserted.length);

  let conversions: string[] = [];
  if (firstTime && ev.action === "grant") conversions = await sendPurchaseConversions(ev);

  return NextResponse.json({ ok: true, action: ev.action, duplicate: !firstTime, unmapped: ev.unmappedProductId || undefined, conversions });
}
