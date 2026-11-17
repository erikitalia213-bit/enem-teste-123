import { cardapioDoDia } from "@/content/cardapio";
import { exigirReceita, ORDEM_REFEICOES } from "@/content/receitas";
import type { NumeroFase } from "@/content/tipos";
import type { ItemRefeicao } from "@/components/cardapio/ListaRefeicoes";

/** As 4 refeições (com a receita completa) para um dia do protocolo. */
export function refeicoesDoDia(diaProtocolo: number, fase: NumeroFase): ItemRefeicao[] {
  const c = cardapioDoDia(diaProtocolo, fase);
  return ORDEM_REFEICOES.map((refeicao) => ({ refeicao, receita: exigirReceita(c[refeicao]) }));
}
