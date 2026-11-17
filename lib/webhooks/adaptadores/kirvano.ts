import type { Adaptador, ResultadoAdaptador } from "../tipos";
import { classificarStatus, comoEmail, comoTexto, comoValor, lerCaminho, primeiroValor } from "../utils";

/**
 * Adaptador da Kirvano.
 *
 * Formato esperado (veja lib/webhooks/exemplos/kirvano-*.json):
 *   { event: "SALE_APPROVED" | "SALE_REFUNDED" | "SALE_CHARGEBACK" | ..., sale_id, status,
 *     total_price: "R$ 47,00", customer: { name, email }, products: [{ name, is_order_bump }] }
 *
 * Se o payload real vier diferente, ajuste os caminhos em CAMPOS. Use a rota
 * /api/webhooks/debug para capturar um payload real antes de mexer aqui.
 */
export const CAMPOS_KIRVANO = {
  evento: ["event", "status", "sale_status"],
  email: ["customer.email", "buyer.email", "email"],
  nome: ["customer.name", "buyer.name", "name"],
  transacao: ["sale_id", "transaction_id", "order_id"],
  valor: ["total_price", "fiscal.total_value", "price", "amount"],
} as const;

/** Eventos conhecidos da Kirvano → nosso status (null = ignorar). */
const EVENTOS: Record<string, "aprovada" | "reembolsada" | "chargeback" | null> = {
  SALE_APPROVED: "aprovada",
  SALE_REFUNDED: "reembolsada",
  SALE_CHARGEBACK: "chargeback",
  SALE_REFUSED: null,
  BANK_SLIP_GENERATED: null,
  BANK_SLIP_EXPIRED: null,
  PIX_GENERATED: null,
  PIX_EXPIRED: null,
  ABANDONED_CART: null,
  SUBSCRIPTION_CANCELED: null,
  SUBSCRIPTION_EXPIRED: null,
  SUBSCRIPTION_RENEWED: "aprovada",
};

function nomeProduto(payload: unknown): string | null {
  const produtos = lerCaminho(payload, "products");
  if (Array.isArray(produtos) && produtos.length) {
    const principal = produtos.find((p) => !(p && typeof p === "object" && (p as Record<string, unknown>).is_order_bump)) ?? produtos[0];
    const nomes = produtos.map((p) => comoTexto(lerCaminho(p, "name")) ?? comoTexto(lerCaminho(p, "offer_name"))).filter(Boolean);
    const nomePrincipal = comoTexto(lerCaminho(principal, "name")) ?? comoTexto(lerCaminho(principal, "offer_name"));
    return nomes.length > 1 ? nomes.join(" + ") : nomePrincipal;
  }
  return comoTexto(primeiroValor(payload, ["product.name", "product_name", "offer_name"]));
}

export const adaptadorKirvano: Adaptador = {
  provedor: "kirvano",
  normalizar(payload): ResultadoAdaptador {
    if (!payload || typeof payload !== "object") return { tipo: "invalido", motivo: "Corpo vazio ou não é JSON." };

    const evento = comoTexto(primeiroValor(payload, CAMPOS_KIRVANO.evento));
    if (!evento) return { tipo: "invalido", motivo: "Evento/status não encontrado." };
    const chave = evento.toUpperCase();
    const status = chave in EVENTOS ? EVENTOS[chave]! : classificarStatus(evento);
    if (!status) return { tipo: "ignorado", motivo: `Evento sem efeito no acesso: ${evento}` };

    const email = comoEmail(primeiroValor(payload, CAMPOS_KIRVANO.email));
    if (!email) return { tipo: "invalido", motivo: "E-mail da compradora não encontrado ou inválido." };
    const transacao = comoTexto(primeiroValor(payload, CAMPOS_KIRVANO.transacao));
    if (!transacao) return { tipo: "invalido", motivo: "Id da transação não encontrado." };

    return {
      tipo: "compra",
      compra: {
        email,
        nome: comoTexto(primeiroValor(payload, CAMPOS_KIRVANO.nome)),
        transacao_id: transacao,
        status,
        produto: nomeProduto(payload),
        valor: comoValor(primeiroValor(payload, CAMPOS_KIRVANO.valor)),
      },
    };
  },
};
