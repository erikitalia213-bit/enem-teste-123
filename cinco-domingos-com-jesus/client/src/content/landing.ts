export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const img = (file: string, width: number, height: number, alt: string): SiteImage => ({
  src: `/assets/${file}`,
  width,
  height,
  alt,
});

export const IMAGES = {
  hero: img(
    "01-hero-presepio.webp",
    1440,
    810,
    "Presépio de papel montado sobre a mesa: Maria, José, o Menino Jesus na manjedoura, um anjo, um pastor, duas ovelhas, o estábulo e a estrela, com a folha de peças impressas ao fundo",
  ),
  domingo1: img(
    "02-domingo-1-maria-e-anjo.webp",
    1440,
    810,
    "Figuras de papel de Maria, com véu azul, e do anjo dourado em pé, ao lado da folha impressa com as duas peças e de uma tesoura infantil sem ponta",
  ),
  domingo2: img(
    "03-domingo-2-jose.webp",
    1440,
    960,
    "Mão de adulto colocando a figura de papel de José, de manto terracota, ao lado de Maria e do anjo",
  ),
  domingo3: img(
    "04-domingo-3-belem.webp",
    1440,
    810,
    "Estábulo de papel com a estrela dourada no alto, Maria e José ao lado e um caminho de papel levando ao espaço vazio da manjedoura",
  ),
  domingo4: img(
    "05-domingo-4-pastores.webp",
    1440,
    810,
    "Cena do presépio de papel com o anjo, Maria, José, um pastor com cajado e duas ovelhas em volta da manjedoura ainda vazia",
  ),
  domingo5: img(
    "06-domingo-5-nascimento.webp",
    1440,
    810,
    "Mãos de uma criança e de um adulto colocando juntas a figura de papel do Menino Jesus na manjedoura, no centro do presépio completo",
  ),
  kit: img(
    "07-previa-do-kit.webp",
    1440,
    960,
    "Três folhas impressas do kit sobre a mesa: atividade com uma estrela para colorir, página de história com Maria e o anjo e folha de personagens para recortar, com lápis e tesoura",
  ),
  amostra: img(
    "08-previa-do-primeiro-domingo.webp",
    1440,
    810,
    "Folha de recorte do primeiro domingo com Maria e o anjo e, à frente, as mesmas duas figuras já recortadas e em pé",
  ),
  familia: img(
    "09-montagem-em-familia.webp",
    1440,
    810,
    "Mãe e filho sorrindo à mesa enquanto montam juntos o presépio de papel",
  ),
} satisfies Record<string, SiteImage>;

export const HOW_IT_WORKS = [
  {
    title: "Imprima o material",
    text: "Baixe o PDF e imprima o encontro da semana em casa. Uma impressora comum resolve.",
  },
  {
    title: "Leia e converse",
    text: "Leiam juntos a história curta e conversem sobre ela, com a ajuda da orientação para responsáveis.",
  },
  {
    title: "Recorte e monte juntos",
    text: "Façam a atividade e acrescentem a nova peça ao presépio de papel, com o adulto acompanhando o recorte.",
  },
];

export type Encounter = {
  number: number;
  title: string;
  reference: string;
  story: string;
  piece: string;
  image: SiteImage;
};

export const ENCOUNTERS: Encounter[] = [
  {
    number: 1,
    title: "O anjo visita Maria",
    reference: "Lucas 1,26-38",
    story:
      "O anjo Gabriel leva a Maria uma notícia surpreendente: ela será a mãe de Jesus. Maria escuta, confia e responde com um sim.",
    piece: "Maria e o anjo",
    image: IMAGES.domingo1,
  },
  {
    number: 2,
    title: "José recebe uma mensagem em sonho",
    reference: "Mateus 1,18-25",
    story:
      "José está preocupado, até que um anjo fala com ele em sonho e o tranquiliza. Ele acorda decidido a cuidar de Maria e do bebê que vai nascer.",
    piece: "José",
    image: IMAGES.domingo2,
  },
  {
    number: 3,
    title: "A viagem a Belém",
    reference: "Lucas 2,1-5",
    story:
      "Maria e José precisam viajar até Belém. O caminho é longo e, quando chegam, a cidade está cheia. Ainda assim, há um lugar preparado para eles.",
    piece: "A base do presépio e a estrela",
    image: IMAGES.domingo3,
  },
  {
    number: 4,
    title: "Os pastores recebem a notícia",
    reference: "Lucas 2,8-20",
    story:
      "Na noite em que Jesus nasce, pastores cuidam das ovelhas no campo. Depois do nascimento, um anjo aparece e conta a eles a grande alegria, e os pastores vão depressa conhecer o menino.",
    piece: "Os pastores e as ovelhas",
    image: IMAGES.domingo4,
  },
  {
    number: 5,
    title: "O nascimento de Jesus",
    reference: "Lucas 2,6-7",
    story:
      "Em Belém, Maria dá à luz o seu filho, envolve-o em panos e o deita numa manjedoura. É o primeiro Natal, e a família completa o presépio junta.",
    piece: "Jesus na manjedoura",
    image: IMAGES.domingo5,
  },
];

export const KIT_ITEMS = [
  {
    title: "Cinco histórias",
    text: "Textos curtos, baseados na Bíblia, para ler em voz alta em poucos minutos.",
  },
  {
    title: "Orientação para responsáveis",
    text: "Como conduzir cada encontro e puxar a conversa com a criança.",
  },
  {
    title: "Atividades infantis",
    text: "Uma atividade por encontro para colorir, pensar e fixar a história.",
  },
  {
    title: "Peças para recortar e montar",
    text: "Personagens e cenário do presépio de papel, uma parte a cada encontro.",
  },
];
