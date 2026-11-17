import { ingredientes } from "@/content/ingredientes";
import type { IngredienteReceita, Unidade } from "@/content/tipos";

const FRACOES: Record<string, string> = { "0.25": "¼", "0.33": "⅓", "0.5": "½", "0.67": "⅔", "0.75": "¾" };

/** 0.5 → "½", 1.5 → "1 ½", 2 → "2", 1.2 → "1,2" */
export function formatarQtd(n: number): string {
  const inteiro = Math.floor(n);
  const resto = Math.round((n - inteiro) * 100) / 100;
  if (resto === 0) return String(inteiro);
  const fr = FRACOES[resto.toFixed(2).replace(/0$/, "")] ?? FRACOES[String(resto)];
  if (fr) return inteiro > 0 ? `${inteiro} ${fr}` : fr;
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

const UNIDADES: Record<Exclude<Unidade, "un" | "a-gosto">, [string, string]> = {
  g: ["g", "g"],
  ml: ["ml", "ml"],
  "colher-sopa": ["colher (sopa)", "colheres (sopa)"],
  "colher-cha": ["colher (chá)", "colheres (chá)"],
  xicara: ["xícara", "xícaras"],
  fatia: ["fatia", "fatias"],
  concha: ["concha", "conchas"],
  pote: ["pote", "potes"],
  lata: ["lata", "latas"],
  file: ["filé", "filés"],
  dente: ["dente", "dentes"],
  punhado: ["punhado", "punhados"],
  pitada: ["pitada", "pitadas"],
};

/** Rótulo da unidade concordando com a quantidade ("1 xícara", "2 xícaras"). */
export function rotuloUnidade(unidade: Exclude<Unidade, "un" | "a-gosto">, qtd: number): string {
  const [singular, plural] = UNIDADES[unidade];
  return qtd > 1 ? plural : singular;
}

export function capitalizar(texto: string): string {
  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}

/** Texto de um ingrediente na receita: "2 ovos", "1 colher (sopa) de azeite", "Sal a gosto". */
export function formatarIngrediente(ing: IngredienteReceita): string {
  const cat = ingredientes[ing.item];
  const nome = cat?.nome ?? ing.item;
  const obs = ing.obs ? ` (${ing.obs})` : "";
  if (ing.qtd === null || ing.unidade === "a-gosto") return `${capitalizar(nome)} a gosto${obs}`;
  const q = formatarQtd(ing.qtd);
  if (ing.unidade === "un") return `${q} ${ing.qtd > 1 ? (cat?.plural ?? nome) : nome}${obs}`;
  if (ing.unidade === "g" || ing.unidade === "ml") return `${q} ${ing.unidade} de ${nome}${obs}`;
  return `${q} ${rotuloUnidade(ing.unidade, ing.qtd)} de ${nome}${obs}`;
}

export function formatarTempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatarDuracaoCurta(segundos: number): string {
  if (segundos < 60) return `${segundos}s`;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return s ? `${m}min${s}s` : `${m} min`;
}

/** "12" → "12 repetições"; "10 a 12" → "10 a 12 repetições"; "10 cada perna" → "10 repetições cada perna". */
export function formatarReps(reps: string): string {
  const s = reps.trim();
  if (/^\d+( a \d+)?$/.test(s)) return `${s} repetições`;
  const m = s.match(/^(\d+( a \d+)?) (cada .+)$/);
  if (m) return `${m[1]} repetições ${m[3]}`;
  return s;
}
