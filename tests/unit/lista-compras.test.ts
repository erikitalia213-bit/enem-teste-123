import { describe, expect, it } from "vitest";
import { cardapioDoDia, indiceCardapio } from "@/content/cardapio";
import { formatarIngrediente, formatarQtd } from "@/lib/formatar";
import { contarReceitas, gerarListaDaSemana, gerarListaDeReceitas, ORDEM_SECOES } from "@/lib/listaCompras";

describe("cardápio", () => {
  it("repete o ciclo de 14 dias", () => {
    expect(indiceCardapio(1)).toBe(0);
    expect(indiceCardapio(14)).toBe(13);
    expect(indiceCardapio(15)).toBe(0);
    expect(indiceCardapio(42)).toBe(13);
  });

  it("aplica as trocas da fase", () => {
    // dia 4 tem iogurte-mel-aveia no lanche, trocado por patê de frango na fase 2
    expect(cardapioDoDia(4, 1).lanche).toBe("iogurte-mel-aveia");
    expect(cardapioDoDia(18, 2).lanche).toBe("pate-frango");
    expect(cardapioDoDia(29, 3).almoco).toBe("frango-assado-batata-doce");
  });
});

describe("lista de compras", () => {
  it("soma ingredientes e compra receitas inteiras", () => {
    // strogonoff (4 porções) comido 2 vezes = 1 receita; ovos mexidos 2 vezes = 6 ovos
    const lista = gerarListaDeReceitas(
      new Map([
        ["strogonoff-frango-fit", 2],
        ["ovos-mexidos-pao", 2],
      ]),
    );
    const itens = lista.flatMap((s) => s.itens);
    expect(itens.find((i) => i.chave === "peito-frango")!.quantidade).toBe("600 g");
    expect(itens.find((i) => i.chave === "ovo")!.quantidade).toBe("6 unidades");
    expect(itens.find((i) => i.chave === "pao-integral")!.quantidade).toBe("4 fatias");
    expect(itens.find((i) => i.chave === "sal")!.quantidade).toBe("a gosto");
  });

  it("5 porções de uma receita de 4 = 2 receitas", () => {
    const itens = gerarListaDeReceitas(new Map([["strogonoff-frango-fit", 5]])).flatMap((s) => s.itens);
    expect(itens.find((i) => i.chave === "peito-frango")!.quantidade).toBe("1,2 kg");
  });

  it("agrupa por seção do mercado na ordem definida, sem itens repetidos", () => {
    const lista = gerarListaDaSemana(1);
    const secoes = lista.map((s) => s.secao);
    expect(secoes).toEqual(ORDEM_SECOES.filter((s) => secoes.includes(s)));
    const chaves = lista.flatMap((s) => s.itens.map((i) => i.chave));
    expect(new Set(chaves).size).toBe(chaves.length);
    expect(chaves).toContain("ovo");
    expect(chaves).toContain("peito-frango");
  });

  it("semana conta 28 refeições", () => {
    const contagem = contarReceitas([1, 2, 3, 4, 5, 6, 7]);
    expect([...contagem.values()].reduce((a, b) => a + b, 0)).toBe(28);
  });

  it("semanas de fases diferentes geram listas diferentes", () => {
    expect(gerarListaDaSemana(1)).not.toEqual(gerarListaDaSemana(5));
  });
});

describe("formatação", () => {
  it("frações caseiras", () => {
    expect(formatarQtd(0.5)).toBe("½");
    expect(formatarQtd(1.5)).toBe("1 ½");
    expect(formatarQtd(0.25)).toBe("¼");
    expect(formatarQtd(3)).toBe("3");
  });

  it("ingredientes legíveis", () => {
    expect(formatarIngrediente({ item: "ovo", qtd: 3, unidade: "un" })).toBe("3 ovos");
    expect(formatarIngrediente({ item: "ovo", qtd: 1, unidade: "un" })).toBe("1 ovo");
    expect(formatarIngrediente({ item: "azeite", qtd: 1, unidade: "colher-sopa" })).toBe("1 colher (sopa) de azeite");
    expect(formatarIngrediente({ item: "aveia", qtd: 4, unidade: "colher-sopa" })).toBe("4 colheres (sopa) de aveia em flocos");
    expect(formatarIngrediente({ item: "carne-moida", qtd: 500, unidade: "g" })).toBe("500 g de carne moída (patinho)");
    expect(formatarIngrediente({ item: "sal", qtd: null, unidade: "a-gosto" })).toBe("Sal a gosto");
    expect(formatarIngrediente({ item: "banana", qtd: 0.5, unidade: "un", obs: "em rodelas" })).toBe("½ banana (em rodelas)");
  });
});

describe("formatarReps", () => {
  it("deixa a prescrição explícita", async () => {
    const { formatarReps } = await import("@/lib/formatar");
    expect(formatarReps("12")).toBe("12 repetições");
    expect(formatarReps("8 a 10")).toBe("8 a 10 repetições");
    expect(formatarReps("10 cada perna")).toBe("10 repetições cada perna");
    expect(formatarReps("12 passos para cada lado")).toBe("12 passos para cada lado");
  });
});
