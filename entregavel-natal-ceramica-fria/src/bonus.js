// Conteúdo dos bônus
const { P } = require('./shapes');

// ───── Bônus 4: 15 enfeites para fazer com as crianças ─────
const CRIANCAS = [
  { nome: 'Estrela de confeitos', shape: 'starRound', colors: [P.white, null, P.red], idade: '4+', tempo: '15 min',
    passos: ['O adulto abre a massa com 6 mm.', 'A criança corta a estrela com cortador de biscoito.', 'Ela faz bolinhas coloridas bem pequenas (os “confeitos”) e pressiona na estrela.', 'O adulto faz o furo com canudo.'],
    adulto: 'Abrir a massa e furar.' },
  { nome: 'Coração de dedinho', shape: 'heart', colors: [P.pink, null, P.red], idade: '3+', tempo: '10 min',
    passos: ['Corte um coração com cortador.', 'A criança pressiona o dedo indicador várias vezes, formando um desenho.', 'Escreva o nome e a idade com um palito.', 'Faça o furo e deixe secar.'],
    adulto: 'Escrever o nome.' },
  { nome: 'Boneco de neve de bolinhas', shape: 'snowman', colors: [P.white, P.red], idade: '4+', tempo: '20 min',
    passos: ['A criança faz uma bola grande e uma menor.', 'Achata as duas sobre a mesa e encosta uma na outra.', 'Faz um cachecol com um rolinho colorido.', 'Desenha olhos e botões com caneta depois de seco.'],
    adulto: 'Ajudar a colar o cachecol.' },
  { nome: 'Árvore de bolinhas', shape: 'tree', colors: [P.green, P.brown, P.red], idade: '4+', tempo: '20 min',
    passos: ['O adulto corta a árvore pelo molde.', 'A criança faz bolinhas de várias cores.', 'Ela distribui e pressiona as bolinhas como enfeites.', 'Cole uma estrela no topo.'],
    adulto: 'Cortar com estilete.' },
  { nome: 'Plaquinha da mãozinha', shape: 'hand', colors: [P.white, null, P.gold], idade: '2+', tempo: '10 min',
    passos: ['Abra a massa com 7 mm.', 'A criança abre a mão e pressiona sobre a massa.', 'Corte um círculo em volta.', 'Escreva o nome e “Natal 2026”.'],
    adulto: 'Tudo, com a criança só carimbando a mão.' },
  { nome: 'Bola de Natal listrada', shape: 'ball', colors: [P.white, P.red, P.red], idade: '5+', tempo: '20 min',
    passos: ['Corte um círculo com um copo.', 'A criança faz rolinhos finos de duas cores.', 'Ela cola os rolinhos em listras sobre o círculo.', 'O adulto corta as sobras na borda.'],
    adulto: 'Aparar as bordas.' },
  { nome: 'Floquinho de texturas', shape: 'snowflake', colors: [P.white, null, P.blue], idade: '5+', tempo: '15 min',
    passos: ['Corte o floco com cortador ou pelo molde.', 'A criança marca texturas com garfo, palito e tampinhas.', 'Passe glitter atóxico depois de seco.', 'Amarre uma fita azul.'],
    adulto: 'Cortar o floco.' },
  { nome: 'Pinguim de bolinhas', shape: 'penguin', colors: [P.black], idade: '5+', tempo: '25 min',
    passos: ['A criança faz uma bola preta e achata em oval.', 'Cola uma oval branca menor na barriga.', 'Faz um triângulo laranja para o bico.', 'Coloca um gorro de massa vermelha.'],
    adulto: 'Ajudar na barriga e no gorro.' },
  { nome: 'Guirlanda de rolinho', shape: 'wreath', colors: [P.greenLight], idade: '4+', tempo: '15 min',
    passos: ['A criança faz um rolinho verde comprido.', 'Fecha o rolinho em círculo.', 'Cola bolinhas vermelhas por cima.', 'Amarra uma fita em laço.'],
    adulto: 'Ajudar a fechar o círculo.' },
  { nome: 'Bengala trançada', shape: 'candycane', colors: [P.white], idade: '5+', tempo: '15 min',
    passos: ['A criança faz um rolinho branco e um vermelho.', 'Torce os dois juntos, como corda.', 'Curva uma das pontas.', 'Deixa secar deitada.'],
    adulto: 'Ajudar a torcer sem quebrar.' },
  { nome: 'Rena de dedinhos', shape: 'reindeer', colors: [P.kraft, P.brown], idade: '3+', tempo: '15 min',
    passos: ['Corte uma oval bege.', 'A criança pressiona dois dedos no alto (marcas dos chifres).', 'Cole um nariz vermelho redondo.', 'Pinte os chifres com marrom dentro das marquinhas.'],
    adulto: 'Pintar os olhos.' },
  { nome: 'Presentinho quadrado', shape: 'gift', colors: [P.white, P.red, P.red], idade: '4+', tempo: '15 min',
    passos: ['Corte um quadrado de massa.', 'A criança cola duas tiras coloridas em cruz.', 'Faz um laço com duas gotinhas.', 'Escreve o nome de quem vai ganhar, depois de seco.'],
    adulto: 'Cortar o quadrado.' },
  { nome: 'Biscoitinho de gengibre', shape: 'gingerbread', colors: [P.brown], idade: '3+', tempo: '15 min',
    passos: ['A criança corta com cortador de boneco.', 'Marca olhos e botões com a ponta de um lápis.', 'Depois de seco, faz o “glacê” com caneta branca.', 'Amarra uma fita xadrez.'],
    adulto: 'Abrir a massa.' },
  { nome: 'Lua dorminhoca', shape: 'moon', colors: [P.white, null, P.gold], idade: '4+', tempo: '15 min',
    passos: ['Corte a lua pelo molde.', 'A criança faz uma estrelinha e cola ao lado.', 'Desenha olhinhos fechados depois de seco.', 'Pinta bochechas com lápis de cor rosa.'],
    adulto: 'Cortar a lua.' },
  { nome: 'Estrelinha com nome', shape: 'star', colors: [P.white, null, P.gold], idade: '5+', tempo: '15 min',
    passos: ['Corte a estrela com cortador.', 'A criança escolhe as letras do nome e carimba.', 'Faça o furo no topo.', 'Pinte dentro das letras com dourado.'],
    adulto: 'Organizar as letras na ordem.' },
];

// ───── Bônus 5: Vila Natalina Iluminada ─────
// Medidas em cm: W = largura da frente, D = profundidade, H = altura da parede, R = altura do telhado (cumeeira)
const VILA = [
  { nome: 'Casinha Branca', W: 6, D: 5, H: 6, R: 3, janelas: 2, desc: 'A casinha base da vila. Fachada lisa, duas janelas e porta vermelha.', detalhes: ['Porta vermelha em arco', 'Guirlanda mini na porta', 'Neve no telhado'] },
  { nome: 'Casa com Chaminé', W: 7, D: 5, H: 6, R: 3.5, janelas: 2, chamine: true, desc: 'Ganha uma chaminé de tijolinhos marcados com palito.', detalhes: ['Chaminé de 1,5 × 1,5 × 3 cm', 'Tijolinhos marcados com palito', 'Fumaça de algodão (opcional)'] },
  { nome: 'Padaria da Vila', W: 8, D: 5, H: 6.5, R: 3, janelas: 2, desc: 'Fachada larga, com toldo listrado e vitrine.', detalhes: ['Toldo listrado vermelho e branco', 'Placa “Padaria” em plaquinha', 'Mini pães de massa na vitrine'] },
  { nome: 'Correio', W: 6, D: 5, H: 7, R: 3, janelas: 3, desc: 'Mais alto, com relógio na fachada e caixinha de cartas.', detalhes: ['Relógio redondo dourado', 'Caixa de correio vermelha', 'Janelas em duas alturas'] },
  { nome: 'Chalé Alpino', W: 7, D: 6, H: 5, R: 5, janelas: 2, desc: 'Paredes baixas e telhado bem inclinado, como nas montanhas.', detalhes: ['Telhado bem alto e com bastante neve', 'Varandinha de palitos', 'Coração vazado no frontão'] },
  { nome: 'Loja de Brinquedos', W: 8, D: 5, H: 7, R: 3, janelas: 2, desc: 'Vitrine grande e colorida, a preferida das crianças.', detalhes: ['Vitrine com mini presentes', 'Placa “Brinquedos”', 'Bengalas doces na porta'] },
  { nome: 'Casa da Vovó', W: 6, D: 5, H: 5.5, R: 3.5, janelas: 2, desc: 'Pequena e aconchegante, com floreira e varal de luzes.', detalhes: ['Floreira com bicos-de-papagaio', 'Banco na frente', 'Cortininhas pintadas nas janelas'] },
];
const IGREJA = { nome: 'Igreja da Vila', W: 7, D: 9, H: 8, R: 4, torre: { L: 3, H: 6, ponta: 4 } };

// ───── Bônus 6: Lista de materiais ─────
const MATERIAIS = [
  { grupo: 'Massa', itens: [
    ['Cerâmica fria pronta (pacote de 500 g a 1 kg)', 'Papelaria / loja de artesanato', 'Massa caseira (receita abaixo)'],
    ['Creme hidratante comum', 'Farmácia / mercado', 'Vaselina líquida'],
    ['Saquinhos plásticos ou filme PVC', 'Mercado', 'Sacolas de pão limpas'],
  ] },
  { grupo: 'Ferramentas', itens: [
    ['Rolo de abrir massa (pequeno)', 'Loja de artesanato / utilidades', 'Garrafa de vidro lisa'],
    ['Palitos-guia de 5 mm (2 réguas)', 'Papelaria', 'Dois palitos de picolé empilhados'],
    ['Estilete de ponta fina', 'Papelaria', 'Faca sem serra bem afiada'],
    ['Palitos de dente e de churrasco', 'Mercado', '—'],
    ['Canudos de espessuras variadas', 'Mercado', 'Tampa de caneta'],
    ['Cortadores de biscoito (estrela, coração, círculo)', 'Loja de festas / utilidades', 'Copo e tampinhas'],
    ['Escova de dentes velha', 'Casa', 'Esponja de lavar louça (lado áspero)'],
    ['Pincéis (fino, médio e chato)', 'Papelaria', '—'],
    ['Lixa d’água fina (nº 400 a 600)', 'Loja de construção', 'Lixa de unha fina'],
  ] },
  { grupo: 'Texturas', itens: [
    ['Retalhos de renda ou toalhinha de crochê', 'Armarinho', 'Toalhinhas antigas da família'],
    ['Carimbos de letras e números', 'Papelaria / internet', 'Letras de massinha infantil'],
    ['Folhas naturais', 'Jardim', '—'],
  ] },
  { grupo: 'Cor e acabamento', itens: [
    ['Tinta a óleo em bisnaga (para tingir a massa)', 'Loja de artesanato', 'Guache ou acrílica (um pouco menos firme)'],
    ['Tinta acrílica: branco, vermelho, verde, marrom, preto', 'Papelaria', 'Tinta PVA'],
    ['Tinta ou caneta dourada', 'Papelaria', 'Sombra dourada de maquiagem + verniz'],
    ['Verniz acrílico à base de água (fosco ou brilhante)', 'Loja de artesanato', 'Cola branca diluída (proteção leve)'],
    ['Caneta permanente preta de ponta fina', 'Papelaria', '—'],
    ['Blush (bochechas)', 'Casa', 'Lápis de cor rosa raspado'],
  ] },
  { grupo: 'Colagem e montagem', itens: [
    ['Cola branca (PVA)', 'Papelaria', '—'],
    ['Cola quente (para peças secas)', 'Papelaria', 'Cola instantânea em gel'],
    ['Arame fino dourado e pinos de bijuteria', 'Armarinho / bijuteria', 'Clipes abertos'],
    ['Fitas, barbante cru, juta e fio de nylon', 'Armarinho', 'Fios que você já tem'],
  ] },
  { grupo: 'Para a Vila Iluminada', itens: [
    ['Velas LED a pilha (tipo rechaud)', 'Loja de utilidades / internet', 'Fio de fada (cordão de LED) a pilha'],
    ['Base de MDF ou tábua', 'Madeireira / artesanato', 'Bandeja ou tampa de caixa'],
    ['Algodão ou neve artificial', 'Mercado / loja de festas', 'Bicarbonato + cola (neve texturizada)'],
  ] },
];

module.exports = { CRIANCAS, VILA, IGREJA, MATERIAIS };
