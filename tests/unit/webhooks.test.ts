import { describe, expect, it } from "vitest";
import { adaptadorKirvano } from "@/lib/webhooks/adaptadores/kirvano";
import { adaptadorWiapy } from "@/lib/webhooks/adaptadores/wiapy";
import { processarCompra, produtoAceito, lerProdutosAceitos, type DepsProcessamento, type RegistroCompra } from "@/lib/webhooks/processarCompra";
import { extrairToken, tokenValido } from "@/lib/webhooks/token";
import { classificarStatus, comoValor } from "@/lib/webhooks/utils";
import { interpretarCorpo, cabecalhosParaLog } from "@/lib/webhooks/requisicao";
import type { StatusCompra } from "@/lib/webhooks/tipos";

import kirvanoAprovada from "@/lib/webhooks/exemplos/kirvano-aprovada.json";
import kirvanoReembolso from "@/lib/webhooks/exemplos/kirvano-reembolso.json";
import kirvanoChargeback from "@/lib/webhooks/exemplos/kirvano-chargeback.json";
import kirvanoPix from "@/lib/webhooks/exemplos/kirvano-pix-gerado.json";
import wiapyAprovada from "@/lib/webhooks/exemplos/wiapy-aprovada.json";
import wiapyReembolso from "@/lib/webhooks/exemplos/wiapy-reembolso.json";
import wiapyChargeback from "@/lib/webhooks/exemplos/wiapy-chargeback.json";
import wiapyPendente from "@/lib/webhooks/exemplos/wiapy-pendente.json";

describe("adaptador Kirvano", () => {
  it("normaliza venda aprovada (e-mail em minúsculas, valor, produto + order bump)", () => {
    const r = adaptadorKirvano.normalizar(kirvanoAprovada);
    expect(r).toEqual({
      tipo: "compra",
      compra: {
        email: "maria.teste@exemplo.com",
        nome: "Maria Teste",
        transacao_id: "KV-2026-000123",
        status: "aprovada",
        produto: "Protocolo 42 Dias: Bumbum pro Réveillon + Guia de Proteína Barata",
        valor: 47,
      },
    });
  });

  it("reembolso e chargeback mantêm o mesmo transacao_id", () => {
    const r1 = adaptadorKirvano.normalizar(kirvanoReembolso);
    const r2 = adaptadorKirvano.normalizar(kirvanoChargeback);
    expect(r1.tipo === "compra" && r1.compra.status).toBe("reembolsada");
    expect(r2.tipo === "compra" && r2.compra.status).toBe("chargeback");
    expect(r1.tipo === "compra" && r1.compra.transacao_id).toBe("KV-2026-000123");
  });

  it("ignora eventos que não mexem no acesso", () => {
    expect(adaptadorKirvano.normalizar(kirvanoPix).tipo).toBe("ignorado");
  });

  it("marca como inválido quando faltam dados", () => {
    expect(adaptadorKirvano.normalizar(null).tipo).toBe("invalido");
    expect(adaptadorKirvano.normalizar({ event: "SALE_APPROVED", sale_id: "1" }).tipo).toBe("invalido");
    expect(adaptadorKirvano.normalizar({ event: "SALE_APPROVED", customer: { email: "a@b.com" } }).tipo).toBe("invalido");
  });
});

describe("adaptador Wiapy", () => {
  it("normaliza pedido pago com valor em centavos", () => {
    const r = adaptadorWiapy.normalizar(wiapyAprovada);
    expect(r).toEqual({
      tipo: "compra",
      compra: {
        email: "ana.teste@exemplo.com",
        nome: "Ana Teste",
        transacao_id: "WP-77881",
        status: "aprovada",
        produto: "Protocolo 42 Dias: Bumbum pro Réveillon",
        valor: 47,
      },
    });
  });

  it("reembolso, chargeback e pendente", () => {
    const r = adaptadorWiapy.normalizar(wiapyReembolso);
    expect(r.tipo === "compra" && r.compra.status).toBe("reembolsada");
    const c = adaptadorWiapy.normalizar(wiapyChargeback);
    expect(c.tipo === "compra" && c.compra.status).toBe("chargeback");
    expect(adaptadorWiapy.normalizar(wiapyPendente).tipo).toBe("ignorado");
  });

  it("aceita formatos planos alternativos", () => {
    const r = adaptadorWiapy.normalizar({
      status: "aprovado",
      order_id: "123",
      cliente: { nome: "Bia", email: "BIA@x.com" },
      valor: "47,90",
    });
    expect(r.tipo === "compra" && r.compra).toMatchObject({ email: "bia@x.com", transacao_id: "123", status: "aprovada", valor: 47.9 });
  });

  it("não usa um id genérico como transação (evita reembolso sem efeito)", () => {
    expect(adaptadorWiapy.normalizar({ id: "evt_1", status: "paid", customer: { email: "a@b.com" } }).tipo).toBe("invalido");
  });
});

describe("utilitários", () => {
  it("classifica status em PT e EN", () => {
    expect(classificarStatus("SALE_APPROVED")).toBe("aprovada");
    expect(classificarStatus("pago")).toBe("aprovada");
    expect(classificarStatus("order.refunded")).toBe("reembolsada");
    expect(classificarStatus("estornado")).toBe("reembolsada");
    expect(classificarStatus("chargeback")).toBe("chargeback");
    expect(classificarStatus("SALE_REFUSED")).toBeNull();
    expect(classificarStatus("waiting_payment")).toBeNull();
    expect(classificarStatus("")).toBeNull();
  });

  it("converte valores", () => {
    expect(comoValor("R$ 1.297,90")).toBe(1297.9);
    expect(comoValor("47.00")).toBe(47);
    expect(comoValor(47)).toBe(47);
    expect(comoValor("abc")).toBeNull();
  });

  it("interpreta JSON e form-urlencoded", () => {
    expect(interpretarCorpo('{"a":1}', "application/json")).toEqual({ a: 1 });
    expect(interpretarCorpo("status=paid&customer[email]=a%40b.com", "application/x-www-form-urlencoded")).toEqual({
      status: "paid",
      customer: { email: "a@b.com" },
    });
    expect(interpretarCorpo("", null)).toBeNull();
  });

  it("esconde segredos nos logs", () => {
    const h = new Headers({ authorization: "Bearer x", "x-webhook-token": "y", "content-type": "application/json" });
    expect(cabecalhosParaLog(h)).toEqual({ authorization: "[oculto]", "x-webhook-token": "[oculto]", "content-type": "application/json" });
  });
});

describe("token do webhook", () => {
  it("lê de cabeçalho, Bearer, query e corpo", () => {
    const q = new URLSearchParams();
    expect(extrairToken(new Headers({ "x-webhook-token": "abc" }), q, null)).toBe("abc");
    expect(extrairToken(new Headers({ authorization: "Bearer abc" }), q, null)).toBe("abc");
    expect(extrairToken(new Headers(), new URLSearchParams("token=abc"), null)).toBe("abc");
    expect(extrairToken(new Headers(), q, { token: "abc" })).toBe("abc");
    expect(extrairToken(new Headers(), q, {})).toBeNull();
  });

  it("valida em tempo constante e recusa segredo vazio", () => {
    expect(tokenValido("abc", "abc")).toBe(true);
    expect(tokenValido("abd", "abc")).toBe(false);
    expect(tokenValido("ab", "abc")).toBe(false);
    expect(tokenValido("abc", "")).toBe(false);
    expect(tokenValido(null, "abc")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// processarCompra com dublês
// ---------------------------------------------------------------------------
function criarDeps() {
  const compras = new Map<string, RegistroCompra>();
  const envios: { email: string; tipo: "convite" | "link" }[] = [];
  const usuarios = new Set<string>();
  let falharEnvio = false;
  const deps: DepsProcessamento = {
    async buscarCompra(id) {
      const c = compras.get(id);
      return c ? { status: c.status as StatusCompra } : null;
    },
    async salvarCompra(c) {
      compras.set(c.transacao_id, c);
    },
    async enviarAcesso(email) {
      if (falharEnvio) throw new Error("SMTP fora do ar");
      const tipo = usuarios.has(email) ? "link" : "convite";
      usuarios.add(email);
      envios.push({ email, tipo });
      return tipo;
    },
  };
  return { deps, compras, envios, falhar: () => (falharEnvio = true) };
}

const aprovada = (adaptadorKirvano.normalizar(kirvanoAprovada) as { compra: Parameters<typeof processarCompra>[1] }).compra;
const reembolso = (adaptadorKirvano.normalizar(kirvanoReembolso) as { compra: Parameters<typeof processarCompra>[1] }).compra;
const chargeback = (adaptadorKirvano.normalizar(kirvanoChargeback) as { compra: Parameters<typeof processarCompra>[1] }).compra;

describe("processarCompra", () => {
  it("compra aprovada nova: salva e envia convite", async () => {
    const { deps, compras, envios } = criarDeps();
    const r = await processarCompra("kirvano", aprovada, kirvanoAprovada, deps);
    expect(r.acao).toBe("criada");
    expect(r.acesso).toBe("convite-enviado");
    expect(compras.get("KV-2026-000123")!.status).toBe("aprovada");
    expect(envios).toHaveLength(1);
  });

  it("é idempotente: o mesmo evento repetido não reenvia o e-mail", async () => {
    const { deps, envios } = criarDeps();
    await processarCompra("kirvano", aprovada, {}, deps);
    const r = await processarCompra("kirvano", aprovada, {}, deps);
    expect(r.acao).toBe("sem-mudanca");
    expect(envios).toHaveLength(1);
  });

  it("reembolso e chargeback bloqueiam", async () => {
    const { deps, compras } = criarDeps();
    await processarCompra("kirvano", aprovada, {}, deps);
    const r = await processarCompra("kirvano", reembolso, {}, deps);
    expect(r).toMatchObject({ acao: "atualizada", acesso: "bloqueado", status: "reembolsada" });
    const c = await processarCompra("kirvano", chargeback, {}, deps);
    expect(c.status).toBe("chargeback");
    expect(compras.get("KV-2026-000123")!.status).toBe("chargeback");
  });

  it("aprovação fora de ordem (depois do reembolso) não devolve o acesso", async () => {
    const { deps, compras, envios } = criarDeps();
    await processarCompra("kirvano", reembolso, {}, deps);
    const r = await processarCompra("kirvano", aprovada, {}, deps);
    expect(r.acao).toBe("ignorada-ordem");
    expect(compras.get("KV-2026-000123")!.status).toBe("reembolsada");
    expect(envios).toHaveLength(0);
  });

  it("falha no e-mail não perde a compra", async () => {
    const { deps, compras, falhar } = criarDeps();
    falhar();
    const r = await processarCompra("kirvano", aprovada, {}, deps);
    expect(compras.has("KV-2026-000123")).toBe(true);
    expect(r.acesso).toBe("nenhum");
    expect(r.avisos[0]).toMatch(/SMTP/);
  });

  it("filtra produtos quando WEBHOOK_PRODUTOS_ACEITOS está definido", async () => {
    const { deps, compras } = criarDeps();
    const r = await processarCompra("kirvano", { ...aprovada, produto: "Outro curso" }, {}, deps, { produtosAceitos: ["protocolo 42"] });
    expect(r.acao).toBe("ignorada-produto");
    expect(compras.size).toBe(0);
    expect(lerProdutosAceitos(" Protocolo 42 , ,Bumbum ")).toEqual(["protocolo 42", "bumbum"]);
    expect(produtoAceito("Protocolo 42 Dias", [])).toBe(true);
  });
});
