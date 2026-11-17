import type { DiaCardapio, NumeroFase, Refeicao } from "./tipos";

/**
 * Cardápio sugerido de 14 dias, repetido ao longo das 6 semanas.
 * Receitas "marmita" aparecem em dias seguidos de propósito: cozinha uma vez, come duas.
 *
 * Variação entre fases: na Fase 2 e na Fase 3 algumas receitas são trocadas
 * (veja `trocasPorFase`). Para mudar, basta editar os ids abaixo.
 */
export const cardapio14Dias: DiaCardapio[] = [
  /* 1 */ { cafe: "ovos-mexidos-pao", almoco: "strogonoff-frango-fit", lanche: "muffin-ovo", jantar: "omelete-recheada" },
  /* 2 */ { cafe: "overnight-oats", almoco: "strogonoff-frango-fit", lanche: "muffin-ovo", jantar: "sopa-frango-legumes" },
  /* 3 */ { cafe: "crepioca-queijo", almoco: "frango-arroz-feijao", lanche: "muffin-ovo", jantar: "wrap-frango" },
  /* 4 */ { cafe: "panqueca-banana-aveia", almoco: "carne-moida-abobrinha", lanche: "iogurte-mel-aveia", jantar: "sopa-frango-legumes" },
  /* 5 */ { cafe: "cuscuz-ovo", almoco: "carne-moida-abobrinha", lanche: "sanduiche-atum", jantar: "tilapia-pure-abobora" },
  /* 6 */ { cafe: "tapioca-frango", almoco: "tilapia-legumes", lanche: "ovos-cozidos-maca", jantar: "mexidao-carne-ovo" },
  /* 7 */ { cafe: "pao-frances-ovo", almoco: "tilapia-legumes", lanche: "bolo-caneca", jantar: "mexidao-carne-ovo" },
  /* 8 */ { cafe: "omelete-espinafre", almoco: "escondidinho-batata-doce", lanche: "pao-amendoim-leite", jantar: "panqueca-frango" },
  /* 9 */ { cafe: "iogurte-amendoim-morango", almoco: "escondidinho-batata-doce", lanche: "wrap-peru", jantar: "salada-completa-frango" },
  /* 10 */ { cafe: "sanduiche-peru-queijo", almoco: "frango-xadrez", lanche: "vitamina-morango-iogurte", jantar: "caldinho-feijao-ovo" },
  /* 11 */ { cafe: "mingau-aveia", almoco: "frango-xadrez", lanche: "pao-queijo-frigideira", jantar: "batata-doce-atum" },
  /* 12 */ { cafe: "ovos-mexidos-pao", almoco: "picadinho-carne", lanche: "ovos-cozidos-maca", jantar: "pizza-frigideira" },
  /* 13 */ { cafe: "vitamina-banana", almoco: "picadinho-carne", lanche: "iogurte-mel-aveia", jantar: "cuscuz-frango" },
  /* 14 */ { cafe: "crepioca-queijo", almoco: "salada-grao-de-bico-atum", lanche: "sanduiche-atum", jantar: "sardinha-salada-batata" },
];

/** Trocas simples por fase: { receita original → receita da fase }. */
export const trocasPorFase: Record<NumeroFase, Record<string, string>> = {
  1: {},
  2: {
    // Construção: mais proteína nos lanches e almoços novos para não enjoar
    "iogurte-mel-aveia": "pate-frango",
    "bolo-caneca": "ovos-cozidos-maca",
    "carne-moida-abobrinha": "macarrao-bolonhesa",
    "frango-arroz-feijao": "bife-acebolado",
  },
  3: {
    // Reta final: jantares mais leves e almoços com bastante proteína
    "strogonoff-frango-fit": "frango-assado-batata-doce",
    "escondidinho-batata-doce": "arroz-forno-frango",
    "pao-queijo-frigideira": "pate-frango",
    "vitamina-morango-iogurte": "wrap-peru",
    "caldinho-feijao-ovo": "tilapia-pure-abobora",
    "pizza-frigideira": "omelete-recheada",
  },
};

/** Índice 0..13 do cardápio para um dia do protocolo (1..42). */
export function indiceCardapio(diaProtocolo: number): number {
  return (((diaProtocolo - 1) % 14) + 14) % 14;
}

/** Cardápio de um dia do protocolo, já com as trocas da fase. */
export function cardapioDoDia(diaProtocolo: number, fase: NumeroFase): DiaCardapio {
  const base = cardapio14Dias[indiceCardapio(diaProtocolo)]!;
  const trocas = trocasPorFase[fase];
  const trocar = (id: string) => trocas[id] ?? id;
  return { cafe: trocar(base.cafe), almoco: trocar(base.almoco), lanche: trocar(base.lanche), jantar: trocar(base.jantar) };
}

export function receitaDaRefeicao(dia: DiaCardapio, refeicao: Refeicao): string {
  return dia[refeicao];
}
