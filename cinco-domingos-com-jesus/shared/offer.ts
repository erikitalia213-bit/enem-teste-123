/**
 * Ponto único de configuração comercial da oferta "5 Domingos com Jesus".
 *
 * Tudo o que depende de decisão ou integração externa fica aqui:
 * preço, checkout, PDF da amostra, forma de entrega e contato de suporte.
 *
 * Regras da página:
 * - O preço só aparece com `price.confirmed = true`.
 * - O botão de compra só aparece com preço confirmado E `checkout.url` válido (https).
 * - O botão de download da amostra só fica ativo com `sample.pdfUrl` preenchido.
 * - A resposta sobre entrega e o contato de suporte só aparecem quando configurados;
 *   até lá a página mostra um aviso visível de "em configuração".
 */

export type OfferConfig = {
  name: string;
  price: {
    /** Valor em centavos. R$ 29,90 é uma hipótese editável. */
    amountCents: number;
    currency: "BRL";
    confirmed: boolean;
  };
  checkout: {
    /** URL de pagamento da nova oferta (Hotmart, Kiwify, Cakto etc.). */
    url: string;
  };
  sample: {
    /** URL do PDF real do primeiro domingo, ex.: "/downloads/primeiro-domingo.pdf". */
    pdfUrl: string;
  };
  /**
   * Como o comprador recebe os arquivos, conforme a integração real.
   * Ex.: "Logo após a confirmação do pagamento, você recebe no e-mail da compra o link para baixar os PDFs."
   */
  deliveryNote: string;
  support: {
    email: string;
    /** Somente dígitos, com DDI e DDD. Ex.: "5511999999999". */
    whatsapp: string;
  };
  /** Enquanto as fotos forem mockups conceituais, cada uma recebe o selo "Prévia ilustrativa". */
  imagesAreIllustrative: boolean;
};

export const OFFER: OfferConfig = {
  name: "5 Domingos com Jesus",
  price: {
    amountCents: 2990,
    currency: "BRL",
    confirmed: false,
  },
  checkout: {
    url: "",
  },
  sample: {
    pdfUrl: "",
  },
  deliveryNote: "",
  support: {
    email: "",
    whatsapp: "",
  },
  imagesAreIllustrative: true,
};

export function formatPrice(amountCents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(amountCents / 100)
    .replace(/ /g, " ");
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** URL relativa do próprio site (ex.: "/downloads/x.pdf") ou https. */
export function isUsableFileUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  return isHttpsUrl(trimmed);
}

export function showPrice(offer: OfferConfig = OFFER): boolean {
  return offer.price.confirmed && offer.price.amountCents > 0;
}

export function canSell(offer: OfferConfig = OFFER): boolean {
  return showPrice(offer) && isHttpsUrl(offer.checkout.url.trim());
}

export function sampleAvailable(offer: OfferConfig = OFFER): boolean {
  return isUsableFileUrl(offer.sample.pdfUrl);
}

export function supportContact(offer: OfferConfig = OFFER) {
  const email = offer.support.email.trim();
  const whatsapp = offer.support.whatsapp.replace(/\D/g, "");
  return {
    email: email.includes("@") ? email : "",
    whatsappUrl: whatsapp.length >= 12 ? `https://wa.me/${whatsapp}` : "",
  };
}

/** Lista o que ainda depende de configuração antes de publicar. */
export function pendingSetup(offer: OfferConfig = OFFER): string[] {
  const pending: string[] = [];
  if (!showPrice(offer)) pending.push("Confirmar o preço (price.confirmed).");
  if (!isHttpsUrl(offer.checkout.url.trim())) pending.push("Informar a URL do checkout (checkout.url).");
  if (!sampleAvailable(offer)) pending.push("Fornecer o PDF da amostra (sample.pdfUrl).");
  if (!offer.deliveryNote.trim()) pending.push("Descrever a entrega conforme a integração (deliveryNote).");
  const contact = supportContact(offer);
  if (!contact.email && !contact.whatsappUrl) pending.push("Configurar o contato de suporte (support).");
  if (offer.imagesAreIllustrative) pending.push("Substituir as prévias ilustrativas por fotos do material final.");
  return pending;
}
