/** Configurações públicas do app (lidas de variáveis NEXT_PUBLIC_*). */
export const APP_NOME = "Protocolo 42 Dias";
export const APP_NOME_COMPLETO = "Protocolo 42 Dias: Bumbum pro Réveillon";
export const TOTAL_DIAS = 42;
export const FUSO_HORARIO = "America/Sao_Paulo";

export const urlApp = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const suporte = {
  email: process.env.NEXT_PUBLIC_SUPORTE_EMAIL ?? "",
  whatsapp: (process.env.NEXT_PUBLIC_SUPORTE_WHATSAPP ?? "").replace(/\D/g, ""),
};

export function linkWhatsappSuporte(mensagem = "Oi! Preciso de ajuda com o acesso ao Protocolo 42 Dias."): string | null {
  if (!suporte.whatsapp) return null;
  return `https://wa.me/${suporte.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const AVISO_TREINO =
  "Os resultados variam de pessoa para pessoa. Este programa não substitui orientação médica ou de um profissional de educação física. Em caso de dor, pare o exercício.";

export const AVISO_CARDAPIO =
  "Cardápio sugerido e geral. Não substitui a orientação de um nutricionista. Se você tem alguma condição de saúde, alergia ou restrição, consulte um profissional.";
