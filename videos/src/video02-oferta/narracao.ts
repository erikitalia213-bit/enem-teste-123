import {TrechoNarracao} from '../compartilhado/componentes';

// Narração do vídeo 2 (ElevenLabs, voz Roberta). Arquivo original intacto em
// public/narracao/narracao-02-original.mp3 (19,9s).
// Para caber no vídeo, cada frase toca no seu frame, a 1,15x, com pausas curtas.
// Se gerar uma narração nova, ajuste `de`/`ate` (segundos no MP3) de cada frase.
export const ARQUIVO_NARRACAO = 'narracao/narracao-02-original.mp3';
export const VELOCIDADE = 1.15;

export const trechos: TrechoNarracao[] = [
  {de: 0.0, ate: 1.83, emFrame: 3, texto: 'Sua filha ama BTS?'},
  {de: 2.12, ate: 4.19, emFrame: 55, texto: 'Esse presente custa menos que um lanche'},
  {de: 4.51, ate: 6.59, emFrame: 113, texto: 'São oitenta desenhos pra colorir'},
  {de: 6.97, ate: 9.31, emFrame: 172, texto: 'mil e quinhentos photocards pra imprimir'},
  {de: 9.61, ate: 12.83, emFrame: 237, texto: 'sete calendários três dê de 2027'},
  {de: 13.07, ate: 15.19, emFrame: 325, texto: 'e ainda três diários de bônus'},
  {de: 15.46, ate: 17.57, emFrame: 386, texto: 'Kit completo por dezenove e noventa'},
  {de: 17.66, ate: 18.59, emFrame: 444, texto: 'pagamento único'},
  {de: 18.78, ate: 19.77, emFrame: 472, texto: 'Garanta o dela!'},
];

// Momentos da animação casados com a fala (em frames, 30fps)
export const tempos = {
  segundoGancho: 55, // "Esse presente custa menos que um lanche"
  inicioItens: [113, 172, 237, 325], // 80 desenhos, 1.500 photocards, 7 calendários, 3 diários
  inicioFinal: 384, // kit completo + preço
  atrasoPreco: 24, // "dezenove e noventa" (contado a partir do inicioFinal)
  atrasoDetalhe: 60, // "pagamento único"
  atrasoCTA: 88, // "Garanta o dela!"
  duracao: 510, // 17s
};
