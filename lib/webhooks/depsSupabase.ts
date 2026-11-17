import "server-only";
import { enviarAcesso } from "@/lib/auth/enviarAcesso";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import type { DepsProcessamento } from "./processarCompra";
import type { StatusCompra } from "./tipos";

/** Implementação real das dependências do processamento (service role). */
export function depsSupabase(): DepsProcessamento {
  const admin = criarClienteAdmin();
  return {
    async buscarCompra(transacaoId) {
      const { data, error } = await admin.from("compras").select("status").eq("transacao_id", transacaoId).maybeSingle();
      if (error) throw new Error(`Erro ao buscar compra: ${error.message}`);
      return data ? { status: data.status as StatusCompra } : null;
    },
    async salvarCompra(c) {
      const { error } = await admin.from("compras").upsert(
        {
          email: c.email,
          nome: c.nome,
          provedor: c.provedor,
          transacao_id: c.transacao_id,
          status: c.status,
          produto: c.produto,
          valor: c.valor,
          payload: c.payload ?? {},
        },
        { onConflict: "transacao_id" },
      );
      if (error) throw new Error(`Erro ao salvar compra: ${error.message}`);
    },
    enviarAcesso,
  };
}

/** Grava um payload cru em webhook_logs (debug e payloads não reconhecidos). */
export async function registrarLogWebhook(log: {
  origem: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  corpoBruto: string;
  corpoJson: unknown;
  observacao?: string;
}): Promise<void> {
  const admin = criarClienteAdmin();
  const { error } = await admin.from("webhook_logs").insert({
    origem: log.origem,
    headers: log.headers,
    query: log.query,
    corpo_bruto: log.corpoBruto.slice(0, 200_000),
    corpo_json: log.corpoJson ?? null,
    observacao: log.observacao ?? null,
  });
  if (error) throw new Error(`Erro ao gravar webhook_logs: ${error.message}`);
}
