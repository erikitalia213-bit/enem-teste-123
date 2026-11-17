import { describe, expect, it } from "vitest";
import {
  configNoDia,
  diaDoProtocolo,
  faseDoDia,
  gerarCalendario,
  lerAjustes,
  registrarAjuste,
  type ConfigPlano,
} from "@/lib/protocolo/calendario";
import { diaDaSemana } from "@/lib/datas";

// 2026-11-16 é uma segunda-feira
const SEGUNDA = "2026-11-16";
const QUARTA = "2026-11-18";

function cfg(parcial: Partial<ConfigPlano> = {}): ConfigPlano {
  return { dataInicio: SEGUNDA, diasSemana: 3, localTreino: "academia", ...parcial };
}

describe("gerarCalendario", () => {
  it("gera 42 dias consecutivos começando na data de início", () => {
    const cal = gerarCalendario(cfg());
    expect(cal).toHaveLength(42);
    expect(cal[0]!.data).toBe(SEGUNDA);
    expect(cal[41]!.data).toBe("2026-12-27");
    expect(cal.map((d) => d.dia)).toEqual(Array.from({ length: 42 }, (_, i) => i + 1));
  });

  it("divide em 6 semanas e 3 fases de 14 dias", () => {
    const cal = gerarCalendario(cfg());
    expect(cal.filter((d) => d.fase === 1)).toHaveLength(14);
    expect(cal.filter((d) => d.fase === 2)).toHaveLength(14);
    expect(cal.filter((d) => d.fase === 3)).toHaveLength(14);
    expect(cal[13]!.semana).toBe(2);
    expect(cal[14]!.semana).toBe(3);
    expect(faseDoDia(28)).toBe(2);
    expect(faseDoDia(29)).toBe(3);
  });

  const mapas: Record<number, number[]> = {
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
  };

  for (const [dias, semana] of Object.entries(mapas)) {
    it(`${dias} dias por semana treina nos dias certos e o resto é descanso ativo`, () => {
      const cal = gerarCalendario(cfg({ diasSemana: Number(dias), dataInicio: QUARTA }));
      for (const d of cal) {
        const deveTreinar = semana.includes(diaDaSemana(d.data));
        expect(d.tipo).toBe(deveTreinar ? "treino" : "descanso");
        if (d.tipo === "descanso") {
          expect(d.letra).toBeNull();
          expect(d.base).toBe("descanso-ativo");
        }
      }
      // 6 semanas × N treinos (o início numa quarta não muda o total de 42 dias corridos)
      expect(cal.filter((d) => d.tipo === "treino")).toHaveLength(Number(dias) * 6);
    });
  }

  it("2 e 3 dias usam rodízio A, B, C; 4+ dias usam A, B, C, D", () => {
    const tres = gerarCalendario(cfg({ diasSemana: 3 })).filter((d) => d.tipo === "treino");
    expect(tres.slice(0, 6).map((d) => d.letra)).toEqual(["A", "B", "C", "A", "B", "C"]);
    expect(tres.some((d) => d.letra === "D")).toBe(false);

    const dois = gerarCalendario(cfg({ diasSemana: 2 })).filter((d) => d.tipo === "treino");
    expect(dois.slice(0, 4).map((d) => d.letra)).toEqual(["A", "B", "C", "A"]);

    const quatro = gerarCalendario(cfg({ diasSemana: 4 })).filter((d) => d.tipo === "treino");
    expect(quatro.slice(0, 4).map((d) => d.letra)).toEqual(["A", "B", "C", "D"]);

    const seis = gerarCalendario(cfg({ diasSemana: 6 })).filter((d) => d.tipo === "treino");
    expect(seis.slice(0, 6).map((d) => d.letra)).toEqual(["A", "B", "C", "D", "A", "B"]);
  });

  it("cada fase recomeça pelo treino A e usa os treinos da própria fase", () => {
    const cal = gerarCalendario(cfg({ diasSemana: 5 }));
    for (const fase of [1, 2, 3] as const) {
      const primeiro = cal.find((d) => d.fase === fase && d.tipo === "treino")!;
      expect(primeiro.letra).toBe("A");
      expect(primeiro.base).toBe(`f${fase}-A`);
    }
    expect(cal.filter((d) => d.tipo === "treino").every((d) => d.base === `f${d.fase}-${d.letra}`)).toBe(true);
  });

  it("é determinístico", () => {
    expect(gerarCalendario(cfg({ diasSemana: 4 }))).toEqual(gerarCalendario(cfg({ diasSemana: 4 })));
  });
});

describe("ajustes no meio do protocolo", () => {
  it("mudar de 3 para 5 dias no dia 15 preserva os 14 primeiros dias", () => {
    const original = gerarCalendario(cfg({ diasSemana: 3 }));
    const ajustes = registrarAjuste({ diasSemana: 3, localTreino: "academia", ajustes: [] }, { diasSemana: 5, localTreino: "casa" }, 15);
    expect(ajustes).toEqual([
      { desde_dia: 1, dias_semana: 3, local_treino: "academia" },
      { desde_dia: 15, dias_semana: 5, local_treino: "casa" },
    ]);
    // O perfil passa a guardar a configuração nova; os ajustes guardam o histórico.
    const novo = gerarCalendario(cfg({ diasSemana: 5, localTreino: "casa", ajustes }));
    expect(novo.slice(0, 14)).toEqual(original.slice(0, 14));
    expect(novo.slice(14).filter((d) => d.tipo === "treino")).toHaveLength(5 * 4);
    expect(novo[20]!.local).toBe("casa");
    expect(novo[0]!.local).toBe("academia");
  });

  it("ajuste no dia 1 não cria histórico (só troca a configuração)", () => {
    expect(registrarAjuste({ diasSemana: 3, localTreino: "academia", ajustes: [] }, { diasSemana: 4, localTreino: "casa" }, 1)).toEqual([]);
  });

  it("dois ajustes no mesmo dia mantêm só o último daquele dia", () => {
    const a1 = registrarAjuste({ diasSemana: 3, localTreino: "academia", ajustes: [] }, { diasSemana: 4, localTreino: "academia" }, 10);
    const a2 = registrarAjuste({ diasSemana: 4, localTreino: "academia", ajustes: a1 }, { diasSemana: 6, localTreino: "ambos" }, 10);
    expect(a2).toEqual([
      { desde_dia: 1, dias_semana: 3, local_treino: "academia" },
      { desde_dia: 10, dias_semana: 6, local_treino: "ambos" },
    ]);
    expect(configNoDia(cfg({ diasSemana: 6, localTreino: "ambos", ajustes: a2 }), 9)).toEqual({ diasSemana: 3, local: "academia" });
    expect(configNoDia(cfg({ diasSemana: 6, localTreino: "ambos", ajustes: a2 }), 10)).toEqual({ diasSemana: 6, local: "ambos" });
  });

  it("lerAjustes ignora lixo e ordena", () => {
    expect(
      lerAjustes([{ desde_dia: 20, dias_semana: 4, local_treino: "casa" }, { foo: 1 }, { desde_dia: 1, dias_semana: 3, local_treino: "academia" }]),
    ).toEqual([
      { desde_dia: 1, dias_semana: 3, local_treino: "academia" },
      { desde_dia: 20, dias_semana: 4, local_treino: "casa" },
    ]);
    expect(lerAjustes(null)).toEqual([]);
  });
});

describe("diaDoProtocolo", () => {
  it("conta a partir de 1 na data de início", () => {
    expect(diaDoProtocolo(SEGUNDA, SEGUNDA)).toBe(1);
    expect(diaDoProtocolo(SEGUNDA, "2026-11-17")).toBe(2);
    expect(diaDoProtocolo(SEGUNDA, "2026-12-27")).toBe(42);
    expect(diaDoProtocolo(SEGUNDA, "2026-12-28")).toBe(43);
  });
});
