// Guia principal (50 enfeites), Kit Básico (20) e Bônus 1 (moldes)
const { C, svgArt, page, cover, pack, calib, moldeSvg } = require('./layout');
const { ENFEITES, CATEGORIAS } = require('./enfeites');
const { P } = require('./shapes');

// ───── ícones dos passos ─────
const I = {
  rolo: '<rect x="4" y="9" width="16" height="6" rx="3"/><path d="M1 12h3M20 12h3"/>',
  corte: '<path d="M4 20 L16 8 L19 11 L7 23 Z" transform="translate(0 -3)"/><path d="M16 5 L19 2 L22 5 L19 8"/>',
  textura: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h0M11 9h0M15 9h0M9 13h0M13 13h0M17 13h0M7 16h0M11 16h0M15 16h0" stroke-width="2.6"/>',
  furo: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="8" r="2"/>',
  cola: '<path d="M9 9h6v12H9z"/><path d="M10 9 L12 3 L14 9"/><path d="M12 21v2"/>',
  secar: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  pincel: '<path d="M14 3 L21 10 L12 19 L5 12 Z" transform="scale(.8) translate(4 0)"/><path d="M6 15 C3 17 3 21 2 22 C5 22 8 21 9 18"/>',
  modelar: '<circle cx="8" cy="15" r="4"/><circle cx="16" cy="9" r="3"/><path d="M14 18 C17 18 21 17 21 14"/>',
  arame: '<path d="M12 22V9"/><circle cx="12" cy="6" r="3"/>',
  luz: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z"/>',
};
function iconFor(t) {
  const s = t.toLowerCase();
  const first = s.split(' ')[0];
  const byVerb = { abra: 'rolo', corte: 'corte', recorte: 'corte', vaze: 'corte', texturize: 'textura', marque: 'textura', carimbe: 'textura', pressione: 'textura', fure: 'furo', cole: 'cola', seque: 'secar', pinte: 'pincel', passe: 'pincel', escreva: 'pincel', faça: 'modelar', modele: 'modelar', cubra: 'modelar', espete: 'arame', torça: 'modelar', enrole: 'modelar', alise: 'modelar', arredonde: 'modelar', afine: 'modelar', tinja: 'modelar', coloque: 'modelar', distribua: 'modelar', monte: 'cola', complete: 'cola', depois: 'secar', com: 'textura', para: 'modelar', no: 'modelar', em: 'modelar', por: 'modelar', começando: 'corte', suba: 'corte', peça: 'textura', role: 'rolo', alinhe: 'textura', retire: 'textura', puxe: 'textura', posicione: 'corte', confira: 'corte', empilhe: 'cola', ondule: 'modelar' };
  if (byVerb[first]) {
    if (s.includes('seque') && !['cole', 'corte', 'abra'].includes(first)) return 'secar';
    return byVerb[first];
  }
  if (s.includes('seque')) return 'secar';
  if (s.includes('led')) return 'luz';
  return 'modelar';
}
const icon = (k) => `<svg viewBox="0 0 24 24" width="7mm" height="7mm" fill="none" stroke="${C.green}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;

const catOf = (id) => CATEGORIAS.find((c) => c.id === id);

// ───── moldes ─────
function moldeItems(list) {
  return list.map((e) => {
    const shape = e.moldeShape || e.shape;
    const size = (e.moldeSize || e.size) * 10;
    return { e, shape, size, w: Math.max(size + 4, 38), h: size + 13 };
  });
}
function moldePages(list, title, footNote) {
  const W = 178, H = 226;
  const packed = pack(moldeItems(list), W, H, 5);
  const map = {};
  const pages = packed.map((items, pi) => {
    items.forEach((it) => { map[it.e.n] = pi; });
    const cells = items.map((it) => `<div style="position:absolute;left:${it.x}mm;top:${it.y}mm;width:${it.w}mm;height:${it.h}mm;display:flex;flex-direction:column;align-items:center">
      ${moldeSvg(it.shape, it.size)}
      <div style="font-size:7.5pt;line-height:1.2;text-align:center;margin-top:2mm"><b style="color:${C.red}">${String(it.e.n).padStart(2, '0')}</b> ${it.e.nome}<br><span style="color:${C.muted}">${it.e.moldeShape ? 'molde-base · ' : ''}${(it.e.moldeSize || it.e.size)} cm</span></div></div>`).join('');
    return page(`<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:4mm"><div><div class="kicker">${title}</div><div style="font-family:Playfair;font-size:15pt;color:${C.red};font-weight:700">Moldes em tamanho real · folha ${pi + 1} de ${packed.length}</div></div></div>${calib}
      <div style="position:relative;margin-top:4mm;height:${H}mm;background:#fff;border:1px dashed ${C.line};border-radius:2mm;padding:0">
      <div style="position:absolute;inset:3mm">${cells}</div></div>`, '', false);
  });
  return { pages, map, count: packed.length };
}

// ───── capítulos de introdução ─────
function introPages({ basico }) {
  const total = basico ? 20 : 50;
  const pages = [];

  pages.push(page(`
    <div class="kicker">Boas-vindas</div>
    <h2>Que bom ter você aqui!</h2>
    <p class="lead">Este guia foi feito para você criar enfeites de Natal lindos com as próprias mãos, mesmo que nunca tenha mexido com cerâmica fria. Tudo o que você precisa está aqui: a massa, as ferramentas, as técnicas e o passo a passo de ${total} peças.</p>
    <div class="grid2" style="margin-top:6mm">
      <div class="box"><h4>Como usar este guia</h4><ul class="clean">
        <li>Leia os capítulos 1 a 4 antes da primeira peça. São rápidos e evitam os erros mais comuns.</li>
        <li>Comece pelos enfeites marcados como <b>Fácil</b>.</li>
        <li>${basico ? 'Os moldes de todas as peças estão no final deste guia.' : 'Imprima os moldes no <b>Bônus 1</b>. Cada enfeite indica a folha do molde.'}</li>
        <li>Separe uma tarde, ligue uma música e faça várias peças de uma vez: a massa rende mais.</li></ul></div>
      <div class="box gold"><h4>O que cada página traz</h4><ul class="clean">
        <li><b>Nível, tempo e secagem</b> para você se planejar.</li>
        <li><b>Quanto de massa</b> a peça usa.</li>
        <li><b>Materiais</b> específicos daquela peça.</li>
        <li><b>Passo a passo</b> com ícones de cada ação.</li>
        <li><b>Dica</b> de quem já fez e <b>variação</b> para criar outras versões.</li></ul></div>
    </div>
    <div class="box red" style="margin-top:2mm;display:flex;gap:6mm;align-items:center">
      <div style="flex:none">${svgArt('star', [P.white, null, P.gold], 28)}</div>
      <div><h3 style="margin-top:0">Sua primeira peça hoje</h3><p style="margin:0">Faça a <b>Estrela com renda</b> (enfeite 01). Ela usa só massa branca e um retalho de renda, leva 15 minutos e já mostra como a técnica é simples. No dia seguinte ela estará seca e pronta para a árvore.</p></div>
    </div>
    <p style="font-size:9pt;color:${C.muted};margin-top:4mm">Os tempos de secagem são para clima ameno. Em dias úmidos ou frios, conte com até o dobro. Os resultados variam conforme a massa, o clima e a prática de cada pessoa.</p>
  `));

  // Sumário
  const list = basico ? ENFEITES.filter((e) => e.basico) : ENFEITES;
  const cats = CATEGORIAS.filter((c) => list.some((e) => e.cat === c.id));
  pages.push(page(`
    <div class="kicker">Sumário</div><h2>O que você vai encontrar</h2>
    <div class="grid2" style="gap:3mm 8mm;margin-bottom:3mm">
      <div><h4>Antes de começar</h4><ul class="clean" style="font-size:9.5pt">
        <li>1. O que é cerâmica fria</li><li>2. A massa: pronta ou caseira</li><li>3. Ferramentas</li><li>4. As 8 técnicas básicas</li><li>5. Como colorir a massa</li></ul></div>
      <div><h4>Depois das peças</h4><ul class="clean" style="font-size:9.5pt">
        <li>Acabamentos e variações</li><li>Problemas comuns e soluções</li>${basico ? '<li>Moldes em tamanho real</li>' : '<li>Próximos passos e bônus</li>'}</ul></div>
    </div>
    <div style="columns:2;column-gap:8mm;font-size:9pt">
      ${cats.map((c) => `<div style="break-inside:avoid;margin-bottom:3mm"><div style="font-family:Playfair;color:${C.red};font-weight:700;font-size:11pt;margin-bottom:1mm">${c.nome}</div>
        ${list.filter((e) => e.cat === c.id).map((e) => `<div style="display:flex;gap:2mm;border-bottom:1px dotted ${C.line};padding:.5mm 0"><b style="color:${C.gold};width:6mm">${String(basico ? list.indexOf(e) + 1 : e.n).padStart(2, '0')}</b><span style="flex:1">${e.nome}</span><span style="color:${C.muted}">${e.nivel}</span></div>`).join('')}</div>`).join('')}
    </div>`));

  // Cap 1 e 2
  pages.push(page(`
    <div class="kicker">Capítulo 1</div><h2>O que é cerâmica fria</h2>
    <p class="lead">Cerâmica fria é uma massa de modelar que <b>endurece sozinha, ao ar</b>, sem forno. Depois de seca, fica firme, leve e com aparência de porcelana. É perfeita para enfeites porque aceita textura, tinta e verniz.</p>
    <div class="grid3" style="margin:5mm 0">
      <div class="box"><h4>Sem forno</h4><p style="margin:0">Seca em temperatura ambiente, de 24 a 72 h (peças grandes, até 5 dias).</p></div>
      <div class="box"><h4>Barata</h4><p style="margin:0">Com um pacote de 500 g você faz de 15 a 25 enfeites.</p></div>
      <div class="box"><h4>Duradoura</h4><p style="margin:0">Com verniz e guardada no seco, a peça dura muitos Natais.</p></div>
    </div>
    <h3>Três coisas que você precisa saber</h3>
    <ul class="clean">
      <li><b>Ela encolhe um pouco ao secar</b> (cerca de 10%). Por isso os moldes já têm uma pequena folga.</li>
      <li><b>Ela resseca exposta ao ar.</b> Deixe sempre a massa que não está usando embrulhada em plástico.</li>
      <li><b>Ela não gosta de umidade nem de calor.</b> Nunca use vela de verdade perto das peças: use vela LED.</li>
    </ul>
    <div class="kicker" style="margin-top:7mm">Capítulo 2</div><h2>A massa: pronta ou caseira</h2>
    <div class="grid2">
      <div class="box"><h4>Massa pronta</h4><p>Vende em papelarias e lojas de artesanato, em pacotes de 500 g ou 1 kg. É prática, já vem no ponto e tem cor uniforme.</p><p style="margin:0"><b>Ideal para:</b> quem quer começar hoje e não quer ir para o fogão.</p></div>
      <div class="box"><h4>Massa caseira</h4><p>Feita com amido de milho e cola branca, custa bem menos e rende cerca de 400 g por receita.</p><p style="margin:0"><b>Ideal para:</b> quem vai fazer muitas peças ou vender.</p></div>
    </div>`));

  // Receita
  pages.push(page(`
    <div class="kicker">Capítulo 2 · Receita</div><h2>Massa caseira de cerâmica fria</h2>
    <div class="grid2" style="grid-template-columns:.9fr 1.1fr">
      <div class="box gold"><h4>Ingredientes (rende cerca de 400 g)</h4><ul class="clean">
        <li>1 xícara (chá) de amido de milho</li><li>1 xícara (chá) de cola branca PVA</li><li>1 colher (sopa) de vaselina líquida (ou óleo de cozinha)</li><li>1 colher (sopa) de suco de limão (ou vinagre branco)</li><li>Creme hidratante para sovar</li></ul>
        <h4 style="margin-top:4mm">Utensílios</h4><ul class="clean"><li>Panela antiaderente usada só para artesanato</li><li>Colher de silicone</li><li>Filme plástico</li></ul></div>
      <div>
        ${[
          'Coloque todos os ingredientes, ainda frios, na panela e misture até dissolver todos os grumos.',
          'Leve ao fogo <b>baixo</b>, mexendo sem parar, raspando o fundo e as laterais.',
          'Em 5 a 8 minutos, a massa engrossa e vira uma bola que solta da panela. Desligue.',
          'Coloque a massa sobre uma superfície untada com creme. Espere amornar o suficiente para tocar.',
          'Sove por 5 minutos, com as mãos untadas de creme, até ficar lisa e elástica.',
          'Embrulhe bem em filme plástico e deixe descansar 8 horas antes de usar.',
        ].map((t, i) => `<div style="display:flex;gap:3mm;margin-bottom:3mm"><span class="num-step">${i + 1}</span><div>${t}</div></div>`).join('')}
      </div>
    </div>
    <div class="grid2" style="margin-top:3mm">
      <div class="box green"><h4>No micro-ondas</h4><p style="margin:0">Misture tudo numa tigela de vidro e aqueça de 30 em 30 segundos, mexendo bem a cada vez. No total leva de 1 min 30 s a 2 min 30 s, dependendo do aparelho. Pare quando a massa formar uma bola.</p></div>
      <div class="box"><h4>Como guardar</h4><p style="margin:0">Em filme plástico, dentro de um saco bem fechado, em local fresco. Dura cerca de 1 mês. Se ressecar, sove com um pouco de creme.</p></div>
    </div>
    <div class="box" style="border-color:${C.red}"><h4 style="color:${C.red}">Ponto certo e cuidados</h4><ul class="clean">
      <li><b>Grudando nas mãos?</b> Faltou cozinhar. Volte ao fogo por mais 1 minuto ou sove com um pouco de amido.</li>
      <li><b>Esfarelando e rachando?</b> Passou do ponto. Sove com creme, aos poucos, até voltar a ficar macia.</li>
      <li>O preparo no fogão é tarefa de adulto. A massa não é comestível: mantenha longe de crianças pequenas e animais.</li></ul></div>`));

  // Ferramentas
  const tools = [
    ['rolo', 'Rolo pequeno', 'Para abrir a massa. Uma garrafa de vidro lisa também serve.'],
    ['rolo', 'Palitos-guia de 5 mm', 'Duas réguas (ou palitos de picolé) dos lados da massa deixam a espessura igual.'],
    ['corte', 'Estilete de ponta fina', 'Corta contornos limpos. Use sempre com a lâmina em pé.'],
    ['textura', 'Palitos e canudos', 'Palito marca detalhes; canudo faz furos e marquinhas de sorriso.'],
    ['textura', 'Rendas e carimbos', 'Dão textura em segundos e deixam a peça com cara de loja.'],
    ['modelar', 'Creme hidratante', 'Evita que a massa grude e ajuda a alisar as bordas.'],
    ['cola', 'Cola branca e pincel', 'Une as partes. Dilua em água (1:1) para colar massa úmida.'],
    ['pincel', 'Tintas, verniz e pincéis', 'Para colorir, dar brilho e proteger a peça.'],
    ['secar', 'Papel-manteiga', 'Base de secagem: a peça não gruda e respira por baixo.'],
  ];
  pages.push(page(`
    <div class="kicker">Capítulo 3</div><h2>Ferramentas</h2>
    <p class="lead">Você não precisa de nada caro. A maior parte das ferramentas já está na sua cozinha ou numa papelaria. A lista completa, com substituições, está no ${basico ? 'final deste guia' : 'Bônus 6'}.</p>
    <div class="grid3" style="margin-top:5mm">${tools.map(([ic, t, d]) => `<div class="box" style="margin:0">${icon(ic)}<div style="font-weight:800;margin:1.5mm 0 1mm">${t}</div><div style="font-size:9pt;color:${C.muted}">${d}</div></div>`).join('')}</div>
    <div class="box gold" style="margin-top:6mm"><h4>Monte sua mesa de trabalho</h4><p style="margin:0">Forre a mesa com um plástico liso ou uma placa de vidro. Deixe à mão um pote de creme, um pano úmido e a massa embrulhada. Trabalhe com as mãos limpas: a massa branca pega qualquer sujeira.</p></div>`));

  // Técnicas
  const tecnicas = [
    ['rolo', 'Abrir na espessura certa', 'Coloque a massa entre dois plásticos, com os palitos-guia dos lados, e passe o rolo apoiando nos palitos. Assim toda a peça fica com 5 mm (ou a espessura indicada).'],
    ['corte', 'Cortar pelo molde', 'Imprima e recorte o molde. Apoie sobre a massa e contorne com o estilete em pé, em movimentos curtos. Retire primeiro as sobras e só depois o molde.'],
    ['modelar', 'Alisar as bordas', 'Passe o dedo levemente untado de creme por todo o contorno. Esta etapa é o que dá o acabamento de peça profissional.'],
    ['textura', 'Texturizar', 'Renda, folhas, carimbos, garfo ou escova: pressione sobre a massa antes de cortar (renda) ou depois (carimbos e marcas).'],
    ['cola', 'Colar as partes', 'Massa úmida com massa úmida: passe cola diluída (1:1 com água) e pressione de leve. Peça seca: use cola branca grossa ou cola quente.'],
    ['furo', 'Fazer o furo', 'Use um canudo e gire ao retirar. Deixe pelo menos 8 mm entre o furo e a borda para não quebrar.'],
    ['modelar', 'Bolinhas, gotas e rolinhos', 'Bolinha: role na palma da mão. Gota: role só de um lado. Rolinho: role sobre a mesa com uma tampa lisa para ficar uniforme.'],
    ['secar', 'Secar sem empenar', 'Seque sobre papel-manteiga, longe do sol e do vento. Vire a peça na metade do tempo. Peças finas: depois de 12 h, coloque um peso leve por cima.'],
  ];
  pages.push(page(`
    <div class="kicker">Capítulo 4</div><h2>As 8 técnicas básicas</h2>
    <p class="lead">Todos os enfeites do guia são combinações destas oito técnicas. Pratique cada uma uma vez e você estará pronta para qualquer peça.</p>
    <div class="grid2" style="margin-top:4mm;gap:4mm">${tecnicas.map(([ic, t, d], i) => `<div class="box" style="margin:0;display:flex;gap:3.5mm"><div style="flex:none;text-align:center"><span class="num-step" style="background:${C.green}">${i + 1}</span><div style="margin-top:2mm">${icon(ic)}</div></div><div><div style="font-weight:800;font-size:11pt;color:${C.red};margin-bottom:1mm">${t}</div><div style="font-size:9.5pt">${d}</div></div></div>`).join('')}</div>`));

  // Cores
  const cores = [
    ['Vermelho Natal', '#A8322D', 'vermelho + pontinha de marrom'],
    ['Verde pinheiro', '#2F5A3E', 'verde + pontinha de preto'],
    ['Verde-sálvia', '#7E9B7F', 'verde + branco + pontinha de ocre'],
    ['Marfim', '#F3EBDD', 'branco + pontinha de ocre'],
    ['Caramelo (biscoito)', '#A8774F', 'ocre + marrom'],
    ['Cor de pele', '#EBC3B2', 'branco + pontinha de vermelho + ocre'],
    ['Kraft / bege', '#D8C3A5', 'branco + ocre + pontinha de marrom'],
    ['Grafite', '#4A4440', 'preto + branco'],
    ['Dourado', '#C9A24B', 'massa ocre + tinta dourada depois'],
  ];
  pages.push(page(`
    <div class="kicker">Capítulo 5</div><h2>Como colorir a massa</h2>
    <p class="lead">Existem dois caminhos: <b>tingir a massa</b> antes de modelar (cor uniforme, sem pintura) ou <b>pintar a peça seca</b> (mais detalhes). Os dois funcionam, e você pode combinar.</p>
    <div class="grid2" style="margin:4mm 0">
      <div class="box"><h4>Tingir a massa</h4><ul class="clean"><li>Pegue a tinta (a óleo é a melhor) com a ponta de um palito.</li><li>Faça um buraquinho na massa, coloque a tinta e feche.</li><li>Sove até a cor ficar uniforme, sem riscos.</li><li>Comece com pouco: é fácil escurecer e difícil clarear.</li><li>A massa seca fica um tom mais escura.</li></ul></div>
      <div class="box"><h4>Pintar a peça seca</h4><ul class="clean"><li>Use tinta acrílica ou PVA.</li><li>Duas camadas finas cobrem melhor do que uma grossa.</li><li>Espere secar 1 h entre camadas.</li><li>Finalize sempre com verniz para proteger.</li></ul></div>
    </div>
    <h3>Receitas de cor da coleção</h3>
    <div class="grid3" style="gap:3mm">${cores.map(([n, hex, r]) => `<div style="display:flex;gap:3mm;align-items:center;background:${C.paper};border:1px solid ${C.line};border-radius:3mm;padding:2.5mm"><div style="width:11mm;height:11mm;border-radius:50%;background:${hex};border:1px solid rgba(0,0,0,.1);flex:none"></div><div><div style="font-weight:800;font-size:9.5pt">${n}</div><div style="font-size:8.5pt;color:${C.muted}">${r}</div></div></div>`).join('')}</div>`));
  return pages;
}

function dividerPage(cat, list, startIndexFn, red) {
  const items = list.filter((e) => e.cat === cat.id);
  const arts = items.slice(0, 3).map((e) => svgArt(e.shape, e.colors, 42)).join('');
  return page(`<div class="kicker" style="color:${C.goldLight}">Coleção</div>
    <h2>${cat.nome}</h2><p>${cat.desc}</p>
    <div class="list">${items.map((e) => `<div><b>${String(startIndexFn(e)).padStart(2, '0')}</b>${e.nome}</div>`).join('')}</div>
    <div class="arts">${arts}</div>`, `divider ${red ? 'red' : ''}`, true);
}

function ringBg(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.8 ? `background:radial-gradient(circle at 50% 40%, #3D6B4C 0%, ${C.green} 55%, ${C.greenDark} 100%)` : '';
}

function ornamentPage(e, num, moldeRef) {
  const cat = catOf(e.cat);
  const chips = [['Nível', e.nivel], ['Modelagem', e.tempo], ['Secagem', e.secagem], ['Massa', e.massa], ['Tamanho', `${e.size} cm`]];
  return page(`
    <div style="display:flex;align-items:center;gap:3mm;margin-bottom:2mm">
      <span style="font-family:Playfair;font-size:13pt;font-weight:700;color:#fff;background:${C.red};border-radius:50%;width:11mm;height:11mm;display:inline-flex;align-items:center;justify-content:center">${String(num).padStart(2, '0')}</span>
      <span class="kicker" style="margin:0">${cat.nome}</span></div>
    <h2 style="font-size:32pt;margin-bottom:4mm">${e.nome}</h2>
    <div style="display:flex;gap:2mm;flex-wrap:wrap;margin-bottom:5mm">${chips.map(([k, v]) => `<div style="background:${C.paper};border:1px solid ${C.line};border-radius:10mm;padding:1.5mm 4mm;font-size:9.5pt"><span style="color:${C.muted}">${k}:</span> <b>${v}</b></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:84mm 1fr;gap:8mm;align-items:center;margin-bottom:7mm">
      <div class="ornament-ring" style="width:84mm;height:84mm;display:flex;align-items:center;justify-content:center;${ringBg(e.colors[0])}">${svgArt(e.shape, e.colors, 62)}</div>
      <div>
        <h4>Você vai precisar</h4>
        <ul class="clean" style="font-size:11pt">${e.materiais.map((m) => `<li>${m}</li>`).join('')}<li style="color:${C.muted}">Kit básico: rolo, estilete, palito, creme e papel-manteiga</li></ul>
        <div style="margin-top:3mm;background:${C.green};color:#fff;border-radius:3mm;padding:3mm 4mm;font-size:10pt;display:flex;gap:2.5mm;align-items:center">
          <svg viewBox="0 0 24 24" width="6mm" height="6mm" fill="none" stroke="${C.goldLight}" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5 L20 18M8.5 16.5 L20 6"/></svg>
          <span>${moldeRef}</span></div>
      </div>
    </div>
    <h3 style="margin-top:0;font-size:16pt">Passo a passo</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3.5mm">
      ${e.passos.map((t, i) => `<div style="display:flex;gap:2.5mm;background:${C.paper};border:1px solid ${C.line};border-radius:3mm;padding:3.6mm 4mm;align-items:flex-start;min-height:23mm">
        <div style="flex:none;display:flex;flex-direction:column;align-items:center;gap:1mm"><span class="num-step">${i + 1}</span>${icon(iconFor(t))}</div>
        <div style="font-size:10.6pt;line-height:1.45">${t}</div></div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3.5mm;margin-top:5mm">
      <div class="box gold" style="margin:0;padding:4.5mm 5mm"><h4 style="color:${C.goldDark || '#A9832F'}">💡 Dica de quem já fez</h4><div style="font-size:10.5pt">${e.dica}</div></div>
      <div class="box green" style="margin:0;padding:4.5mm 5mm"><h4 style="color:${C.green}">✨ Variação</h4><div style="font-size:10.5pt">${e.variacao}</div></div>
    </div>`);
}

function closingPages({ basico }) {
  const pages = [];
  pages.push(page(`
    <div class="kicker">Acabamento</div><h2>Acabamentos e variações</h2>
    <p class="lead">O mesmo enfeite pode ter vários “rostos”. Escolha um acabamento e aplique em toda a coleção: sua árvore fica com unidade e cara de decoração de loja.</p>
    <table><tr><th style="width:28%">Acabamento</th><th>Como fazer</th><th style="width:26%">Combina com</th></tr>
      <tr><td><b>Branco fosco</b></td><td>Massa branca sem pintura + verniz fosco.</td><td>Estrela, floco, anjinho, renda</td></tr>
      <tr><td><b>Bordas douradas</b></td><td>Passe tinta dourada com o dedo só nas bordas da peça seca.</td><td>Estrelas, corações, plaquinhas</td></tr>
      <tr><td><b>Pincel seco</b></td><td>Pincel quase sem tinta, passado de leve: destaca só o relevo.</td><td>Peças texturizadas, pinhas, árvores</td></tr>
      <tr><td><b>Letras douradas</b></td><td>Passe tinta sobre o carimbo e limpe na hora com pano úmido.</td><td>Peças com nome e data</td></tr>
      <tr><td><b>Neve</b></td><td>Tinta branca grossa em pontinhos ou bicarbonato + cola branca.</td><td>Casinhas, telhados, pinheiros</td></tr>
      <tr><td><b>Brilho de doce</b></td><td>Verniz brilhante só em partes (cerejas, bagas, balas).</td><td>Doces, cogumelo, azevinho</td></tr>
      <tr><td><b>Glitter suave</b></td><td>Glitter fino misturado no verniz, em camada fina.</td><td>Flocos, estrelas, lua</td></tr>
      <tr><td><b>Perolado</b></td><td>Tinta acrílica perolada sobre a peça branca.</td><td>Anjos, bolas, sinos</td></tr>
    </table>
    <h3>Três paletas que funcionam sempre</h3>
    <div class="grid3">${[
      ['Clássica', ['#A8322D', '#2F5A3E', '#C9A24B', '#FFFFFF']],
      ['Clean e aconchegante', ['#FFFFFF', '#F3EBDD', '#C9A24B', '#D8C3A5']],
      ['Rústica', ['#7E9B7F', '#8A6248', '#D8C3A5', '#FFFFFF']],
    ].map(([n, cs]) => `<div class="box" style="margin:0"><div style="display:flex;gap:1.5mm;margin-bottom:2mm">${cs.map((c) => `<span style="width:9mm;height:9mm;border-radius:50%;background:${c};border:1px solid rgba(0,0,0,.12)"></span>`).join('')}</div><b>${n}</b></div>`).join('')}</div>`));

  pages.push(page(`
    <div class="kicker">Solução de problemas</div><h2>Deu errado? Tem conserto</h2>
    <table><tr><th style="width:30%">Problema</th><th style="width:33%">Por que acontece</th><th>Como resolver</th></tr>
      <tr><td><b>Rachaduras na secagem</b></td><td>Secou rápido demais (sol, vento) ou a peça é grossa.</td><td>Seque à sombra. Rachadura pequena: preencha com massa mole e alise com o dedo úmido.</td></tr>
      <tr><td><b>Peça empenada</b></td><td>Secou só de um lado.</td><td>Vire na metade do tempo. Se já secou torta, umedeça o verso, coloque peso e espere 24 h.</td></tr>
      <tr><td><b>Massa grudando</b></td><td>Mãos quentes ou massa mole demais.</td><td>Unte as mãos com creme. Se continuar, sove com um pouco de amido.</td></tr>
      <tr><td><b>Bordas ásperas</b></td><td>Faltou alisar antes de secar.</td><td>Depois de seca, lixe com lixa d’água fina e passe um pano úmido.</td></tr>
      <tr><td><b>Partes descolando</b></td><td>Colou peça seca com cola diluída.</td><td>Use cola branca grossa ou cola quente em peças secas.</td></tr>
      <tr><td><b>Massa branca encardida</b></td><td>Sujeira das mãos ou da mesa.</td><td>Lave as mãos entre cores e trabalhe a massa branca primeiro.</td></tr>
      <tr><td><b>Tinta manchada</b></td><td>Camada grossa ou peça úmida.</td><td>Espere a peça secar totalmente e use camadas finas.</td></tr>
      <tr><td><b>Furo quebrou</b></td><td>Furo perto da borda.</td><td>Cole um pino de bijuteria atrás ou passe a fita por trás com cola quente.</td></tr>
    </table>
    <div class="box gold"><h4>Como guardar depois do Natal</h4><p style="margin:0">Embrulhe cada peça em papel de seda e guarde numa caixa com um sachê de sílica, em lugar seco. Evite porão, garagem e embaixo da pia. Assim seus enfeites voltam lindos no próximo Natal.</p></div>`));

  pages.push(page(`
    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
      <div style="display:flex;gap:6mm;margin-bottom:8mm">${svgArt('angel', [P.white, P.ivory, P.gold], 34)}${svgArt('ballRelief', [P.ivory, P.gold], 34)}${svgArt('star', [P.white, null, P.gold], 34)}</div>
      <div class="kicker">Para terminar</div>
      <h2 style="font-size:32pt">Um Natal lindo pode sair<br>das suas mãos</h2>
      <p class="lead" style="max-width:140mm">Cada peça que você fizer vai carregar um pouco do seu carinho. Faça com calma, divirta-se e não se cobre perfeição: são as pequenas diferenças que mostram que foi feito à mão.</p>
      ${basico ? `<div class="box gold" style="max-width:150mm;margin-top:6mm"><h4>Quer ir além?</h4><p style="margin:0">O <b>Kit Completo</b> traz os 50 enfeites, o Kit de Moldes, o Guia de Secagem, o guia para vender no Natal, 15 enfeites para fazer com as crianças, a Vila Natalina Iluminada e a Lista Completa de Materiais.</p></div>`
    : `<div class="box gold" style="max-width:160mm;margin-top:6mm;text-align:left"><h4>Próximos passos com os bônus</h4><ul class="clean">
        <li><b>Bônus 1:</b> imprima os moldes das peças que vai fazer primeiro.</li>
        <li><b>Bônus 2:</b> aprenda a secar e finalizar sem rachaduras.</li>
        <li><b>Bônus 3:</b> transforme suas peças em renda extra neste Natal.</li>
        <li><b>Bônus 4:</b> chame as crianças para fazer junto.</li>
        <li><b>Bônus 5:</b> monte a Vila Natalina Iluminada, a peça que rouba a cena.</li>
        <li><b>Bônus 6:</b> leve a lista de materiais e o checklist para a loja.</li></ul></div>`}
      <p class="hand" style="font-size:24pt;color:${C.red};margin-top:8mm">Feliz Natal e boas criações!</p>
    </div>`));
  return pages;
}

function coverArts() {
  return [
    ['ballRelief', [P.ivory, P.gold], 14, 46, 46, -8],
    ['star', [P.white, null, P.gold], 58, 6, 44, 6],
    ['angel', [P.white, P.ivory, P.gold], 108, 38, 50, 0],
    ['santaHat', [P.red, P.white], 150, 0, 42, 10],
    ['tree', [P.green, P.brown, P.gold], 66, 62, 42, -4],
    ['gingerbread', [P.brown], 150, 58, 40, 8],
    ['snowflake', [P.white, null, P.gold], 4, 0, 36, 0],
  ];
}

function buildGuia({ basico = false, moldeMap = null }) {
  const list = basico ? ENFEITES.filter((e) => e.basico) : ENFEITES;
  const numOf = (e) => (basico ? list.indexOf(e) + 1 : e.n);
  const pages = [];
  pages.push(cover(basico ? {
    tag: 'Kit Básico', title: '20 Enfeites<br><em>para Começar</em>', sub: 'Natal em Cerâmica Fria 2026. Passo a passo visual, materiais baratos e moldes em tamanho real.', badge: '20 enfeites · passo a passo · moldes', arts: coverArts(),
  } : {
    tag: 'Kit Completo · Guia principal', title: '+50 Enfeites de Natal<br><em>em Cerâmica Fria</em>', sub: 'Passo a passo para fazer em casa gastando pouco. Para decorar, presentear ou vender neste Natal.', badge: '50 enfeites · passo a passo visual · dicas e variações', arts: coverArts(),
  }));
  pages.push(...introPages({ basico }));

  let moldes = null;
  if (basico) moldes = moldePages(list.map((e) => ({ ...e, n: numOf(e) })), 'Moldes do Kit Básico');

  CATEGORIAS.forEach((cat, ci) => {
    if (!list.some((e) => e.cat === cat.id)) return;
    pages.push(dividerPage(cat, list, numOf, ci % 2 === 1));
    list.filter((e) => e.cat === cat.id).forEach((e) => {
      const n = numOf(e);
      const folha = basico ? moldes.map[n] + 1 : moldeMap[e.n] + 1;
      const base = e.moldeShape ? ` (molde-base de ${e.moldeShape === 'star' ? 'estrela' : 'casinha'})` : (e.moldeObs || '');
      const ref = basico ? `Molde no final deste guia, folha ${folha}${base}` : `Molde no Bônus 1, folha ${folha}${base}`;
      pages.push(ornamentPage(e, n, ref));
    });
  });
  pages.push(...closingPages({ basico }));
  if (basico) {
    pages.push(page(`<div style="height:100%;display:flex;flex-direction:column;justify-content:center"><div class="kicker">Moldes</div><h2>Moldes em tamanho real</h2><p class="lead">Imprima só as folhas que for usar, sempre em <b>tamanho real (100%)</b>, sem “ajustar à página”. Recorte o molde, apoie sobre a massa aberta e contorne com o estilete.</p>${calib}<p style="margin-top:5mm">Dica: cole os moldes que mais usa sobre um papel-cartão ou uma folha de radiografia. Eles ficam firmes e duram a temporada inteira.</p></div>`));
    pages.push(...moldes.pages);
  }
  return pages;
}

// Bônus 1: moldes de todos os 50
function buildMoldes() {
  const m = moldePages(ENFEITES, 'Bônus 01 · Kit de Moldes Natalinos');
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 01', title: 'Kit de Moldes<br><em>Natalinos para Imprimir</em>', sub: 'Todos os moldes dos 50 enfeites em tamanho real, prontos para imprimir e recortar.', badge: `${ENFEITES.length} moldes · ${m.count} folhas A4`, green: true,
    arts: [['star', [P.white, null, P.gold], 12, 6, 50, -6], ['heart', [P.white, null, P.gold], 76, 40, 50, 4], ['bell', [P.white, P.gold, P.gold], 140, 0, 50, 8], ['house', [P.white, P.brown], 146, 62, 44, -4], ['tree', [P.green, P.brown, P.gold], 14, 64, 46, 0]],
  }));
  pages.push(page(`<div class="kicker">Como usar</div><h2>Imprimir, recortar e modelar</h2>
    <p class="lead">Cada molde está no tamanho real da peça pronta. Imprima só as folhas que for usar.</p>
    <div class="grid2" style="margin-top:4mm">
      ${[
        ['Imprima em 100%', 'Na janela de impressão, escolha “Tamanho real” ou “Escala 100%”. Não use “Ajustar à página”.'],
        ['Confira a régua', 'Meça o quadrado de 1 cm no topo da folha. Se não medir 1 cm, ajuste a escala e imprima de novo.'],
        ['Recorte com folga', 'Recorte exatamente sobre a linha. Detalhes pequenos (olhos, bolinhas, laços) são modelados à mão.'],
        ['Deixe o molde firme', 'Cole os moldes sobre papel-cartão ou plástico de radiografia: duram a temporada inteira.'],
        ['Apoie e contorne', 'Unte o verso do molde com um pouco de creme, apoie sobre a massa e contorne com o estilete em pé.'],
        ['Mude o tamanho', 'Quer uma peça maior? Imprima em 120% ou 150%. Lembre de aumentar também a espessura e o tempo de secagem.'],
      ].map(([t, d], i) => `<div class="box" style="margin:0;display:flex;gap:3mm"><span class="num-step">${i + 1}</span><div><b>${t}</b><br><span style="font-size:9.5pt">${d}</span></div></div>`).join('')}
    </div>
    <h3>Índice dos moldes</h3>
    <div style="columns:3;column-gap:6mm;font-size:8.5pt">${ENFEITES.map((e) => `<div style="display:flex;border-bottom:1px dotted ${C.line}"><b style="color:${C.gold};width:6mm">${String(e.n).padStart(2, '0')}</b><span style="flex:1">${e.nome}</span><span style="color:${C.muted}">f. ${m.map[e.n] + 1}</span></div>`).join('')}</div>`));
  pages.push(...m.pages);
  return { pages, map: m.map };
}

module.exports = { buildGuia, buildMoldes, icon, iconFor, moldePages };
