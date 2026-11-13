import {IMAGENS} from '../compartilhado/imagens';
import {Fala} from '../compartilhado/tempoFala';

// Criativo 1 "kit impresso" com a narração nova (copy de resposta direta).
// A = roteiro completo; B = mesmo roteiro com o gancho "seu Natal tá incompleto".
// Cada cena entra quando a voz fala a palavra-chave.

export type Cena =
  | {tipo: 'clipe'; palavra?: string; ocorrencia?: number; arquivo: string; de: number; velocidade?: number; zoom?: number; focoY?: string; rotulo?: string; volume?: number}
  | {tipo: 'folhas'; palavra: string; ocorrencia?: number; rotulo: string}
  /** Páginas reais do kit na frente, com um clipe desfocado atrás. */
  | {tipo: 'paginas'; palavra: string; ocorrencia?: number; rotulo: string; imagens: string[]; fundo: string; fundoDe: number}
  | {tipo: 'final'; palavra: string; ocorrencia?: number};

export type RoteiroImpresso = Fala & {
  id: string;
  arquivo: string;
  audio: string;
  gancho: string;
  palavraDigital: string;
  palavraCTA: string;
  cenas: Cena[];
  /** Gancho em faixa de alto contraste (substitui o texto simples). */
  hookForte?: {faixa: string; linha: string; destaque: string; selo?: string};
  /** Card final com selo, checklist, botão grande e setas para o "Saiba mais". */
  finalForte?: boolean;
  /** Frames extras no fim depois da voz (para o CTA ficar na tela). */
  folgaFinal?: number;
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

// Edição com os vídeos do TikTok (com autorização dos criadores) + páginas reais do kit.
// O som original dos vídeos fica mudo (volume 0); só a narração toca.
const T = 'clipes/tiktok/';
export const ROTEIRO_TIKTOK: RoteiroImpresso = {
  ...ROTEIROS_IMPRESSO[1],
  id: 'Edit-TikTok',
  arquivo: 'natal-army-edit-tiktok',
  cenas: [
    {tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 1.0, velocidade: 1.15, volume: 0},
    {tipo: 'clipe', palavra: 'todo', arquivo: T + 'caixa-photocards.mp4', de: 0, volume: 0, rotulo: 'Merch cara 💸'},
    {tipo: 'clipe', palavra: 'frete', arquivo: T + 'caixa-photocards.mp4', de: 16, volume: 0, rotulo: 'Frete que atrasa 📦'},
    {tipo: 'clipe', palavra: 'descobri', arquivo: T + 'diario-diy.mp4', de: 8, zoom: 1.16, volume: 0, rotulo: 'Kit pra imprimir em casa ✦'},
    {tipo: 'clipe', palavra: 'são', arquivo: T + 'photocards-camisa.mp4', de: 6, volume: 0, rotulo: '1.500 photocards'},
    {tipo: 'paginas', palavra: '80', imagens: [IMAGENS.colorir], fundo: T + 'livro-colorir.mp4', fundoDe: 12, rotulo: '80 desenhos pra colorir'},
    {tipo: 'paginas', palavra: 'diários', imagens: [IMAGENS.journal, IMAGENS.diarioMusicas], fundo: T + 'diario-diy.mp4', fundoDe: 30, rotulo: 'Diários de bônus'},
    {tipo: 'paginas', palavra: 'calendários', imagens: [IMAGENS.calendario], fundo: T + 'caixa-photocards.mp4', fundoDe: 18, rotulo: '7 calendários 3D 2027'},
    {tipo: 'final', palavra: 'tudo'},
  ],
};

// Mesma edição do TikTok com a narração "Tá chegando o Natal" (voz Sofia).
export const ROTEIRO_TIKTOK_NATAL: RoteiroImpresso = {
  id: 'Edit-TikTok-Natal',
  arquivo: 'natal-army-edit-tiktok-natal',
  audio: 'narracao/natal-chegando.mp3',
  duracaoAudio: 28.6,
  velocidade: 1.12,
  texto:
    'Tá chegando o Natal… e você, ARMY, ainda não tem isso? Faltam poucos dias, e esse é o kit que todo fã de BTS vai querer. São 1.500 photocards, 80 desenhos pra colorir, diários pra guardar suas memórias e 7 calendários 3D de 2027. É digital: você compra, baixa e imprime hoje mesmo, sem esperar frete. Tudo por R$ 19,90. Toca em Saiba mais e garante o seu antes do Natal!',
  silencios: [
    [0.732, 0.872], [1.234, 1.588], [3.838, 4.29], [4.585, 4.75], [6.85, 7.09], [8.758, 9.166],
    [11.014, 11.186], [11.319, 11.455], [12.759, 12.883], [16.103, 16.226], [17.875, 18.223],
    [18.926, 19.202], [19.418, 19.543], [22.666, 22.795], [23.169, 23.491], [25.158, 25.466],
    [27.339, 27.488], [28.451, 28.604],
  ],
  gancho: 'Tá chegando o Natal e você ainda não tem isso? 🎄',
  hookForte: {faixa: '🎄 O NATAL TÁ CHEGANDO', linha: 'e você ainda não tem', destaque: 'ISSO? 👇', selo: '⏳ ÚLTIMOS DIAS'},
  finalForte: true,
  folgaFinal: 50,
  palavraDigital: 'digital',
  palavraCTA: 'toca',
  cenas: [
    {tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 1.0, velocidade: 1.15, volume: 0},
    {tipo: 'clipe', palavra: 'faltam', arquivo: T + 'caixa-photocards.mp4', de: 0, volume: 0, rotulo: 'Faltam poucos dias ⏳'},
    {tipo: 'clipe', palavra: 'esse', arquivo: T + 'diario-diy.mp4', de: 8, zoom: 1.16, volume: 0, rotulo: 'O kit que todo fã vai querer ✦'},
    {tipo: 'clipe', palavra: 'são', arquivo: T + 'photocards-camisa.mp4', de: 6, volume: 0, rotulo: '1.500 photocards'},
    {tipo: 'paginas', palavra: '80', imagens: [IMAGENS.colorir], fundo: T + 'livro-colorir.mp4', fundoDe: 12, rotulo: '80 desenhos pra colorir'},
    {tipo: 'paginas', palavra: 'diários', imagens: [IMAGENS.journal, IMAGENS.diarioMusicas], fundo: T + 'diario-diy.mp4', fundoDe: 30, rotulo: 'Diários de bônus'},
    {tipo: 'paginas', palavra: 'calendários', imagens: [IMAGENS.calendario], fundo: T + 'caixa-photocards.mp4', fundoDe: 18, rotulo: '7 calendários 3D 2027'},
    {tipo: 'clipe', palavra: 'digital', arquivo: T + 'caixa-photocards.mp4', de: 16, volume: 0, rotulo: 'Digital: imprime hoje ⚡'},
    {tipo: 'final', palavra: 'tudo'},
  ],
};
