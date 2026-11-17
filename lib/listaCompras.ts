import { cardapioDoDia } from "@/content/cardapio";
import { ingredientes } from "@/content/ingredientes";
import { exigirReceita, ORDEM_REFEICOES } from "@/content/receitas";
import type { NumeroFase, SecaoMercado, Unidade } from "@/content/tipos";
import { capitalizar, formatarQtd, rotuloUnidade } from "./formatar";
import { faseDoDia } from "./protocolo/calendario";

export const ORDEM_SECOES: SecaoMercado[] = [
  "Hortifrúti",
  "Açougue e peixaria",
  "Ovos, frios e laticínios",
  "Padaria",
  "Grãos e cereais",
  "Mercearia",
  "Temperos e óleos",
];

export interface ItemLista {
  /** Chave estável (usada no checkbox salvo no localStorage). */
  chave: string;
  nome: string;
  quantidade: string;
  dica?: string;
}

export interface SecaoLista {
  secao: SecaoMercado;
  itens: ItemLista[];
}

/** Unidades compradas inteiras: arredonda para cima. */
const UNIDADES_INTEIRAS: Unidade[] = ["un", "lata", "pote", "file", "dente"];

function arredondar(qtd: number, unidade: Unidade): number {
  if (UNIDADES_INTEIRAS.includes(unidade)) return Math.ceil(qtd - 1e-9);
  if (unidade === "g" || unidade === "ml") return Math.ceil(qtd / 50) * 50;
  return Math.ceil(qtd * 4 - 1e-9) / 4; // múltiplos de ¼
}

function formatarQuantidadeLista(qtd: number, unidade: Unidade): string {
  if (unidade === "a-gosto") return "a gosto";
  if (unidade === "un") return `${formatarQtd(qtd)} ${qtd > 1 ? "unidades" : "unidade"}`;
  if (unidade === "g") return qtd >= 1000 ? `${(qtd / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg` : `${qtd} g`;
  if (unidade === "ml") return qtd >= 1000 ? `${(qtd / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} L` : `${qtd} ml`;
  return `${formatarQtd(qtd)} ${rotuloUnidade(unidade, qtd)}`;
}

/** Quantas vezes cada receita aparece nos dias informados. */
export function contarReceitas(dias: number[], fasePorDia: (dia: number) => NumeroFase = faseDoDia): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const dia of dias) {
    const c = cardapioDoDia(dia, fasePorDia(dia));
    for (const r of ORDEM_REFEICOES) contagem.set(c[r], (contagem.get(c[r]) ?? 0) + 1);
  }
  return contagem;
}

/**
 * Gera a lista de compras a partir das receitas e de quantas vezes cada uma aparece.
 * Receitas que rendem várias porções são compradas em "receitas inteiras"
 * (ex.: strogonoff de 4 porções comido 2 vezes = 1 receita).
 */
export function gerarListaDeReceitas(contagem: Map<string, number>): SecaoLista[] {
  const soma = new Map<string, { item: string; unidade: Unidade; qtd: number }>();

  for (const [id, vezes] of contagem) {
    const receita = exigirReceita(id);
    const lotes = Math.ceil(vezes / receita.porcoes);
    for (const ing of receita.ingredientes) {
      const chave = `${ing.item}|${ing.unidade}`;
      const atual = soma.get(chave) ?? { item: ing.item, unidade: ing.unidade, qtd: 0 };
      atual.qtd += (ing.qtd ?? 0) * lotes;
      soma.set(chave, atual);
    }
  }

  const porItem = new Map<string, string[]>();
  for (const { item, unidade, qtd } of soma.values()) {
    const texto = formatarQuantidadeLista(arredondar(qtd, unidade), unidade);
    porItem.set(item, [...(porItem.get(item) ?? []), texto]);
  }

  const secoes = new Map<SecaoMercado, ItemLista[]>();
  for (const [item, textos] of porItem) {
    const cat = ingredientes[item]!;
    const textosUnicos = [...new Set(textos)];
    const quantidade = textosUnicos.length > 1 ? textosUnicos.filter((t) => t !== "a gosto").join(" + ") : textosUnicos[0]!;
    const linha: ItemLista = { chave: item, nome: capitalizar(cat.nome), quantidade };
    if (cat.dica) linha.dica = cat.dica;
    secoes.set(cat.secao, [...(secoes.get(cat.secao) ?? []), linha]);
  }

  return ORDEM_SECOES.filter((s) => secoes.has(s)).map((secao) => ({
    secao,
    itens: secoes.get(secao)!.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
  }));
}

/** Lista de compras de uma semana do protocolo (1 a 6). */
export function gerarListaDaSemana(semana: number): SecaoLista[] {
  const s = Math.min(6, Math.max(1, Math.round(semana)));
  const dias = Array.from({ length: 7 }, (_, k) => (s - 1) * 7 + k + 1);
  return gerarListaDeReceitas(contarReceitas(dias));
}

export function chaveStorageLista(semana: number): string {
  return `p42:lista-compras:semana-${semana}`;
}
