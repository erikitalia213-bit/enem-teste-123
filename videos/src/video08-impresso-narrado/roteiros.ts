import {Fala} from '../compartilhado/tempoFala';

// Criativo 1 "kit impresso" com a narração nova (copy de resposta direta).
// A = roteiro completo; B = mesmo roteiro com o gancho "seu Natal tá incompleto".
// Cada cena entra quando a voz fala a palavra-chave.

export type Cena =
  | {tipo: 'clipe'; palavra?: string; ocorrencia?: number; arquivo: string; de: number; velocidade?: number; zoom?: number; focoY?: string; rotulo?: string}
  | {tipo: 'folhas'; palavra: string; ocorrencia?: number; rotulo: string}
  | {tipo: 'final'; palavra: string; ocorrencia?: number};

export type RoteiroImpresso = Fala & {
  id: string;
  arquivo: string;
  audio: string;
  gancho: string;
  palavraDigital: string;
  palavraCTA: string;
  cenas: Cena[];
};

const RESTO =
  'Todo Natal é igual: merch cara, frete que atrasa, e o presente fica pra depois. Mas eu descobri um jeito diferente… um kit de Natal ARMY pra imprimir em casa, hoje mesmo. São 1.500 photocards, 80 desenhos pra colorir, diários e 7 calendários 3D de 2027. Tudo por R$ 19,90. É digital, então não depende de frete nenhum. Toca em Saiba mais e garante o seu antes do Natal!';

const C = 'clipes/impresso/';

const cenas = (): Cena[] => [
  {tipo: 'clipe', arquivo: C + 'g1.mp4', de: 1.6, velocidade: 1.2},
  {tipo: 'clipe', palavra: 'todo', arquivo: C + 'g1.mp4', de: 0, velocidade: 0.8, rotulo: 'Merch cara 💸'},
  {tipo: 'clipe', palavra: 'frete', arquivo: C + 'g2.mp4', de: 0, velocidade: 0.8, rotulo: 'Frete que atrasa 📦'},
  {tipo: 'clipe', palavra: 'descobri', arquivo: C + 'g1.mp4', de: 4.4, rotulo: 'Kit pra imprimir em casa ✦'},
  {tipo: 'folhas', palavra: 'são', rotulo: '1.500 photocards'},
  {tipo: 'clipe', palavra: '80', arquivo: C + 'g2.mp4', de: 2.0, rotulo: '80 desenhos pra colorir'},
  {tipo: 'clipe', palavra: 'diários', arquivo: C + 'journal.mp4', de: 2.2, zoom: 1.45, focoY: '88%', rotulo: 'Diários de bônus'},
  {tipo: 'clipe', palavra: 'calendários', arquivo: C + 'calendario.mp4', de: 0.8, rotulo: '7 calendários 3D 2027'},
  {tipo: 'final', palavra: 'tudo'},
];

export const ROTEIROS_IMPRESSO: RoteiroImpresso[] = [
  {
    id: 'Impresso-A-Photocard',
    arquivo: 'impresso-a-photocard',
    audio: 'narracao/impresso-v2.mp3',
    duracaoAudio: 29.88,
    velocidade: 1.12,
    texto: 'ARMY, para de pagar caro em photocard. ' + RESTO,
    silencios: [
      [0.475, 0.723], [2.556, 3.005], [3.998, 4.365], [4.709, 4.836], [8.031, 8.498], [10.142, 10.55],
      [12.956, 13.187], [13.844, 14.303], [15.962, 16.12], [16.234, 16.374], [17.649, 17.961],
      [21.551, 21.998], [23.594, 23.972], [26.583, 27.027], [28.724, 28.857], [29.692, 29.884],
    ],
    gancho: 'ARMY, para de pagar caro em photocard 💸',
    palavraDigital: 'digital',
    palavraCTA: 'toca',
    cenas: cenas(),
  },
  {
    id: 'Impresso-B-Incompleto',
    arquivo: 'impresso-b-incompleto',
    audio: 'narracao/impresso-v2-gancho-incompleto.mp3',
    duracaoAudio: 31.45,
    velocidade: 1.12,
    texto: 'Se você é ARMY e ainda não tem isso, seu Natal tá incompleto. ' + RESTO,
    silencios: [
      [0, 0.13], [2.493, 2.748], [3.912, 4.036], [4.129, 4.535], [5.528, 5.895], [6.239, 6.366],
      [9.561, 10.028], [11.672, 12.08], [14.486, 14.717], [15.374, 15.839], [17.49, 17.65],
      [17.764, 17.904], [19.179, 19.491], [23.081, 23.528], [25.124, 25.502], [28.113, 28.557],
      [30.254, 30.387], [31.222, 31.414],
    ],
    gancho: 'Se você é ARMY e não tem isso, seu Natal tá incompleto 💜',
    palavraDigital: 'digital',
    palavraCTA: 'toca',
    cenas: cenas(),
  },
];
