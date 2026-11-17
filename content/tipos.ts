/**
 * Tipos do conteúdo versionado no repositório (exercícios, protocolo, receitas e cardápio).
 * Edite os arquivos em /content e rode `npm run validar:conteudo` para conferir.
 */

// ---------------------------------------------------------------------------
// Perfil da aluna
// ---------------------------------------------------------------------------
export type LocalTreino = "academia" | "casa" | "ambos";
/** Versão concreta de um treino (o "ambos" escolhe uma das duas no dia). */
export type VersaoTreino = "academia" | "casa";
export type Objetivo = "volume" | "empinado" | "firme" | "flacidez";
export type Nivel = "iniciante" | "intermediario" | "estagnada";

// ---------------------------------------------------------------------------
// Exercícios
// ---------------------------------------------------------------------------
export type Musculo =
  | "gluteo-maximo"
  | "gluteo-medio"
  | "gluteo-completo"
  | "posterior"
  | "quadriceps"
  | "mobilidade";

export interface Exercicio {
  slug: string;
  nome: string;
  /** Onde dá para fazer: "ambos" aparece nos dois filtros da biblioteca. */
  local: LocalTreino;
  equipamento: string;
  musculoAlvo: Musculo;
  /** Outros músculos que também trabalham (texto livre, curto). */
  secundarios?: string[];
  /** 3 a 4 frases curtas e práticas. */
  passos: string[];
  ondeSentir: string;
  erroComum: string;
  dicaDeOuro: string;
}

// ---------------------------------------------------------------------------
// Protocolo
// ---------------------------------------------------------------------------
export type NumeroFase = 1 | 2 | 3;
export type LetraTreino = "A" | "B" | "C" | "D";

export interface Fase {
  numero: NumeroFase;
  nome: string;
  semanas: [number, number];
  resumo: string;
  foco: string[];
  medalha: string;
}

/** Item de treino já pronto para exibir (depois de aplicar local e nível). */
export interface ItemTreino {
  exercicio: string;
  series: number;
  /** Repetições ("12", "10 a 12", "10 cada perna"). Ausente quando é por tempo. */
  reps?: string;
  /** Duração de cada série em segundos (isometria, circuitos, mobilidade). */
  tempoSeg?: number;
  descansoSeg: number;
  cadencia: string;
  progressao: string;
  /** Técnica avançada aplicada neste exercício (pausa, drop set, isometria...). */
  tecnica?: string;
}

export interface Treino {
  /** Ex.: "f2-B-casa" */
  id: string;
  /** Ex.: "f2-B" (mesmo treino nas duas versões) */
  base: string;
  fase: NumeroFase;
  letra: LetraTreino;
  versao: VersaoTreino;
  nome: string;
  foco: string;
  duracaoMin: number;
  aquecimento: string[];
  itens: ItemTreino[];
}

/** Rotina de descanso ativo (5 minutos de mobilidade e ativação). */
export interface RotinaDescanso {
  id: string;
  nome: string;
  descricao: string;
  duracaoMin: number;
  itens: ItemTreino[];
}

// ---------------------------------------------------------------------------
// Receitas e cardápio
// ---------------------------------------------------------------------------
export type Refeicao = "cafe" | "almoco" | "lanche" | "jantar";
export type TagReceita = "rápida" | "marmita" | "sem fogão" | "barata";

export type SecaoMercado =
  | "Hortifrúti"
  | "Açougue e peixaria"
  | "Ovos, frios e laticínios"
  | "Mercearia"
  | "Grãos e cereais"
  | "Padaria"
  | "Temperos e óleos";

export type Unidade =
  | "un"
  | "g"
  | "ml"
  | "colher-sopa"
  | "colher-cha"
  | "xicara"
  | "fatia"
  | "concha"
  | "pote"
  | "lata"
  | "file"
  | "dente"
  | "punhado"
  | "pitada"
  | "a-gosto";

export interface ItemCatalogo {
  nome: string;
  plural: string;
  secao: SecaoMercado;
  /** Unidade usada quando a receita não informa outra. */
  unidade: Unidade;
}

export interface IngredienteReceita {
  /** Chave do catálogo de ingredientes (content/ingredientes.ts). */
  item: string;
  /** Quantidade por receita inteira. `null` para "a gosto". */
  qtd: number | null;
  unidade: Unidade;
  /** Observação curta ("picada", "cozida", "sem pele"). */
  obs?: string;
}

export interface Receita {
  id: string;
  nome: string;
  refeicao: Refeicao;
  tempoMin: number;
  porcoes: number;
  ingredientes: IngredienteReceita[];
  preparo: string[];
  /** Proteína aproximada POR PORÇÃO, em gramas. */
  proteinaG: number;
  tags: TagReceita[];
}

export interface DiaCardapio {
  cafe: string;
  almoco: string;
  lanche: string;
  jantar: string;
}
