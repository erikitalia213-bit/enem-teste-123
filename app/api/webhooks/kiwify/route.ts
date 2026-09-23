import { NextResponse, type NextRequest } from "next/server";
import { parseProductMap } from "@/lib/entitlements";
import { parseKiwify, verifyKiwify } from "@/lib/server/webhooks";
import { applyWebhookEvent } from "@/lib/server/handle-webhook";

export const dynamic = "force-dynamic";

/** Webhook de Kiwify (firma HMAC-SHA1 en ?signature=). Ver docs/CHECKOUT.md. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifyKiwify(raw, req.nextUrl.searchParams.get("signature"), process.env.KIWIFY_WEBHOOK_TOKEN?.trim())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const ev = parseKiwify(body, parseProductMap(process.env.KIWIFY_PRODUCT_MAP));
  if (!ev) return NextResponse.json({ ok: true, action: "ignore", reason: "not_an_order_event" });
  return applyWebhookEvent(ev, body);
}
