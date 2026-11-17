import type { LocalTreino, Nivel, Objetivo } from "@/content/tipos";

/** Respostas do quiz que pré-preenchem o onboarding (todas opcionais). */
export interface RespostasQuiz {
  nome?: string;
  local?: LocalTreino;
  dias?: number;
  objetivo?: Objetivo;
  nivel?: Nivel;
}

export const CHAVE_QUIZ = "p42:quiz";

const LOCAIS: Record<string, LocalTreino> = { academia: "academia", casa: "casa", ambos: "ambos", parada: "casa" };
const OBJETIVOS: Objetivo[] = ["volume", "empinado", "firme", "flacidez"];
const NIVEIS: Record<string, Nivel> = {
  iniciante: "iniciante",
  intermediario: "intermediario",
  intermediaria: "intermediario",
  estagnada: "estagnada",
  // valores usados pelo quiz (pergunta "há quanto tempo você treina")
  menos1: "intermediario",
  mais1: "estagnada",
};

/** "  maria CLARA " → "Maria" (só o primeiro nome, até 40 letras). */
export function limparNome(valor: string | null | undefined): string | undefined {
  const primeiro = (valor ?? "").trim().split(/\s+/)[0]?.replace(/[^\p{L}'-]/gu, "").slice(0, 40);
  if (!primeiro || primeiro.length < 2) return undefined;
  return primeiro.charAt(0).toLocaleUpperCase("pt-BR") + primeiro.slice(1).toLocaleLowerCase("pt-BR");
}

/** Lê ?nome=&local=&dias=&objetivo=&nivel= (aceita também ?tempo= do quiz). */
export function lerParametrosQuiz(params: URLSearchParams): RespostasQuiz {
  const r: RespostasQuiz = {};
  const nome = limparNome(params.get("nome"));
  if (nome) r.nome = nome;
  const local = LOCAIS[(params.get("local") ?? "").toLowerCase()];
  if (local) r.local = local;
  const dias = Number(params.get("dias"));
  if (Number.isInteger(dias) && dias >= 2 && dias <= 6) r.dias = dias;
  const objetivo = (params.get("objetivo") ?? "").toLowerCase() as Objetivo;
  if (OBJETIVOS.includes(objetivo)) r.objetivo = objetivo;
  const nivel = NIVEIS[(params.get("nivel") ?? params.get("tempo") ?? "").toLowerCase()];
  if (nivel) r.nivel = nivel;
  return r;
}

export function salvarQuiz(r: RespostasQuiz) {
  if (Object.keys(r).length === 0) return;
  try {
    const atual = lerQuizSalvo();
    localStorage.setItem(CHAVE_QUIZ, JSON.stringify({ ...atual, ...r }));
  } catch {
    // localStorage indisponível (aba anônima, etc.): segue sem pré-preencher.
  }
}

export function lerQuizSalvo(): RespostasQuiz {
  try {
    const bruto = localStorage.getItem(CHAVE_QUIZ);
    if (!bruto) return {};
    const obj = JSON.parse(bruto) as Record<string, unknown>;
    return lerParametrosQuiz(new URLSearchParams(Object.entries(obj).map(([k, v]) => [k, String(v)])));
  } catch {
    return {};
  }
}
