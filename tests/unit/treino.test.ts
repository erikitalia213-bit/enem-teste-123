import { describe, expect, it } from "vitest";
import { obterTreinoBase, treinosBase } from "@/content/protocolo";
import { montarTreino, resolverVersao } from "@/lib/protocolo/montarTreino";
import { calcularSequencia, estadoDoDia, progressoDaFase } from "@/lib/protocolo/progresso";
import { gerarCalendario } from "@/lib/protocolo/calendario";
import { validarConteudo } from "@/lib/validarConteudo";

describe("conteúdo", () => {
  it("passa na validação", () => {
    expect(validarConteudo()).toEqual([]);
  });

  it("tem 24 treinos com versões academia e casa", () => {
    expect(treinosBase).toHaveLength(24);
    for (const fase of [1, 2, 3] as const)
      for (const letra of ["A", "B", "C", "D"] as const) {
        expect(obterTreinoBase(fase, letra, "academia").base).toBe(`f${fase}-${letra}`);
        expect(obterTreinoBase(fase, letra, "casa").id).toBe(`f${fase}-${letra}-casa`);
      }
  });
});

describe("montarTreino por nível", () => {
  it("iniciante faz uma série a menos na fase 1 (mínimo 2)", () => {
    const inter = montarTreino(1, "A", "academia", "intermediario");
    const ini = montarTreino(1, "A", "academia", "iniciante");
    inter.itens.forEach((it, i) => {
      const esperado = it.series >= 3 ? Math.max(2, it.series - 1) : it.series;
      expect(ini.itens[i]!.series).toBe(esperado);
    });
    expect(ini.itens[0]!.series).toBe(2);
  });

  it("iniciante não perde séries a partir da fase 2", () => {
    expect(montarTreino(2, "A", "casa", "iniciante").itens).toEqual(montarTreino(2, "A", "casa", "intermediario").itens);
  });

  it("estagnada recebe técnicas avançadas a partir da fase 2", () => {
    const f1 = montarTreino(1, "A", "academia", "estagnada");
    expect(f1.itens.some((i) => i.tecnica)).toBe(false);
    const f2 = montarTreino(2, "A", "academia", "estagnada");
    const f2Normal = montarTreino(2, "A", "academia", "intermediario");
    expect(f2.itens.filter((i) => i.tecnica).length).toBeGreaterThan(f2Normal.itens.filter((i) => i.tecnica).length);
    expect(f2.itens[0]!.tecnica).toMatch(/Pausa/);
  });

  it("fase 3 tem técnicas para todas", () => {
    expect(montarTreino(3, "A", "casa", "intermediario").itens.some((i) => i.tecnica)).toBe(true);
  });

  it("não vaza o campo interno tecnicaSeEstagnada", () => {
    const t = montarTreino(2, "B", "academia", "estagnada");
    for (const it of t.itens) expect(Object.keys(it)).not.toContain("tecnicaSeEstagnada");
  });

  it("resolverVersao respeita o local e a escolha do dia", () => {
    expect(resolverVersao("casa")).toBe("casa");
    expect(resolverVersao("academia", "casa")).toBe("academia");
    expect(resolverVersao("ambos", "casa")).toBe("casa");
    expect(resolverVersao("ambos")).toBe("academia");
  });
});

describe("progresso", () => {
  it("sequência conta dias seguidos e não quebra se hoje ainda não foi feito", () => {
    expect(calcularSequencia(new Set([1, 2, 3]), 4)).toBe(3);
    expect(calcularSequencia(new Set([1, 2, 3, 4]), 4)).toBe(4);
    expect(calcularSequencia(new Set([1, 3, 4]), 5)).toBe(2);
    expect(calcularSequencia(new Set([1, 2]), 5)).toBe(0);
    expect(calcularSequencia(new Set(), 1)).toBe(0);
  });

  it("medalha da fase só com todos os treinos da fase concluídos", () => {
    const cal = gerarCalendario({ dataInicio: "2026-11-16", diasSemana: 3, localTreino: "casa" });
    const treinosF1 = cal.filter((d) => d.fase === 1 && d.tipo === "treino").map((d) => d.dia);
    const quase = new Set(treinosF1.slice(1));
    expect(progressoDaFase(cal, quase, 1, 14).medalha).toBe(false);
    const tudo = new Set(treinosF1);
    const p = progressoDaFase(cal, tudo, 1, 14);
    expect(p.medalha).toBe(true);
    expect(p.pctTreinos).toBe(1);
    expect(p.totalTreinos).toBe(6);
  });

  it("estado do dia: futuros bloqueados", () => {
    const feitos = new Set([1]);
    expect(estadoDoDia(1, 3, feitos)).toBe("concluido");
    expect(estadoDoDia(2, 3, feitos)).toBe("perdido");
    expect(estadoDoDia(3, 3, feitos)).toBe("hoje");
    expect(estadoDoDia(4, 3, feitos)).toBe("bloqueado");
  });
});
