import type { Adaptador, ResultadoAdaptador } from "../tipos";
import { classificarStatus, comoEmail, comoTexto, comoValor, lerCaminho, primeiroValor } from "../utils";

/**
 * Adaptador da Wiapy (checkout principal do produto).
 *
 * ⚠️ Este mapeamento foi escrito de forma TOLERANTE, aceitando os nomes de campo mais
 * comuns em checkouts brasileiros, porque o formato oficial ainda precisa ser
 * confirmado com um payload real. Passo a passo para ajustar:
 *   1. Configure na Wiapy a URL /api/webhooks/debug?token=SEU_WEBHOOK_SECRET_DEBUG.
 *   2. Faça uma compra de teste e um reembolso de teste.
 *   3. Veja o JSON salvo na tabela webhook_logs (Supabase → Table Editor).
 *   4. Ajuste os caminhos em CAMPOS_WIAPY (e, se preciso, VALOR_EM_CENTAVOS) e
 *      atualize lib/webhooks/exemplos/wiapy-*.json + os testes.
 *   5. Troque a URL na Wiapy para /api/webhooks/wiapy?token=SEU_WEBHOOK_SECRET_WIAPY.
 */
export const CAMPOS_WIAPY = {
  evento: ["event", "evento", "type", "status", "data.status", "payment.status", "order.status", "transaction.status"],
  email: ["customer.email", "data.customer.email", "client.email", "cliente.email", "buyer.email", "comprador.email", "order.customer.email", "email"],
  nome: ["customer.name", "data.customer.name", "client.name", "cliente.nome", "buyer.name", "comprador.nome", "order.customer.name", "name", "nome"],
  transacao: [
    "transaction_id",
    "transaction.id",
    "data.transaction_id",
    "data.transaction.id",
    "order_id",
    "order.id",
    "data.order_id",
    "sale_id",
    "payment.id",
    // Não use um "id" genérico: em muitos checkouts ele é o id do EVENTO, e o reembolso
    // chegaria com outro id, sem bloquear o acesso da compra original.
  ],
  produto: ["product.name", "data.product.name", "produto.nome", "products.0.name", "items.0.name", "order.items.0.name", "offer.name", "product_name"],
  valor: ["amount", "data.amount", "total", "valor", "value", "payment.amount", "order.total", "transaction.amount", "price"],
} as const;

/**
 * Se a Wiapy mandar o valor em centavos (ex.: 4700 para R$ 47,00), mude para true.
 * Com `"auto"`, inteiros acima de 1000 sem separador decimal são tratados como centavos.
 */
export const VALOR_EM_CENTAVOS: boolean | "auto" = "auto";

function lerValor(payload: unknown): number | null {
  const bruto = primeiroValor(payload, CAMPOS_WIAPY.valor);
  const n = comoValor(bruto);
  if (n === null) return null;
  const inteiro = typeof bruto === "number" ? Number.isInteger(bruto) : typeof bruto === "string" && /^\d+$/.test(bruto.trim());
  if (VALOR_EM_CENTAVOS === true || (VALOR_EM_CENTAVOS === "auto" && inteiro && n >= 1000)) return Math.round(n) / 100;
  return n;
}

export const adaptadorWiapy: Adaptador = {
  provedor: "wiapy",
  normalizar(payload): ResultadoAdaptador {
    if (!payload || typeof payload !== "object") return { tipo: "invalido", motivo: "Corpo vazio ou não é JSON." };

    // O evento pode vir em vários campos: o primeiro que for reconhecido decide.
    let status = null as ReturnType<typeof classificarStatus>;
    let eventoBruto: string | null = null;
    for (const caminho of CAMPOS_WIAPY.evento) {
      const v = comoTexto(lerCaminho(payload, caminho));
      if (!v) continue;
      eventoBruto ??= v;
      status = classificarStatus(v);
      if (status) break;
    }
    if (!eventoBruto) return { tipo: "invalido", motivo: "Evento/status não encontrado." };
    if (!status) return { tipo: "ignorado", motivo: `Evento sem efeito no acesso: ${eventoBruto}` };

    const email = comoEmail(primeiroValor(payload, CAMPOS_WIAPY.email));
    if (!email) return { tipo: "invalido", motivo: "E-mail da compradora não encontrado ou inválido." };
    const transacao = comoTexto(primeiroValor(payload, CAMPOS_WIAPY.transacao));
    if (!transacao) return { tipo: "invalido", motivo: "Id da transação não encontrado." };

    return {
      tipo: "compra",
      compra: {
        email,
        nome: comoTexto(primeiroValor(payload, CAMPOS_WIAPY.nome)),
        transacao_id: transacao,
        status,
        produto: comoTexto(primeiroValor(payload, CAMPOS_WIAPY.produto)),
        valor: lerValor(payload),
      },
    };
  },
};
