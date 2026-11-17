import { describe, expect, it } from "vitest";
import { formatarPreco, montarCheckoutUrl } from "./checkout";

describe("montarCheckoutUrl", () => {
  it("retorna null quando o checkout não foi configurado", () => {
    expect(montarCheckoutUrl("", "?utm_source=ig")).toBeNull();
    expect(montarCheckoutUrl("   ", "")).toBeNull();
  });

  it("rejeita URLs inválidas ou com protocolo inseguro", () => {
    expect(montarCheckoutUrl("nao-e-url", "")).toBeNull();
    expect(montarCheckoutUrl("javascript:alert(1)", "")).toBeNull();
  });

  it("repassa apenas os UTM presentes e não vazios", () => {
    const url = new URL(
      montarCheckoutUrl("https://pay.exemplo.com/abc?off=1", "?utm_source=instagram&utm_medium=&utm_campaign=natal&fbclid=x")!,
    );
    expect(url.searchParams.get("off")).toBe("1");
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("utm_campaign")).toBe("natal");
    expect(url.searchParams.has("utm_medium")).toBe(false);
    expect(url.searchParams.has("fbclid")).toBe(false);
  });

  it("não adiciona utm_source fixo em visita sem UTM", () => {
    expect(montarCheckoutUrl("https://pay.exemplo.com/abc", "")).toBe("https://pay.exemplo.com/abc");
  });
});

describe("formatarPreco", () => {
  it("formata em reais", () => {
    expect(formatarPreco(1000).replace(/\s/g, " ")).toBe("R$ 10,00");
  });
});
