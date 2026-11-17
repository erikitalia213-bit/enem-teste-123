import { z } from "zod";
import type { StatusCompra } from "./tipos";

/** Lê um campo por caminho ("customer.email", "products.0.name"). */
export function lerCaminho(obj: unknown, caminho: string): unknown {
  let atual: unknown = obj;
  for (const parte of caminho.split(".")) {
    if (atual === null || atual === undefined) return undefined;
    if (Array.isArray(atual)) atual = atual[Number(parte)];
    else if (typeof atual === "object") atual = (atual as Record<string, unknown>)[parte];
    else return undefined;
  }
  return atual;
}

/** Primeiro valor não vazio entre vários caminhos possíveis. */
export function primeiroValor(obj: unknown, caminhos: readonly string[]): unknown {
  for (const c of caminhos) {
    const v = lerCaminho(obj, c);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

export function comoTexto(valor: unknown): string | null {
  if (typeof valor === "string") return valor.trim() || null;
  if (typeof valor === "number" && Number.isFinite(valor)) return String(valor);
  return null;
}

/**
 * Converte valores monetários: 47, "47.00", "47,00", "R$ 1.297,90".
 * Valores em centavos (inteiros grandes) devem ser tratados no adaptador.
 */
export function comoValor(valor: unknown): number | null {
  if (typeof valor === "number") return Number.isFinite(valor) ? Math.round(valor * 100) / 100 : null;
  if (typeof valor !== "string") return null;
  let s = valor.replace(/[^\d.,-]/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

const emailSchema = z.email();

export function comoEmail(valor: unknown): string | null {
  const s = comoTexto(valor)?.toLowerCase();
  if (!s) return null;
  return emailSchema.safeParse(s).success ? s : null;
}

/**
 * Traduz um status/evento qualquer para o nosso status. Retorna null para eventos
 * que não mexem no acesso. Edite as listas se o provedor usar outros nomes.
 */
export function classificarStatus(valor: unknown): StatusCompra | null {
  const s = (comoTexto(valor) ?? "").toLowerCase();
  if (!s) return null;
  if (/charge_?back|contesta|disput/.test(s)) return "chargeback";
  if (/refund|reembols|estorn|devolvid|cancelad[ao]_?pelo|reversed/.test(s)) return "reembolsada";
  if (/refus|recusad|pending|pendente|aguardando|waiting|generated|gerad|abandon|expir|canceled|cancelad/.test(s)) return null;
  if (/approved|aprovad|paid|pago|complete|conclu|confirm|success|sucesso|authorized|autorizad/.test(s)) return "aprovada";
  return null;
}
