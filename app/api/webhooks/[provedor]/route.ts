import { NextResponse, type NextRequest } from "next/server";
import { adaptadores, segredoDoProvedor } from "@/lib/webhooks/adaptadores";
import { depsSupabase, registrarLogWebhook } from "@/lib/webhooks/depsSupabase";
import { lerProdutosAceitos, processarCompra } from "@/lib/webhooks/processarCompra";
import { cabecalhosParaLog, interpretarCorpo, LIMITE_CORPO, queryParaLog } from "@/lib/webhooks/requisicao";
import { extrairToken, tokenValido } from "@/lib/webhooks/token";
import { PROVEDORES, type Provedor } from "@/lib/webhooks/tipos";
import { supabaseConfigurado } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Contexto = { params: Promise<{ provedor: string }> };

function ehProvedor(v: string): v is Provedor {
  return (PROVEDORES as string[]).includes(v);
}

/** GET só confirma que a URL existe (útil ao configurar na plataforma). */
export async function GET(_req: NextRequest, { params }: Contexto) {
  const { provedor } = await params;
  if (!ehProvedor(provedor)) return NextResponse.json({ ok: false, erro: "Provedor desconhecido." }, { status: 404 });
  return NextResponse.json({ ok: true, provedor, mensagem: "Endpoint de webhook ativo. A plataforma deve enviar POST." });
}

export async function POST(req: NextRequest, { params }: Contexto) {
  const { provedor } = await params;
  if (!ehProvedor(provedor)) return NextResponse.json({ ok: false, erro: "Provedor desconhecido." }, { status: 404 });

  const bruto = await req.text();
  if (bruto.length > LIMITE_CORPO) return NextResponse.json({ ok: false, erro: "Corpo grande demais." }, { status: 413 });
  const corpo = interpretarCorpo(bruto, req.headers.get("content-type"));
  const query = req.nextUrl.searchParams;

  const segredo = segredoDoProvedor(provedor);
  if (!segredo) {
    return NextResponse.json({ ok: false, erro: `Defina WEBHOOK_SECRET_${provedor.toUpperCase()} no servidor.` }, { status: 503 });
  }
  if (!tokenValido(extrairToken(req.headers, query, corpo), segredo)) {
    return NextResponse.json({ ok: false, erro: "Token inválido." }, { status: 401 });
  }
  if (!supabaseConfigurado || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, erro: "Supabase não configurado no servidor." }, { status: 503 });
  }

  const resultado = adaptadores[provedor].normalizar(corpo);

  if (resultado.tipo === "ignorado") {
    return NextResponse.json({ ok: true, ignorado: true, motivo: resultado.motivo });
  }
  if (resultado.tipo === "invalido") {
    // Guarda o payload para ajustar o adaptador depois.
    await registrarLogWebhook({
      origem: provedor,
      headers: cabecalhosParaLog(req.headers),
      query: queryParaLog(query),
      corpoBruto: bruto,
      corpoJson: corpo,
      observacao: `Payload não reconhecido: ${resultado.motivo}`,
    }).catch((e) => console.error("[webhook] falha ao gravar log", e));
    return NextResponse.json({ ok: false, erro: resultado.motivo }, { status: 422 });
  }

  try {
    const r = await processarCompra(provedor, resultado.compra, corpo, depsSupabase(), {
      produtosAceitos: lerProdutosAceitos(process.env.WEBHOOK_PRODUTOS_ACEITOS),
    });
    if (r.avisos.length) {
      console.warn(`[webhook:${provedor}]`, r.transacao_id, r.avisos.join(" | "));
      await registrarLogWebhook({
        origem: provedor,
        headers: cabecalhosParaLog(req.headers),
        query: queryParaLog(query),
        corpoBruto: bruto,
        corpoJson: corpo,
        observacao: r.avisos.join(" | "),
      }).catch(() => undefined);
    }
    return NextResponse.json({ ok: true, ...r });
  } catch (erro) {
    console.error(`[webhook:${provedor}] erro`, erro);
    // 500 faz a plataforma reenviar; o processamento é idempotente.
    return NextResponse.json({ ok: false, erro: "Erro interno ao processar a compra." }, { status: 500 });
  }
}
