import { describe, expect, it } from "vitest";
import { lerParametrosQuiz, limparNome } from "@/lib/quiz";

describe("parâmetros do quiz", () => {
  it("lê todos os campos válidos", () => {
    expect(lerParametrosQuiz(new URLSearchParams("nome=maria%20clara&local=ambos&dias=4&objetivo=empinado&nivel=estagnada"))).toEqual({
      nome: "Maria",
      local: "ambos",
      dias: 4,
      objetivo: "empinado",
      nivel: "estagnada",
    });
  });

  it("aceita os valores do quiz (parada, menos1, mais1, tempo=)", () => {
    expect(lerParametrosQuiz(new URLSearchParams("local=parada&tempo=menos1"))).toEqual({ local: "casa", nivel: "intermediario" });
    expect(lerParametrosQuiz(new URLSearchParams("nivel=mais1"))).toEqual({ nivel: "estagnada" });
  });

  it("descarta valores inválidos", () => {
    expect(lerParametrosQuiz(new URLSearchParams("nome=a&local=praia&dias=9&objetivo=x&nivel=pro"))).toEqual({});
  });

  it("limpa o nome", () => {
    expect(limparNome("  JOANA d'arc ")).toBe("Joana");
    expect(limparNome("<script>")).toBe("Script");
    expect(limparNome("")).toBeUndefined();
  });
});
