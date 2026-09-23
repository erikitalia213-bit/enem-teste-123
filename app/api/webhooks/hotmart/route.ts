import { NextResponse, type NextRequest } from "next/server";
import { parseProductMap } from "@/lib/entitlements";
import { parseHotmart, verifyHotmart } from "@/lib/server/webhooks";
import { applyWebhookEvent } from "@/lib/server/handle-webhook";

export const dynamic = "force-dynamic";

/** Webhook de Hotmart (versión 2.0). Ver docs/CHECKOUT.md. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!verifyHotmart(req.headers.get("x-hotmart-hottok"), body, process.env.HOTMART_HOTTOK?.trim())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const ev = parseHotmart(body, parseProductMap(process.env.HOTMART_PRODUCT_MAP));
  if (!ev) return NextResponse.json({ ok: true, action: "ignore", reason: "not_a_purchase_event" });
  return applyWebhookEvent(ev, body);
}
