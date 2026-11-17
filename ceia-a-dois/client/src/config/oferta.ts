/**
 * CONFIGURAÇÃO DA OFERTA — Ceia a Dois
 * ------------------------------------------------------------
 * Este é o ÚNICO lugar para editar preço, checkout, entrega,
 * suporte e garantia. A página (client/src/pages/Home.tsx) lê
 * tudo daqui.
 *
 * Regras:
 * - Enquanto `checkoutUrl` estiver vazio, o botão de compra fica
 *   desativado e a página avisa que as vendas ainda não abriram.
 * - `entrega`, `suporte` e `garantia` só aparecem na página quando
 *   estiverem preenchidos. Não preencha com dados não confirmados.
 */

export type Oferta = {
  /** Nome do produto exibido na oferta e no rodapé. */
  produto: string;
  /** Preço em centavos (1000 = R$ 10,00). */
  precoCentavos: number;
  /**
   * URL real do checkout (ex.: Hotmart, Kiwify, Eduzz…).
   * Deixe "" até ter o link. Não coloque utm_* fixos aqui:
   * os parâmetros UTM da visita são repassados automaticamente.
   */
  checkoutUrl: string;
  /**
   * Como o cliente recebe o acesso, confirmado com a plataforma.
   * Ex.: "Link de download enviado para o e-mail da compra logo após a aprovação do pagamento."
   * Deixe "" enquanto a integração não estiver confirmada.
   */
  entrega: string;
  /**
   * Canal de suporte real. Deixe `valor` vazio para ocultar.
   * tipo "email" → mailto:, "whatsapp" → wa.me (só números, com DDI 55), "url" → link direto.
   */
  suporte: {
    tipo: "email" | "whatsapp" | "url";
    valor: string;
    /** Texto opcional exibido no lugar do valor (ex.: "WhatsApp do suporte"). */
    rotulo?: string;
  };
  /**
   * Garantia. Deixe `dias` como null para não exibir garantia.
   * Preencha só quando a política estiver confirmada na plataforma de venda.
   */
  garantia: {
    dias: number | null;
    /** Texto opcional da política. Se vazio, a página usa um texto padrão com os dias. */
    texto?: string;
  };
  /** Responsável pela venda exibido no rodapé (nome ou razão social + CNPJ/CPF, se desejar). */
  responsavel: string;
};

export const OFERTA: Oferta = {
  produto: "Ceia a Dois — Natal e Réveillon em Casa",
  precoCentavos: 1000,
  checkoutUrl: "",
  entrega: "",
  suporte: { tipo: "email", valor: "" },
  garantia: { dias: null },
  responsavel: "",
};

/** Parâmetros de rastreamento da visita que são repassados ao checkout. */
export const PARAMETROS_REPASSADOS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
