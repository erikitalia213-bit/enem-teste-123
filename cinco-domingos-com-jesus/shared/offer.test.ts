import { describe, expect, it } from "vitest";
import { OFFER, canSell, formatPrice, pendingSetup, sampleAvailable, showPrice, supportContact, type OfferConfig } from "./offer";

const configured: OfferConfig = {
  ...OFFER,
  price: { amountCents: 2990, currency: "BRL", confirmed: true },
  checkout: { url: "https://checkout.example.com/5-domingos" },
  sample: { pdfUrl: "/downloads/primeiro-domingo.pdf" },
  deliveryNote: "Você recebe o link no e-mail da compra.",
  support: { email: "suporte@example.com", whatsapp: "" },
  imagesAreIllustrative: false,
};

describe("configuração da oferta", () => {
  it("formata o preço em reais", () => {
    expect(formatPrice(2990)).toBe("R$ 29,90");
  });

  it("não vende enquanto preço e checkout não estiverem confirmados", () => {
    expect(canSell(OFFER)).toBe(OFFER.price.confirmed && OFFER.checkout.url.startsWith("https://"));
    expect(canSell({ ...configured, price: { ...configured.price, confirmed: false } })).toBe(false);
    expect(canSell({ ...configured, checkout: { url: "" } })).toBe(false);
    expect(canSell({ ...configured, checkout: { url: "http://inseguro.example.com" } })).toBe(false);
    expect(canSell(configured)).toBe(true);
  });

  it("só mostra o preço confirmado", () => {
    expect(showPrice({ ...configured, price: { ...configured.price, confirmed: false } })).toBe(false);
    expect(showPrice(configured)).toBe(true);
  });

  it("só libera a amostra com um PDF informado", () => {
    expect(sampleAvailable({ ...configured, sample: { pdfUrl: "" } })).toBe(false);
    expect(sampleAvailable({ ...configured, sample: { pdfUrl: "//outro-site.com/x.pdf" } })).toBe(false);
    expect(sampleAvailable(configured)).toBe(true);
  });

  it("valida o contato de suporte", () => {
    expect(supportContact({ ...configured, support: { email: "invalido", whatsapp: "123" } })).toEqual({ email: "", whatsappUrl: "" });
    expect(supportContact({ ...configured, support: { email: "", whatsapp: "+55 (11) 99999-9999" } }).whatsappUrl).toBe("https://wa.me/5511999999999");
  });

  it("lista pendências até tudo estar configurado", () => {
    expect(pendingSetup(configured)).toEqual([]);
    expect(pendingSetup({ ...configured, checkout: { url: "" } })).toHaveLength(1);
  });

  it("não contém links do vendedor de referência", () => {
    const serialized = JSON.stringify(OFFER).toLowerCase();
    for (const banned of ["cakto", "presepiounicoempapel", "pix"]) {
      expect(serialized).not.toContain(banned);
    }
  });
});
