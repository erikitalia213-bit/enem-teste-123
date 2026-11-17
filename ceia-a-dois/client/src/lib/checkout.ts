import { OFERTA, PARAMETROS_REPASSADOS } from "@/config/oferta";

/** Formata centavos como moeda brasileira: 1000 → "R$ 10,00". */
export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Monta a URL final do checkout repassando os parâmetros UTM reais da visita.
 * - Só repassa parâmetros presentes e não vazios na URL atual.
 * - Nunca adiciona utm_source fixo.
 * - Retorna null se o checkout ainda não foi configurado ou é inválido.
 */
export function montarCheckoutUrl(base: string = OFERTA.checkoutUrl, busca: string = typeof window !== "undefined" ? window.location.search : ""): string | null {
  const limpo = base.trim();
  if (!limpo) return null;
  let url: URL;
  try {
    url = new URL(limpo);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const atuais = new URLSearchParams(busca);
  for (const chave of PARAMETROS_REPASSADOS) {
    const valor = atuais.get(chave)?.trim();
    if (valor) url.searchParams.set(chave, valor);
  }
  return url.toString();
}

/** Link do canal de suporte, ou null se não configurado. */
export function linkSuporte(): { href: string; texto: string } | null {
  const { tipo, valor, rotulo } = OFERTA.suporte;
  const v = valor.trim();
  if (!v) return null;
  if (tipo === "email") return { href: `mailto:${v}`, texto: rotulo || v };
  if (tipo === "whatsapp") {
    const numero = v.replace(/\D/g, "");
    return numero ? { href: `https://wa.me/${numero}`, texto: rotulo || "WhatsApp do suporte" } : null;
  }
  return { href: v, texto: rotulo || v };
}
