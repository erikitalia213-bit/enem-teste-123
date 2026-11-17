import type {
  Fase,
  ItemTreino,
  LetraTreino,
  Nivel,
  NumeroFase,
  Objetivo,
  RotinaDescanso,
  Treino,
  VersaoTreino,
} from "./tipos";

/**
 * Protocolo de 42 dias = 6 semanas, 3 fases.
 *
 * Cada treino é escrito UMA vez com o exercício da academia e o equivalente de casa
 * lado a lado (`academia` / `casa`). As duas versões são geradas automaticamente.
 * Ajustes por nível (iniciante / estagnada) são aplicados em lib/protocolo/montarTreino.ts.
 */

export const fases: Fase[] = [
  {
    numero: 1,
    nome: "Ativação",
    semanas: [1, 2],
    resumo: "Técnica perfeita, glúteo acordado e conexão mente-músculo. Carga leve e descida lenta.",
    foco: ["Técnica e postura", "Ativação do glúteo", "Cargas leves", "3 segundos na descida"],
    medalha: "Medalha Ativação",
  },
  {
    numero: 2,
    nome: "Construção",
    semanas: [3, 4],
    resumo: "Hora de construir: mais séries, mais carga e exercícios compostos.",
    foco: ["Progressão de carga", "Mais volume", "Exercícios compostos", "Descanso bem cronometrado"],
    medalha: "Medalha Construção",
  },
  {
    numero: 3,
    nome: "Reta final",
    semanas: [5, 6],
    resumo: "Intensidade máxima com técnicas avançadas. Foco total em chegar no Réveillon.",
    foco: ["Pausas", "Drop set simples", "Unilateral", "Isometria"],
    medalha: "Medalha Reta final",
  },
];

export const NOME_TREINO: Record<LetraTreino, string> = {
  A: "Glúteo máximo e posterior",
  B: "Glúteo médio e unilateral",
  C: "Glúteo completo e quadríceps leve",
  D: "Ativação + metabólico",
};

export const DICA_OBJETIVO: Record<Objetivo, string> = {
  volume: "Seu foco é volume: priorize aumentar a carga nos exercícios principais sempre que completar as séries.",
  empinado: "Seu foco é empinar: capriche no aperto do glúteo no topo da elevação pélvica e do coice.",
  firme: "Seu foco é firmeza: respeite os descansos curtos e mantenha a tensão o tempo todo, sem relaxar entre as repetições.",
  flacidez: "Seu foco é flacidez: constância é tudo. Não pule o treino D nem o descanso ativo, e siga o cardápio rico em proteína.",
};

// ---------------------------------------------------------------------------
// Cadências padrão
// ---------------------------------------------------------------------------
const C1 = "3s descendo · 1s de pausa · sobe controlando";
const C2 = "2s descendo · sobe com força";
const C3 = "2s descendo · sobe explodindo · aperta 1s em cima";
const ISO = "Segure a posição apertando o glúteo";
const CIRC = "Ritmo constante, sem perder a técnica";

// ---------------------------------------------------------------------------
// Estrutura de definição (academia + casa na mesma linha)
// ---------------------------------------------------------------------------
interface DefItem {
  academia: string;
  casa: string;
  series: number;
  reps?: string;
  /** Repetições na versão de casa, quando diferentes. */
  repsCasa?: string;
  tempoSeg?: number;
  descansoSeg: number;
  cadencia: string;
  progressao: string;
  /** Técnica avançada aplicada para todas as alunas. */
  tecnica?: string;
  /** Técnica avançada aplicada só para o nível "estagnada". */
  tecnicaSeEstagnada?: string;
}

interface DefTreino {
  fase: NumeroFase;
  letra: LetraTreino;
  aquecimento: string[];
  itens: DefItem[];
}

const AQUEC_PADRAO = [
  "Ativação de glúteo em 5 minutos (está no primeiro card de exercícios da biblioteca).",
  "10 agachamentos sem peso, bem lentos.",
  "1 série leve (metade da carga) do primeiro exercício.",
];

const AQUEC_D = ["O próprio treino começa com a ativação de 5 minutos.", "Tenha água por perto: o ritmo é acelerado."];

const definicoes: DefTreino[] = [
  // =========================================================================
  // FASE 1 — ATIVAÇÃO
  // =========================================================================
  {
    fase: 1,
    letra: "A",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "hip-thrust-barra",
        casa: "hip-thrust-mochila",
        series: 3,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Quando fizer todas as repetições com técnica perfeita, aumente 2 a 5 kg (em casa: mais peso na mochila).",
      },
      {
        academia: "stiff",
        casa: "stiff-unilateral",
        series: 3,
        reps: "12",
        repsCasa: "10 cada perna",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Só aumente o peso quando a coluna ficar reta em todas as repetições.",
      },
      {
        academia: "extensao-quadril-banco-45",
        casa: "coice-elastico-4-apoios",
        series: 3,
        reps: "15",
        repsCasa: "15 cada perna",
        descansoSeg: 60,
        cadencia: C1,
        progressao: "Semana 1: segure 1s no topo. Semana 2: segure 2s.",
      },
      {
        academia: "mesa-flexora",
        casa: "flexora-toalha",
        series: 3,
        reps: "12",
        repsCasa: "10",
        descansoSeg: 60,
        cadencia: C1,
        progressao: "Completou as 3 séries? Suba 1 placa no próximo treino A (em casa: faça 2 repetições a mais).",
      },
      {
        academia: "frog-pump",
        casa: "frog-pump",
        series: 2,
        reps: "20",
        repsCasa: "25",
        descansoSeg: 45,
        cadencia: CIRC,
        progressao: "Semana 2: some 5 repetições em cada série.",
      },
    ],
  },
  {
    fase: 1,
    letra: "B",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "abducao-maquina",
        casa: "abducao-elastico-sentada",
        series: 3,
        reps: "15",
        repsCasa: "20",
        descansoSeg: 60,
        cadencia: C1,
        progressao: "Aumente uma placa quando a última repetição ainda sair controlada (em casa: elástico mais forte).",
      },
      {
        academia: "agachamento-bulgaro",
        casa: "agachamento-bulgaro",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Semana 1 sem peso. Semana 2 com halteres leves (em casa: mochila nas costas).",
      },
      {
        academia: "step-up-banco",
        casa: "step-up-banco",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 60,
        cadencia: C1,
        progressao: "Domine a descida de 3 segundos antes de colocar peso.",
      },
      {
        academia: "abducao-quadril-cabo",
        casa: "abducao-elastico-deitada",
        series: 3,
        reps: "12 cada perna",
        repsCasa: "15 cada perna",
        descansoSeg: 45,
        cadencia: C1,
        progressao: "Quando ficar fácil, segure 2s com a perna no alto em cada repetição.",
      },
      {
        academia: "clam-shell",
        casa: "clam-shell",
        series: 2,
        reps: "15 cada lado",
        descansoSeg: 30,
        cadencia: C1,
        progressao: "Semana 2: use um elástico mais forte ou some 5 repetições.",
      },
    ],
  },
  {
    fase: 1,
    letra: "C",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "agachamento-goblet",
        casa: "agachamento-goblet",
        series: 3,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Aumente o halter (em casa: mais peso na mochila) quando descer fundo com o peito aberto.",
      },
      {
        academia: "agachamento-sumo",
        casa: "agachamento-sumo",
        series: 3,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Semana 2: aumente 2 a 4 kg ou faça a descida em 4 segundos.",
      },
      {
        academia: "leg-press-pes-altos",
        casa: "agachamento-pausa",
        series: 3,
        reps: "12",
        descansoSeg: 75,
        cadencia: C1,
        progressao: "Aumente a carga só se o bumbum continuar colado no banco (em casa: segure a mochila).",
      },
      {
        academia: "passada-para-tras",
        casa: "passada-para-tras",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 60,
        cadencia: C1,
        progressao: "Semana 2: segure halteres leves ou a mochila.",
      },
      {
        academia: "coice-polia",
        casa: "kickback-pe-elastico",
        series: 3,
        reps: "12 cada perna",
        repsCasa: "15 cada perna",
        descansoSeg: 45,
        cadencia: C1,
        progressao: "Aumente a carga sem perder a pausa de 1s lá atrás.",
      },
    ],
  },
  {
    fase: 1,
    letra: "D",
    aquecimento: AQUEC_D,
    itens: [
      {
        academia: "ativacao-5-minutos",
        casa: "ativacao-5-minutos",
        series: 1,
        tempoSeg: 300,
        descansoSeg: 60,
        cadencia: "Movimentos controlados, sem pressa",
        progressao: "Faça antes de todo treino.",
      },
      {
        academia: "agachamento-sumo",
        casa: "agachamento-sumo",
        series: 3,
        reps: "15",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Semana 2: some 3 repetições por série.",
      },
      {
        academia: "glute-bridge-unilateral",
        casa: "glute-bridge-unilateral",
        series: 3,
        reps: "12 cada perna",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Semana 2: segure 2s no topo.",
      },
      {
        academia: "caminhada-lateral-elastico",
        casa: "caminhada-lateral-elastico",
        series: 3,
        reps: "12 passos para cada lado",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Semana 2: desça um pouco mais o meio agachamento.",
      },
      {
        academia: "coice-polia",
        casa: "coice-elastico-4-apoios",
        series: 3,
        reps: "15 cada perna",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Mantenha a carga e reduza o descanso para 20s na semana 2.",
      },
      {
        academia: "ponte-isometria",
        casa: "ponte-isometria",
        series: 3,
        tempoSeg: 30,
        descansoSeg: 45,
        cadencia: ISO,
        progressao: "Semana 2: 40 segundos por série.",
      },
    ],
  },

  // =========================================================================
  // FASE 2 — CONSTRUÇÃO
  // =========================================================================
  {
    fase: 2,
    letra: "A",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "hip-thrust-barra",
        casa: "hip-thrust-mochila",
        series: 4,
        reps: "8 a 10",
        repsCasa: "12 a 15",
        descansoSeg: 90,
        cadencia: C2,
        progressao: "Completou as 4 séries no número de cima? Aumente a carga no próximo treino A.",
        tecnicaSeEstagnada: "Pausa de 3 segundos no topo em todas as repetições da última série.",
      },
      {
        academia: "stiff",
        casa: "stiff-unilateral",
        series: 4,
        reps: "10",
        repsCasa: "10 cada perna",
        descansoSeg: 90,
        cadencia: C2,
        progressao: "Suba 2 a 4 kg por semana mantendo a barra rente às pernas.",
      },
      {
        academia: "good-morning",
        casa: "good-morning",
        series: 3,
        reps: "12",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Carga leve a moderada. Aumente só se a coluna continuar neutra.",
      },
      {
        academia: "extensao-quadril-banco-45",
        casa: "coice-elastico-4-apoios",
        series: 3,
        reps: "12",
        repsCasa: "15 cada perna",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Segure uma anilha no peito (em casa: elástico mais forte).",
        tecnicaSeEstagnada: "Drop set simples na última série: ao chegar perto da falha, tire o peso (em casa: afrouxe o elástico) e faça mais 8.",
      },
      {
        academia: "mesa-flexora",
        casa: "flexora-toalha",
        series: 3,
        reps: "10",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Aumente 1 placa por semana (em casa: tente com uma perna só nas 2 últimas repetições).",
      },
      {
        academia: "frog-pump",
        casa: "frog-pump",
        series: 2,
        reps: "25",
        repsCasa: "30",
        descansoSeg: 45,
        cadencia: CIRC,
        progressao: "Coloque um peso leve sobre o quadril se ficar fácil.",
      },
    ],
  },
  {
    fase: 2,
    letra: "B",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "agachamento-bulgaro",
        casa: "agachamento-bulgaro",
        series: 4,
        reps: "10 cada perna",
        repsCasa: "12 cada perna",
        descansoSeg: 90,
        cadencia: C2,
        progressao: "Halteres (em casa: mochila). Aumente o peso quando completar as 4 séries.",
        tecnicaSeEstagnada: "1 segundo de pausa embaixo em todas as repetições.",
      },
      {
        academia: "abducao-maquina",
        casa: "abducao-elastico-sentada",
        series: 4,
        reps: "15",
        repsCasa: "20",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Uma placa a mais por semana (em casa: elástico mais forte).",
        tecnicaSeEstagnada: "Drop set simples na última série: reduza a carga pela metade e continue até não conseguir mais.",
      },
      {
        academia: "stiff-unilateral",
        casa: "stiff-unilateral",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 75,
        cadencia: C2,
        progressao: "Use o mesmo peso dos dois lados, mesmo que um seja mais fraco.",
      },
      {
        academia: "afundo-lateral",
        casa: "afundo-lateral",
        series: 3,
        reps: "10 cada lado",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Segure um halter (em casa: a mochila) junto ao peito.",
      },
      {
        academia: "abducao-quadril-cabo",
        casa: "abducao-elastico-deitada",
        series: 3,
        reps: "12 cada perna",
        repsCasa: "20 cada perna",
        descansoSeg: 45,
        cadencia: C2,
        progressao: "Aumente a carga mantendo o tronco parado.",
      },
      {
        academia: "caminhada-lateral-elastico",
        casa: "caminhada-lateral-elastico",
        series: 2,
        reps: "15 passos para cada lado",
        descansoSeg: 45,
        cadencia: CIRC,
        progressao: "Passe o elástico para o tornozelo.",
      },
    ],
  },
  {
    fase: 2,
    letra: "C",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "agachamento-pausa",
        casa: "agachamento-pausa",
        series: 4,
        reps: "8",
        repsCasa: "12",
        descansoSeg: 90,
        cadencia: "3s descendo · 2s de pausa · sobe com força",
        progressao: "Na academia use barra ou halteres. Aumente a carga a cada semana completa.",
        tecnicaSeEstagnada: "Pausa de 3 segundos embaixo em vez de 2.",
      },
      {
        academia: "leg-press-pes-altos",
        casa: "agachamento-goblet",
        series: 4,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 90,
        cadencia: C2,
        progressao: "Aumente 10 kg (em casa: mais peso na mochila) quando completar as 4 séries.",
      },
      {
        academia: "agachamento-sumo",
        casa: "agachamento-sumo",
        series: 3,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 75,
        cadencia: C2,
        progressao: "Use degraus embaixo dos pés para descer mais fundo.",
      },
      {
        academia: "step-up-banco",
        casa: "step-up-banco",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 60,
        cadencia: C2,
        progressao: "Segure halteres (em casa: mochila) e mantenha a descida lenta.",
      },
      {
        academia: "hip-thrust-barra",
        casa: "hip-thrust-chao",
        series: 3,
        reps: "12",
        repsCasa: "15",
        descansoSeg: 75,
        cadencia: C2,
        progressao: "Carga moderada: aqui o foco é o aperto no topo, não o recorde.",
      },
      {
        academia: "coice-polia",
        casa: "kickback-pe-elastico",
        series: 3,
        reps: "12 cada perna",
        repsCasa: "15 cada perna",
        descansoSeg: 45,
        cadencia: C2,
        progressao: "Aumente a carga quando a pausa de 1s ficar fácil.",
      },
    ],
  },
  {
    fase: 2,
    letra: "D",
    aquecimento: AQUEC_D,
    itens: [
      {
        academia: "ativacao-5-minutos",
        casa: "ativacao-5-minutos",
        series: 1,
        tempoSeg: 300,
        descansoSeg: 60,
        cadencia: "Movimentos controlados, sem pressa",
        progressao: "Faça antes de todo treino.",
      },
      {
        academia: "agachamento-goblet",
        casa: "agachamento-goblet",
        series: 3,
        reps: "15",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Semana 4: reduza o descanso para 20s.",
      },
      {
        academia: "passada-para-tras",
        casa: "passada-para-tras",
        series: 3,
        reps: "12 cada perna",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Alterne as pernas sem parar entre elas.",
      },
      {
        academia: "frog-pump",
        casa: "frog-pump",
        series: 3,
        reps: "25",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Semana 4: 30 repetições.",
      },
      {
        academia: "caminhada-lateral-elastico",
        casa: "caminhada-lateral-elastico",
        series: 3,
        reps: "15 passos para cada lado",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Elástico no tornozelo.",
      },
      {
        academia: "ponte-isometria",
        casa: "ponte-isometria",
        series: 3,
        tempoSeg: 45,
        descansoSeg: 45,
        cadencia: ISO,
        progressao: "Semana 4: coloque peso sobre o quadril.",
      },
    ],
  },

  // =========================================================================
  // FASE 3 — RETA FINAL
  // =========================================================================
  {
    fase: 3,
    letra: "A",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "hip-thrust-barra",
        casa: "hip-thrust-mochila",
        series: 4,
        reps: "6 a 8",
        repsCasa: "12 a 15",
        descansoSeg: 120,
        cadencia: C3,
        progressao: "Semana 5: carga mais alta do protocolo. Semana 6: mantenha a carga e capriche na pausa.",
        tecnica: "Pausa de 3 segundos no topo em todas as repetições.",
      },
      {
        academia: "stiff",
        casa: "stiff-unilateral",
        series: 4,
        reps: "8",
        repsCasa: "10 cada perna",
        descansoSeg: 90,
        cadencia: "4s descendo · sobe com força",
        progressao: "Mantenha a carga da Fase 2 e desça em 4 segundos.",
      },
      {
        academia: "glute-bridge-unilateral",
        casa: "glute-bridge-unilateral",
        series: 3,
        reps: "12 cada perna",
        descansoSeg: 45,
        cadencia: C3,
        progressao: "Apoie o pé num degrau baixo para aumentar a amplitude.",
        tecnica: "Unilateral: comece sempre pelo lado mais fraco.",
      },
      {
        academia: "extensao-quadril-banco-45",
        casa: "coice-elastico-4-apoios",
        series: 3,
        reps: "12",
        repsCasa: "15 cada perna",
        descansoSeg: 60,
        cadencia: C3,
        progressao: "Use a carga da Fase 2 e aplique o drop set.",
        tecnica: "Drop set simples na última série: ao chegar perto da falha, reduza o peso (em casa: afrouxe o elástico) e faça mais 8 a 10.",
      },
      {
        academia: "mesa-flexora",
        casa: "flexora-toalha",
        series: 3,
        reps: "10",
        descansoSeg: 60,
        cadencia: "3s voltando",
        progressao: "Segure 1s com o joelho dobrado em cada repetição.",
      },
      {
        academia: "ponte-isometria",
        casa: "ponte-isometria",
        series: 2,
        tempoSeg: 60,
        descansoSeg: 45,
        cadencia: ISO,
        progressao: "Semana 6: coloque peso sobre o quadril.",
        tecnica: "Isometria final: aperte cada vez mais forte até o último segundo.",
      },
    ],
  },
  {
    fase: 3,
    letra: "B",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "agachamento-bulgaro",
        casa: "agachamento-bulgaro",
        series: 4,
        reps: "8 cada perna",
        repsCasa: "12 cada perna",
        descansoSeg: 90,
        cadencia: C3,
        progressao: "Use o peso mais alto que você conseguir com a pausa perfeita.",
        tecnica: "Pausa de 2 segundos embaixo em todas as repetições.",
      },
      {
        academia: "abducao-maquina",
        casa: "abducao-elastico-sentada",
        series: 4,
        reps: "15",
        repsCasa: "20",
        descansoSeg: 45,
        cadencia: C3,
        progressao: "Mantenha a carga e capriche no drop set.",
        tecnica: "Drop set simples na última série: reduza a carga pela metade (em casa: tire o elástico) e continue até não conseguir mais.",
      },
      {
        academia: "step-up-banco",
        casa: "step-up-banco",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 60,
        cadencia: "Sobe com força · 4s descendo",
        progressao: "Halteres (em casa: mochila) e descida em 4 segundos.",
        tecnica: "Unilateral com descida de 4 segundos.",
      },
      {
        academia: "stiff-unilateral",
        casa: "stiff-unilateral",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 75,
        cadencia: C3,
        progressao: "Segure 1s embaixo, no ponto de maior alongamento.",
      },
      {
        academia: "abducao-quadril-cabo",
        casa: "abducao-elastico-deitada",
        series: 3,
        reps: "15 cada perna",
        repsCasa: "20 cada perna",
        descansoSeg: 30,
        cadencia: C3,
        progressao: "Mesma carga da Fase 2, descanso menor.",
        tecnica: "Isometria: na última repetição, segure 10 segundos com a perna no alto.",
      },
      {
        academia: "clam-shell",
        casa: "clam-shell",
        series: 2,
        reps: "20 cada lado",
        descansoSeg: 30,
        cadencia: CIRC,
        progressao: "Elástico mais forte que você tiver.",
      },
    ],
  },
  {
    fase: 3,
    letra: "C",
    aquecimento: AQUEC_PADRAO,
    itens: [
      {
        academia: "agachamento-pausa",
        casa: "agachamento-pausa",
        series: 4,
        reps: "8",
        repsCasa: "12",
        descansoSeg: 90,
        cadencia: "3s descendo · 3s de pausa · sobe explodindo",
        progressao: "Carga da Fase 2 com pausa maior.",
        tecnica: "Pausa de 3 segundos embaixo.",
      },
      {
        academia: "hip-thrust-barra",
        casa: "hip-thrust-mochila",
        series: 4,
        reps: "10",
        repsCasa: "15",
        descansoSeg: 90,
        cadencia: C3,
        progressao: "Carga moderada: a técnica \"1 e meia\" deixa tudo mais pesado.",
        tecnica: "Repetição 1 e meia: suba, desça até a metade, suba de novo e só então desça tudo = 1 repetição.",
      },
      {
        academia: "leg-press-pes-altos",
        casa: "agachamento-bulgaro",
        series: 3,
        reps: "12",
        repsCasa: "10 cada perna",
        descansoSeg: 75,
        cadencia: C3,
        progressao: "Use a carga mais alta da Fase 2.",
        tecnica: "Drop set simples na última série (em casa: termine sem a mochila, até não conseguir mais).",
      },
      {
        academia: "passada-para-tras",
        casa: "passada-para-tras",
        series: 3,
        reps: "10 cada perna",
        descansoSeg: 60,
        cadencia: C3,
        progressao: "Halteres (em casa: mochila). Toque o joelho de trás de leve no chão.",
      },
      {
        academia: "agachamento-sumo",
        casa: "agachamento-sumo",
        series: 3,
        reps: "15",
        descansoSeg: 60,
        cadencia: C3,
        progressao: "Degraus embaixo dos pés para descer mais fundo.",
        tecnica: "Isometria: no fim da última série, segure 20 segundos lá embaixo.",
      },
      {
        academia: "coice-polia",
        casa: "kickback-pe-elastico",
        series: 3,
        reps: "12 cada perna",
        repsCasa: "15 cada perna",
        descansoSeg: 30,
        cadencia: C3,
        progressao: "Descanso curto: 30 segundos e já troca de perna.",
      },
    ],
  },
  {
    fase: 3,
    letra: "D",
    aquecimento: AQUEC_D,
    itens: [
      {
        academia: "ativacao-5-minutos",
        casa: "ativacao-5-minutos",
        series: 1,
        tempoSeg: 300,
        descansoSeg: 45,
        cadencia: "Movimentos controlados, sem pressa",
        progressao: "Faça antes de todo treino.",
      },
      {
        academia: "agachamento-sumo",
        casa: "agachamento-sumo",
        series: 4,
        reps: "15",
        descansoSeg: 20,
        cadencia: CIRC,
        progressao: "Segure peso (em casa: mochila) se conseguir manter o ritmo.",
      },
      {
        academia: "glute-bridge-unilateral",
        casa: "glute-bridge-unilateral",
        series: 4,
        reps: "12 cada perna",
        descansoSeg: 20,
        cadencia: CIRC,
        progressao: "Pé de apoio num degrau baixo.",
        tecnica: "Unilateral sem descanso entre as pernas.",
      },
      {
        academia: "caminhada-lateral-elastico",
        casa: "caminhada-lateral-elastico",
        series: 4,
        reps: "15 passos para cada lado",
        descansoSeg: 20,
        cadencia: CIRC,
        progressao: "Elástico no tornozelo e meio agachamento mais baixo.",
      },
      {
        academia: "frog-pump",
        casa: "frog-pump",
        series: 4,
        reps: "30",
        descansoSeg: 20,
        cadencia: CIRC,
        progressao: "Peso leve sobre o quadril.",
      },
      {
        academia: "ponte-isometria",
        casa: "ponte-isometria",
        series: 2,
        tempoSeg: 60,
        descansoSeg: 45,
        cadencia: ISO,
        progressao: "Peso sobre o quadril e mini band nos joelhos.",
        tecnica: "Isometria até o último segundo, empurrando os joelhos para fora.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Geração das versões academia/casa
// ---------------------------------------------------------------------------

/** Item como está no conteúdo, antes do ajuste por nível. */
export interface ItemTreinoBase extends ItemTreino {
  tecnicaSeEstagnada?: string;
}

export interface TreinoBase extends Omit<Treino, "itens"> {
  itens: ItemTreinoBase[];
}

/** Estimativa de duração: ~40s por série de repetições + tempo das séries cronometradas + descansos. */
export function estimarDuracaoMin(itens: ItemTreino[]): number {
  const seg = itens.reduce((total, it) => {
    const execucao = it.tempoSeg ?? 40;
    const lados = it.reps && /cada (perna|lado)/.test(it.reps) ? 2 : 1;
    return total + it.series * execucao * lados + Math.max(0, it.series - 1) * it.descansoSeg + 60;
  }, 0);
  return Math.max(5, Math.round(seg / 60 / 5) * 5);
}

function expandir(def: DefTreino, versao: VersaoTreino): TreinoBase {
  const itens: ItemTreinoBase[] = def.itens.map((d) => {
    const item: ItemTreinoBase = {
      exercicio: versao === "academia" ? d.academia : d.casa,
      series: d.series,
      descansoSeg: d.descansoSeg,
      cadencia: d.cadencia,
      progressao: d.progressao,
    };
    const reps = versao === "casa" ? (d.repsCasa ?? d.reps) : d.reps;
    if (reps) item.reps = reps;
    if (d.tempoSeg) item.tempoSeg = d.tempoSeg;
    if (d.tecnica) item.tecnica = d.tecnica;
    if (d.tecnicaSeEstagnada) item.tecnicaSeEstagnada = d.tecnicaSeEstagnada;
    return item;
  });
  const base = `f${def.fase}-${def.letra}`;
  return {
    id: `${base}-${versao}`,
    base,
    fase: def.fase,
    letra: def.letra,
    versao,
    nome: `Treino ${def.letra}`,
    foco: NOME_TREINO[def.letra],
    duracaoMin: estimarDuracaoMin(itens),
    aquecimento: def.aquecimento,
    itens,
  };
}

export const treinosBase: TreinoBase[] = definicoes.flatMap((d) => [expandir(d, "academia"), expandir(d, "casa")]);

const treinoPorId = new Map(treinosBase.map((t) => [t.id, t]));

export function obterTreinoBase(fase: NumeroFase, letra: LetraTreino, versao: VersaoTreino): TreinoBase {
  const t = treinoPorId.get(`f${fase}-${letra}-${versao}`);
  if (!t) throw new Error(`Treino não encontrado: f${fase}-${letra}-${versao}`);
  return t;
}

// ---------------------------------------------------------------------------
// Descanso ativo
// ---------------------------------------------------------------------------
export const rotinaDescanso: RotinaDescanso = {
  id: "descanso-ativo",
  nome: "Descanso ativo",
  descricao: "5 minutos de mobilidade e ativação para o glúteo se recuperar sem esfriar. Pode fazer em qualquer lugar.",
  duracaoMin: 5,
  itens: [
    { exercicio: "mobilidade-90-90", series: 1, tempoSeg: 60, descansoSeg: 10, cadencia: "Devagar, respirando", progressao: "A cada semana, incline um pouco mais o tronco na perna da frente." },
    { exercicio: "alongamento-flexor-quadril", series: 1, tempoSeg: 60, descansoSeg: 10, cadencia: "30 segundos de cada lado", progressao: "Aperte o glúteo da perna de trás o tempo todo." },
    { exercicio: "hip-thrust-chao", series: 1, reps: "15", descansoSeg: 10, cadencia: "Lento, apertando 2s no topo", progressao: "Sem peso: é só para ativar." },
    { exercicio: "clam-shell", series: 1, reps: "12 cada lado", descansoSeg: 10, cadencia: "Controlado", progressao: "Use elástico leve, se tiver." },
    { exercicio: "ponte-isometria", series: 1, tempoSeg: 30, descansoSeg: 0, cadencia: ISO, progressao: "Termine apertando forte nos últimos 5 segundos." },
  ],
};

/** Rótulos amigáveis */
export const ROTULO_NIVEL: Record<Nivel, string> = {
  iniciante: "Começando agora",
  intermediario: "Já treino (menos de 1 ano)",
  estagnada: "Treino há mais de 1 ano e estagnei",
};
