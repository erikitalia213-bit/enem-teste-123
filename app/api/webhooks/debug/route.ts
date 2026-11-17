import { NextResponse, type NextRequest } from "next/server";
import { registrarLogWebhook } from "@/lib/webhooks/depsSupabase";
import { cabecalhosParaLog, interpretarCorpo, LIMITE_CORPO, queryParaLog } from "@/lib/webhooks/requisicao";
import { extrairToken, tokenValido } from "@/lib/webhooks/token";
import { supabaseConfigurado } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Rota de captura: salva o payload CRU em webhook_logs e não faz mais nada
 * (não libera acesso, não envia e-mail). Use para descobrir o formato real do
 * webhook da Wiapy/Kirvano. Protegida por WEBHOOK_SECRET_DEBUG; sem ele, a rota não existe.
 *
 * Opcional: ?origem=wiapy para identificar a plataforma no log.
 */
async function capturar(req: NextRequest) {
  const segredo = process.env.WEBHOOK_SECRET_DEBUG;
  if (!segredo) return NextResponse.json({ ok: false, erro: "Não encontrado." }, { status: 404 });

  const bruto = await req.text();
  if (bruto.length > LIMITE_CORPO) return NextResponse.json({ ok: false, erro: "Corpo grande demais." }, { status: 413 });
  const corpo = interpretarCorpo(bruto, req.headers.get("content-type"));
  const query = req.nextUrl.searchParams;

  if (!tokenValido(extrairToken(req.headers, query, corpo), segredo)) {
    return NextResponse.json({ ok: false, erro: "Token inválido." }, { status: 401 });
  }
  if (!supabaseConfigurado || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, erro: "Supabase não configurado no servidor." }, { status: 503 });
  }

  const origem = (query.get("origem") ?? "debug").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "debug";
  try {
    await registrarLogWebhook({
      origem: `debug:${origem}`,
      headers: cabecalhosParaLog(req.headers),
      query: queryParaLog(query),
      corpoBruto: bruto,
      corpoJson: corpo,
      observacao: `Captura via /api/webhooks/debug (${req.method})`,
    });
  } catch (erro) {
    console.error("[webhook:debug]", erro);
    return NextResponse.json({ ok: false, erro: "Falha ao gravar o log." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, salvo: true });
}

export const POST = capturar;
export const PUT = capturar;
