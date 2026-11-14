import {IMAGENS} from '../compartilhado/imagens';
import {Fala} from '../compartilhado/tempoFala';

// Fundos para a apresentadora (DreamFace por cima, no CapCut).
// Velocidade 1: o vídeo do DreamFace usa o MP3 na velocidade original,
// então o fundo tem exatamente a duração do áudio.

export type FundoVariacao = Fala & {
  id: string;
  arquivo: string;
  audio: string;
  gancho: string;
  itens: {palavra: string; ocorrencia?: number; src: string; rotulo: string}[];
  palavraDigital: string;
  textoDigital: string;
  palavraPreco: string;
  palavraCTA: string;
};

export const FUNDOS: FundoVariacao[] = [
  {
    id: 'Fundo-Variacao-A',
    arquivo: 'fundo-variacao-a-natal',
    audio: 'narracao/variacao-A.mp3',
    duracaoAudio: 20.27,
    velocidade: 1,
    texto:
      'Atenção, ARMY! O Natal tá chegando e você ainda não tem isso? É um kit de Natal pra imprimir em casa: 80 desenhos pra colorir, 1.500 photocards, diário e calendário 3D de 2027. É digital, então chega na hora, sem frete. Tudo por R$ 19,90. Toca em Saiba mais!',
    silencios: [
      [1.119, 1.399], [1.77, 1.909], [4.167, 4.575], [6.625, 6.97], [7.115, 7.262], [8.624, 8.767],
      [10.336, 10.617], [11.747, 11.895], [13.601, 13.972], [16.655, 17.057], [18.69, 19.069], [20.019, 20.271],
    ],
    gancho: 'Atenção, ARMY! 🎄',
    itens: [
      {palavra: 'kit', src: IMAGENS.kitCompleto, rotulo: 'Kit de Natal pra imprimir'},
      {palavra: '80', src: IMAGENS.colorir, rotulo: '80 desenhos pra colorir'},
      {palavra: 'photocards', src: IMAGENS.cartoes, rotulo: '1.500 photocards'},
      {palavra: 'diário', src: IMAGENS.diarioCapa, rotulo: 'Diário de bônus'},
      {palavra: 'calendário', src: IMAGENS.calendario, rotulo: 'Calendário 3D 2027'},
    ],
    palavraDigital: 'digital',
    textoDigital: 'Digital: chega na hora, sem frete ⚡',
    palavraPreco: 'tudo',
    palavraCTA: 'toca',
  },
  {
    id: 'Fundo-Variacao-B',
    arquivo: 'fundo-variacao-b-photocards',
    audio: 'narracao/variacao-B.mp3',
    duracaoAudio: 18.6,
    velocidade: 1,
    texto:
      'Atenção, ARMY! Para de pagar caro em photocard. Esse kit de Natal tem 1.500 photocards pra imprimir em casa, mais 80 desenhos pra colorir, diário e calendário 3D de 2027. É digital, chega na hora e sem frete. Tudo por R$ 19,90. Toca em Saiba mais!',
    silencios: [
      [1.145, 1.52], [2.217, 2.342], [3.402, 3.822], [7.591, 7.842], [8.167, 8.306], [9.61, 9.895],
      [11.126, 11.286], [13.135, 13.503], [14.986, 15.422], [16.972, 17.377], [18.414, 18.599],
    ],
    gancho: 'Atenção, ARMY! 💸',
    itens: [
      {palavra: 'esse', src: IMAGENS.kitCompleto, rotulo: 'Kit de Natal ARMY'},
      {palavra: 'photocards', src: IMAGENS.cartoes, rotulo: '1.500 photocards'},
      {palavra: '80', src: IMAGENS.colorir, rotulo: '80 desenhos pra colorir'},
      {palavra: 'diário', src: IMAGENS.diarioCapa, rotulo: 'Diário de bônus'},
      {palavra: 'calendário', src: IMAGENS.calendario, rotulo: 'Calendário 3D 2027'},
    ],
    palavraDigital: 'digital',
    textoDigital: 'Digital: chega na hora, sem frete ⚡',
    palavraPreco: 'tudo',
    palavraCTA: 'toca',
  },
];
