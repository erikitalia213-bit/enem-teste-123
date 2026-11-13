// Anúncios UGC montados com clipes do Google Flow / Artlist.
//
// Para criar uma variação nova:
// 1. Coloque o MP4 em public/clipes/
// 2. Adicione o clipe em CLIPES (com a duração e as frases da legenda)
// 3. Monte o anúncio em ANUNCIOS juntando os clipes na ordem
// Depois rode: npm run render (ou abra no Studio).

export type FraseClipe = {
  /** Segundos dentro do clipe em que a frase começa e termina. */
  de: number;
  ate: number;
  legenda: string;
};

export type Clipe = {
  arquivo: string; // dentro de public/
  duracao: number; // segundos que vamos usar do clipe
  inicio?: number; // segundos a pular no começo do clipe (padrão 0)
  frases: FraseClipe[];
};

export const CLIPES = {
  maeGancho1: {
    arquivo: 'clipes/mae-gancho-1.mp4',
    duracao: 7.9,
    frases: [
      {de: 0.0, ate: 0.83, legenda: 'Mãe,'},
      {de: 1.12, ate: 4.65, legenda: 'para de rolar: se sua filha é ARMY,'},
      {de: 5.06, ate: 7.9, legenda: 'esse é o presente de Natal.'},
    ],
  },
  maeProva: {
    arquivo: 'clipes/mae-prova.mp4',
    duracao: 7.8,
    frases: [
      {de: 0.0, ate: 4.0, legenda: 'É um kit pra imprimir em casa: desenho pra colorir, photocards,'},
      {de: 4.17, ate: 7.8, legenda: 'calendário… dá pra fazer junto com ela.'},
    ],
  },
  // maeGancho2: {...}, maeGancho3: {...}
} satisfies Record<string, Clipe>;

export type Anuncio = {
  id: string; // nome da composição e do arquivo final
  clipes: Clipe[];
  final: {
    titulo: string;
    preco: string;
    detalhe: string;
    cta: string;
  };
};

const finalPadrao = {
  titulo: 'Kit de Natal ARMY',
  preco: 'R$ 19,90',
  detalhe: 'pagamento único · acesso imediato',
  cta: 'Toque em Saiba mais 💜',
};

export const ANUNCIOS: Anuncio[] = [
  {id: 'UGC-Mae-Gancho1', clipes: [CLIPES.maeGancho1, CLIPES.maeProva], final: finalPadrao},
];

export const SEGUNDOS_FINAL = 4.5;
