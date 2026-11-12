// Caminhos relativos a videos/public/. Para trocar uma imagem (ex.: pela
// versão .png original), basta mudar o caminho aqui.
export const IMAGENS = {
  hero: 'hero-bts-natal.jpg',
  kitCompleto: 'kit-completo-natal.jpg',
  capa: 'book/capa.jpg',
  colorir: 'book/colorir.jpg',
  journal: 'book/journal.jpg',
  cartoes: 'book/cartoes.jpg',
  calendario: 'book/calendario-kpop.jpg',
  diarioCapa: 'book/diario-capa.jpg',
  diarioMemorias: 'book/diario-memorias.jpg',
  diarioMusicas: 'book/diario-musicas.jpg',
  insideJournal: 'inside/journal.jpg',
  tags: 'inside/tags.jpg',
  adesivos: 'inside/adesivos.jpg',
  insideCalendario: 'inside/calendario-kpop.jpg',
  insideDiarioCapa: 'inside/diario-capa.jpg',
  insideDiarioMemorias: 'inside/diario-memorias.jpg',
} as const;

export type ChaveImagem = keyof typeof IMAGENS;

export const TRILHA = 'trilha.mp3';
