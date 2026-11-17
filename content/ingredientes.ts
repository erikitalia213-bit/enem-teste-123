import type { ItemCatalogo } from "./tipos";

/**
 * Catálogo de ingredientes. As receitas referenciam estas chaves, e a lista de
 * compras agrupa tudo por seção do mercado.
 * `dica` aparece na lista de compras (ex.: quanto arroz cru rende o cozido).
 */
export const ingredientes: Record<string, ItemCatalogo & { dica?: string }> = {
  // Ovos, frios e laticínios
  ovo: { nome: "ovo", plural: "ovos", secao: "Ovos, frios e laticínios", unidade: "un" },
  "iogurte-natural": { nome: "iogurte natural", plural: "iogurtes naturais", secao: "Ovos, frios e laticínios", unidade: "pote", dica: "Pote de 170 g, sem açúcar." },
  leite: { nome: "leite", plural: "leite", secao: "Ovos, frios e laticínios", unidade: "xicara", dica: "Integral ou desnatado, como preferir." },
  "queijo-minas": { nome: "queijo minas frescal", plural: "queijo minas frescal", secao: "Ovos, frios e laticínios", unidade: "fatia" },
  mussarela: { nome: "muçarela", plural: "muçarela", secao: "Ovos, frios e laticínios", unidade: "fatia" },
  "peito-peru": { nome: "peito de peru", plural: "peito de peru", secao: "Ovos, frios e laticínios", unidade: "fatia" },
  requeijao: { nome: "requeijão light", plural: "requeijão light", secao: "Ovos, frios e laticínios", unidade: "colher-sopa" },
  manteiga: { nome: "manteiga", plural: "manteiga", secao: "Ovos, frios e laticínios", unidade: "colher-cha" },

  // Açougue e peixaria
  "peito-frango": { nome: "peito de frango", plural: "peito de frango", secao: "Açougue e peixaria", unidade: "g", dica: "Compre a bandeja e congele em porções." },
  "carne-moida": { nome: "carne moída (patinho)", plural: "carne moída (patinho)", secao: "Açougue e peixaria", unidade: "g", dica: "Peça patinho moído na hora: menos gordura." },
  patinho: { nome: "patinho em bife ou cubos", plural: "patinho em bife ou cubos", secao: "Açougue e peixaria", unidade: "g" },
  tilapia: { nome: "filé de tilápia", plural: "filé de tilápia", secao: "Açougue e peixaria", unidade: "g", dica: "O congelado costuma ser mais barato." },
  atum: { nome: "atum em lata (sólido ou ralado, em água)", plural: "atum em lata (em água)", secao: "Mercearia", unidade: "lata" },
  sardinha: { nome: "sardinha em lata", plural: "sardinha em lata", secao: "Mercearia", unidade: "lata" },

  // Grãos e cereais
  arroz: { nome: "arroz cozido", plural: "arroz cozido", secao: "Grãos e cereais", unidade: "xicara", dica: "1 xícara de arroz cru rende cerca de 3 xícaras cozido." },
  feijao: { nome: "feijão cozido", plural: "feijão cozido", secao: "Grãos e cereais", unidade: "concha", dica: "500 g de feijão cru rendem cerca de 12 conchas." },
  aveia: { nome: "aveia em flocos", plural: "aveia em flocos", secao: "Grãos e cereais", unidade: "colher-sopa" },
  tapioca: { nome: "goma de tapioca", plural: "goma de tapioca", secao: "Grãos e cereais", unidade: "colher-sopa" },
  flocao: { nome: "flocão de milho (cuscuz)", plural: "flocão de milho (cuscuz)", secao: "Grãos e cereais", unidade: "xicara" },
  "macarrao-integral": { nome: "macarrão integral", plural: "macarrão integral", secao: "Grãos e cereais", unidade: "g" },
  "grao-de-bico": { nome: "grão-de-bico cozido", plural: "grão-de-bico cozido", secao: "Grãos e cereais", unidade: "lata", dica: "Pode usar o em lata ou cozinhar 250 g cru (rende 2 latas)." },
  chia: { nome: "chia", plural: "chia", secao: "Grãos e cereais", unidade: "colher-sopa" },

  // Padaria
  "pao-integral": { nome: "pão integral de forma", plural: "pão integral de forma", secao: "Padaria", unidade: "fatia" },
  "pao-frances": { nome: "pão francês", plural: "pães franceses", secao: "Padaria", unidade: "un" },
  tortilha: { nome: "tortilha integral (pão folha)", plural: "tortilhas integrais (pão folha)", secao: "Padaria", unidade: "un" },

  // Mercearia
  "pasta-amendoim": { nome: "pasta de amendoim integral", plural: "pasta de amendoim integral", secao: "Mercearia", unidade: "colher-sopa" },
  cacau: { nome: "cacau em pó 100%", plural: "cacau em pó 100%", secao: "Mercearia", unidade: "colher-sopa" },
  mel: { nome: "mel", plural: "mel", secao: "Mercearia", unidade: "colher-cha" },
  "molho-tomate": { nome: "molho de tomate", plural: "molho de tomate", secao: "Mercearia", unidade: "xicara", dica: "Prefira sem açúcar adicionado." },
  milho: { nome: "milho em conserva", plural: "milho em conserva", secao: "Mercearia", unidade: "colher-sopa" },
  fermento: { nome: "fermento químico em pó", plural: "fermento químico em pó", secao: "Mercearia", unidade: "colher-cha" },
  mostarda: { nome: "mostarda", plural: "mostarda", secao: "Mercearia", unidade: "colher-cha" },
  shoyu: { nome: "shoyu (molho de soja)", plural: "shoyu (molho de soja)", secao: "Mercearia", unidade: "colher-sopa" },

  // Hortifrúti
  banana: { nome: "banana", plural: "bananas", secao: "Hortifrúti", unidade: "un" },
  maca: { nome: "maçã", plural: "maçãs", secao: "Hortifrúti", unidade: "un" },
  mamao: { nome: "mamão", plural: "mamão", secao: "Hortifrúti", unidade: "fatia" },
  morango: { nome: "morango", plural: "morangos", secao: "Hortifrúti", unidade: "xicara", dica: "Congelado também serve." },
  laranja: { nome: "laranja", plural: "laranjas", secao: "Hortifrúti", unidade: "un" },
  limao: { nome: "limão", plural: "limões", secao: "Hortifrúti", unidade: "un" },
  tomate: { nome: "tomate", plural: "tomates", secao: "Hortifrúti", unidade: "un" },
  cebola: { nome: "cebola", plural: "cebolas", secao: "Hortifrúti", unidade: "un" },
  alho: { nome: "alho", plural: "alho", secao: "Hortifrúti", unidade: "dente" },
  alface: { nome: "alface", plural: "alface", secao: "Hortifrúti", unidade: "punhado", dica: "1 pé rende cerca de 6 punhados." },
  espinafre: { nome: "espinafre", plural: "espinafre", secao: "Hortifrúti", unidade: "punhado" },
  "cheiro-verde": { nome: "cheiro-verde", plural: "cheiro-verde", secao: "Hortifrúti", unidade: "a-gosto" },
  cenoura: { nome: "cenoura", plural: "cenouras", secao: "Hortifrúti", unidade: "un" },
  abobrinha: { nome: "abobrinha", plural: "abobrinhas", secao: "Hortifrúti", unidade: "un" },
  brocolis: { nome: "brócolis", plural: "brócolis", secao: "Hortifrúti", unidade: "xicara", dica: "1 maço rende cerca de 4 xícaras." },
  pepino: { nome: "pepino", plural: "pepinos", secao: "Hortifrúti", unidade: "un" },
  pimentao: { nome: "pimentão", plural: "pimentões", secao: "Hortifrúti", unidade: "un" },
  abobora: { nome: "abóbora (cabotiá)", plural: "abóbora (cabotiá)", secao: "Hortifrúti", unidade: "xicara", dica: "Meia abóbora pequena rende cerca de 4 xícaras em cubos." },
  "batata-doce": { nome: "batata-doce média", plural: "batatas-doces médias", secao: "Hortifrúti", unidade: "un" },
  batata: { nome: "batata média", plural: "batatas médias", secao: "Hortifrúti", unidade: "un" },
  chuchu: { nome: "chuchu", plural: "chuchus", secao: "Hortifrúti", unidade: "un" },

  // Temperos e óleos
  azeite: { nome: "azeite", plural: "azeite", secao: "Temperos e óleos", unidade: "colher-sopa" },
  sal: { nome: "sal", plural: "sal", secao: "Temperos e óleos", unidade: "a-gosto" },
  pimenta: { nome: "pimenta-do-reino", plural: "pimenta-do-reino", secao: "Temperos e óleos", unidade: "a-gosto" },
  oregano: { nome: "orégano", plural: "orégano", secao: "Temperos e óleos", unidade: "a-gosto" },
  paprica: { nome: "páprica doce", plural: "páprica doce", secao: "Temperos e óleos", unidade: "colher-cha" },
  canela: { nome: "canela em pó", plural: "canela em pó", secao: "Temperos e óleos", unidade: "pitada" },
};
