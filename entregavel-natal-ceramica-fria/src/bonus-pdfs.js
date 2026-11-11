// PDFs dos bônus 2, 3, 4, 5 e 6
const { C, svgArt, page, cover, pack, calib } = require('./layout');
const { P } = require('./shapes');
const { CRIANCAS, VILA, IGREJA, MATERIAIS } = require('./bonus');
const { icon } = require('./guia');

const steps = (list) => list.map((t, i) => `<div style="display:flex;gap:3mm;margin-bottom:2.6mm"><span class="num-step">${i + 1}</span><div>${t}</div></div>`).join('');
const intro = (kicker, title, lead) => `<div class="kicker">${kicker}</div><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}`;

// ═════════ BÔNUS 2 · SECAGEM E ACABAMENTO ═════════
function buildSecagem() {
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 02', title: 'Guia de Secagem<br><em>e Acabamento</em>', sub: 'Sem rachaduras: como secar, lixar, pintar, envernizar e dourar as peças para durarem anos.', badge: 'Secagem · lixa · pintura · verniz · dourado',
    arts: [['star', [P.white, null, P.gold], 10, 36, 58, -8], ['ballRelief', [P.ivory, P.gold], 74, 40, 62, 0], ['heart', [P.white, null, P.gold], 142, 24, 58, 8]],
  }));

  pages.push(page(`${intro('Parte 1', 'Como a cerâmica fria seca', 'A massa seca porque a água evapora. Ela seca <b>de fora para dentro</b>: a casca endurece primeiro e o miolo depois. Quase todo problema de secagem vem dessa diferença.')}
    <div class="grid3" style="margin:4mm 0">
      <div class="box"><h4>Encolhe</h4><p style="margin:0">A peça perde cerca de 10% do tamanho. Peças coladas de espessuras muito diferentes podem se separar.</p></div>
      <div class="box"><h4>Clareia ou escurece</h4><p style="margin:0">Massa branca fica levemente translúcida. Massa colorida fica um tom mais escura.</p></div>
      <div class="box"><h4>Endurece por etapas</h4><p style="margin:0">Em 12 h dá para manusear. Pintura e verniz só depois da secagem completa.</p></div>
    </div>
    <h3>Tempo de secagem por espessura</h3>
    <table><tr><th>Espessura / tipo de peça</th><th>Clima seco e quente</th><th>Clima ameno</th><th>Clima úmido ou frio</th></tr>
      <tr><td>Até 4 mm (flocos, folhas, estrelas finas)</td><td>12 a 24 h</td><td>24 h</td><td>36 a 48 h</td></tr>
      <tr><td>5 a 6 mm (maioria dos enfeites)</td><td>24 h</td><td>48 h</td><td>72 h</td></tr>
      <tr><td>7 a 10 mm (medalhões, porta-velas)</td><td>48 h</td><td>72 h</td><td>4 a 5 dias</td></tr>
      <tr><td>Peças 3D e montadas (casinhas, presépio)</td><td>3 dias</td><td>5 dias</td><td>7 dias</td></tr></table>
    <div class="box gold"><h4>Como saber se secou por dentro</h4><ul class="clean">
      <li><b>Cor:</b> a peça seca fica com a cor uniforme. Manchas mais escuras indicam umidade no miolo.</li>
      <li><b>Temperatura:</b> encoste a peça no rosto. Se estiver fria, ainda há água evaporando.</li>
      <li><b>Som:</b> bata de leve com a unha. Seca, ela faz um “tec” firme.</li></ul></div>`));

  pages.push(page(`${intro('Parte 2', 'O cantinho de secagem ideal')}
    <div class="grid2">
      <div class="box green"><h4>Faça assim</h4><ul class="clean">
        <li>Lugar arejado, à sombra, longe de janelas com sol direto.</li>
        <li>Peças sobre papel-manteiga, numa bandeja ou grade.</li>
        <li>Vire as peças planas na metade do tempo.</li>
        <li>Peças com volume (sinos, bolas) sobre um apoio de papel-alumínio amassado.</li>
        <li>Peças que penduram: pendure num varalzinho depois de 12 h para secarem por igual.</li>
        <li>Anote a data de cada leva num papel ao lado da bandeja.</li></ul></div>
      <div class="box" style="border-color:${C.red}"><h4 style="color:${C.red}">Evite</h4><ul class="clean">
        <li><b>Sol direto:</b> seca a casca rápido demais e racha.</li>
        <li><b>Ventilador ou ar-condicionado</b> soprando nas peças.</li>
        <li><b>Forno, micro-ondas ou secador</b> para acelerar: deforma e racha.</li>
        <li>Banheiro, lavanderia ou cozinha com vapor.</li>
        <li>Pote fechado: a umidade não sai e a peça pode mofar.</li></ul></div>
    </div>
    <h3>Precisa acelerar? Com segurança, dá</h3>
    ${steps([
      'Faça as peças um pouco mais finas (4 a 5 mm) e com miolo de papel-alumínio nas peças 3D.',
      'Depois de 12 h, coloque as peças perto (não em frente) de um ventilador no mínimo, virando a cada 2 h.',
      'Em dias úmidos, deixe as peças num cômodo com desumidificador ou com potes de sal grosso por perto.',
      'Nunca pule a primeira noite: as primeiras 12 h são de secagem lenta, sempre.',
    ])}
    <div class="box red" style="margin-top:4mm"><h3 style="margin-top:0">A regra de ouro</h3><p style="margin:0">Secagem lenta nas primeiras 12 horas, ventilada depois. Quase todas as rachaduras acontecem porque a peça secou rápido demais no começo.</p></div>`));

  pages.push(page(`${intro('Parte 3', 'Rachaduras: prevenir e consertar')}
    <table><tr><th style="width:28%">Tipo de rachadura</th><th style="width:34%">Causa</th><th>Prevenção e conserto</th></tr>
      <tr><td><b>Fios finos na superfície</b></td><td>Massa um pouco seca na hora de modelar.</td><td>Sove com creme antes de usar. Conserto: passe o dedo úmido de creme e alise.</td></tr>
      <tr><td><b>Rachadura funda no meio</b></td><td>Peça grossa demais secando rápido.</td><td>Use miolo de papel-alumínio. Conserto: preencha com massa mole (massa + cola), alise e seque de novo.</td></tr>
      <tr><td><b>Emenda abrindo</b></td><td>Partes coladas com espessuras diferentes ou sem cola.</td><td>Cole sempre com cola diluída e pressione. Conserto: preencha a emenda com massa mole.</td></tr>
      <tr><td><b>Borda lascada</b></td><td>Borda fina demais ou batida depois de seca.</td><td>Alise e arredonde as bordas. Conserto: cole massa nova e lixe depois de seca.</td></tr>
      <tr><td><b>Furo rachado</b></td><td>Furo muito perto da borda.</td><td>Deixe 8 mm de distância. Conserto: cole um pino de bijuteria por trás.</td></tr></table>
    <div class="grid2">
      <div class="box gold"><h4>Receita da massa de conserto</h4><p style="margin:0">Misture um pedacinho de massa com cola branca até virar uma pasta macia, como pasta de dente. Aplique com espátula ou palito, alise com o dedo úmido e seque de novo. Depois de seca, lixe e pinte.</p></div>
      <div class="box"><h4>Peça quebrou depois de seca?</h4><p style="margin:0">Cole com cola instantânea em gel ou cola quente. Preencha a linha da emenda com massa de conserto, lixe depois de seca e retoque a pintura. Ninguém vai perceber.</p></div>
    </div>`));

  pages.push(page(`${intro('Parte 4', 'Lixar e preparar para a pintura')}
    <div class="grid2" style="grid-template-columns:1.2fr .8fr">
      <div>${steps([
        'Espere a peça secar por completo (veja a tabela da Parte 1).',
        'Use lixa d’água fina (nº 400 a 600), seca, em movimentos circulares leves.',
        'Lixe bordas, emendas e pontas. Não lixe as texturas para não apagar o relevo.',
        'Retire o pó com um pincel macio ou um pano levemente úmido.',
        'Se for pintar a peça inteira, passe uma camada fina de tinta branca como base.',
      ])}</div>
      <div class="box gold"><h4>Precisa lixar sempre?</h4><p style="margin:0">Não. Se você alisou bem as bordas com creme antes de secar, a peça já sai lisa. A lixa é para corrigir detalhes e para peças que vão para a venda.</p></div>
    </div>
    <h3>Pintura</h3>
    <table><tr><th>Tinta</th><th>Quando usar</th><th>Observação</th></tr>
      <tr><td><b>Acrílica</b></td><td>Pintura geral e detalhes</td><td>Cobre bem, seca rápido, não precisa diluir.</td></tr>
      <tr><td><b>PVA</b></td><td>Fundo e áreas grandes</td><td>Mais barata, um pouco menos resistente.</td></tr>
      <tr><td><b>Caneta posca</b></td><td>Letras, olhos, glacê</td><td>Traço firme, ótima para iniciantes.</td></tr>
      <tr><td><b>Caneta permanente</b></td><td>Olhos e contornos finos</td><td>Teste antes: algumas borram com verniz.</td></tr>
      <tr><td><b>Blush ou giz pastel</b></td><td>Bochechas</td><td>Aplique com cotonete antes do verniz.</td></tr></table>
    <div class="box"><h4>Técnicas de pintura que valorizam a peça</h4><ul class="clean">
      <li><b>Pincel seco:</b> quase sem tinta, passado de leve, destaca só o relevo.</li>
      <li><b>Pátina:</b> tinta marrom diluída em toda a peça, retirada logo em seguida com pano. Fica nas reentrâncias e dá ar envelhecido.</li>
      <li><b>Pontilhado:</b> com a ponta do cabo do pincel, para neve, bolinhas e bordas.</li></ul></div>`));

  pages.push(page(`${intro('Parte 5', 'Verniz e dourado')}
    <div class="grid3" style="margin-bottom:4mm">
      <div class="box"><h4>Verniz fosco</h4><p style="margin:0">Mantém o aspecto natural da cerâmica. Ideal para peças brancas e rústicas.</p></div>
      <div class="box"><h4>Acetinado</h4><p style="margin:0">Brilho suave, de porcelana. O mais versátil.</p></div>
      <div class="box"><h4>Brilhante</h4><p style="margin:0">Para doces, bagas, cerejas e detalhes que precisam “brilhar”.</p></div>
    </div>
    <h3>Como envernizar sem manchar</h3>
    ${steps([
      'Use verniz acrílico à base de água, próprio para artesanato.',
      'Aplique uma camada fina com pincel macio, sempre no mesmo sentido.',
      'Espere secar 2 h e aplique a segunda camada.',
      'Pendure a peça pelo furo para secar: assim nenhum lado fica marcado.',
      'Para peças que vão ser muito manuseadas (chaveiros, ímãs), faça uma terceira camada.',
    ])}
    <h3>Quatro jeitos de dourar</h3>
    <div class="grid2">
      ${[
        ['Tinta dourada', 'O mais simples. Duas camadas, com pincel ou com o dedo nas bordas.'],
        ['Caneta dourada', 'Para letras, linhas e pontilhados. Precisão sem esforço.'],
        ['Folha de ouro (imitação)', 'Passe cola própria (ou cola branca), espere ficar pegajosa, aplique a folha e retire o excesso com pincel macio.'],
        ['Pó ou sombra dourada', 'Passe com o dedo sobre o relevo e fixe com verniz em spray ou com uma camada leve de verniz.'],
      ].map(([t, d]) => `<div class="box gold" style="margin:0"><b>${t}</b><br><span style="font-size:9.5pt">${d}</span></div>`).join('')}
    </div>`));

  pages.push(page(`${intro('Parte 6', 'Para durar muitos Natais')}
    <div class="grid2">
      <div class="box green"><h4>Durante o uso</h4><ul class="clean">
        <li>Não pendure enfeites perto de lâmpadas quentes ou velas.</li>
        <li>Use pisca-pisca de LED, que não esquenta.</li>
        <li>Limpe com pincel macio ou pano seco. Nunca molhe.</li></ul></div>
      <div class="box green"><h4>Depois do Natal</h4><ul class="clean">
        <li>Embrulhe cada peça em papel de seda.</li>
        <li>Guarde em caixa com divisórias e um sachê de sílica.</li>
        <li>Guarde em lugar seco, longe de porão e garagem.</li></ul></div>
    </div>
    <h3>Checklist de acabamento (para cada leva)</h3>
    <table><tr><th style="width:8%"></th><th>Etapa</th><th style="width:30%">Quando</th></tr>
      ${[['Bordas alisadas com creme', 'Antes de secar'], ['Furo a 8 mm da borda', 'Antes de secar'], ['Secagem lenta nas primeiras 12 h', 'Dia 1'], ['Peça virada na metade do tempo', 'Dia 1 ou 2'], ['Secagem completa conferida (cor, temperatura, som)', 'Dia 2 a 5'], ['Bordas e emendas lixadas', 'Peça seca'], ['Pintura em camadas finas', 'Peça seca'], ['Duas camadas de verniz', 'Tinta seca'], ['Fita ou fio colocado', 'Verniz seco'], ['Peça embalada ou pendurada', 'Pronta!']].map(([t, q]) => `<tr><td><span style="display:inline-block;width:5mm;height:5mm;border:1.5px solid ${C.green};border-radius:1mm"></span></td><td>${t}</td><td>${q}</td></tr>`).join('')}</table>`));
  return pages;
}

// ═════════ BÔNUS 3 · VENDER NO NATAL ═════════
function buildVender() {
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 03', title: 'Cerâmica Fria<br><em>para Vender no Natal</em>', sub: 'Tabela de preço por peça, ideias de kits, embalagem e como vender pelo WhatsApp e Instagram.', badge: 'Preço · kits · embalagem · WhatsApp · Instagram', green: true,
    arts: [['gift', [P.white, P.red, P.red], 10, 46, 58, -8], ['stocking', [P.red, P.white], 74, 6, 62, 4], ['roundTag', [P.white, null, P.gold], 142, 54, 58, 6]],
  }));

  pages.push(page(`${intro('Parte 1', 'Por que cerâmica fria vende tanto no Natal', 'No fim do ano, as pessoas procuram presentes com significado, lembrancinhas para a família e para o trabalho e decoração diferente da que todo mundo compra pronta. Peças feitas à mão atendem exatamente isso.')}
    <div class="grid3" style="margin:4mm 0">
      <div class="box"><h4>Custo baixo</h4><p style="margin:0">Uma peça pequena gasta de R$ 1 a R$ 3 em material.</p></div>
      <div class="box"><h4>Feita em casa</h4><p style="margin:0">Sem forno e sem equipamento caro. Você produz na mesa da cozinha.</p></div>
      <div class="box"><h4>Personalizável</h4><p style="margin:0">Nome e data transformam um enfeite em presente único, que vale mais.</p></div>
    </div>
    <h3>Para quem vender</h3>
    <div class="grid2">
      <div class="box"><ul class="clean"><li><b>Família e amigos:</b> o primeiro círculo, ótimo para testar.</li><li><b>Colegas de trabalho:</b> amigo-secreto e lembrancinhas de fim de ano.</li><li><b>Mães da escola:</b> presentes para professoras.</li></ul></div>
      <div class="box"><ul class="clean"><li><b>Empresas:</b> brindes para clientes e funcionários.</li><li><b>Lojas e cafés do bairro:</b> peças em consignação no balcão.</li><li><b>Feirinhas de Natal:</b> vitrine e venda na hora.</li></ul></div>
    </div>
    <div class="box gold"><h4>Comece pequeno</h4><p style="margin:0">Escolha de 5 a 8 modelos que você faz bem e rápido. Fotografe, divulgue e aceite encomendas só desses modelos. Variedade demais atrasa a produção e confunde o cliente.</p></div>`));

  pages.push(page(`${intro('Parte 2', 'Quanto cobrar: a conta certa', 'O erro mais comum é cobrar só o material. O seu tempo também precisa entrar no preço. Use esta fórmula simples:')}
    <div class="box red" style="text-align:center;font-size:13pt;padding:6mm"><b>Preço = (Material + Mão de obra) × 1,5</b><div style="font-size:10pt;margin-top:2mm;color:#F7E9E4">O “× 1,5” cobre embalagem, perdas, taxas e o seu lucro.</div></div>
    <h3>Passo 1: custo do material</h3>
    <table><tr><th>Item</th><th>Preço médio</th><th>Rende</th><th>Custo por enfeite</th></tr>
      <tr><td>Massa caseira (1 receita)</td><td>R$ 7 a R$ 9</td><td>~400 g (16 enfeites de 25 g)</td><td>~R$ 0,50</td></tr>
      <tr><td>Massa pronta (500 g)</td><td>R$ 20 a R$ 35</td><td>~20 enfeites</td><td>R$ 1,00 a R$ 1,75</td></tr>
      <tr><td>Tinta, verniz e dourado</td><td>—</td><td>—</td><td>~R$ 0,50</td></tr>
      <tr><td>Fita ou barbante</td><td>—</td><td>—</td><td>~R$ 0,30</td></tr></table>
    <h3>Passo 2: sua mão de obra</h3>
    <p>Defina quanto vale a sua hora (exemplo: R$ 20). Divida pelo número de peças que você faz por hora. Se você faz 3 estrelas por hora: R$ 20 ÷ 3 = <b>R$ 6,67 por estrela</b>.</p>
    <h3>Exemplo completo: Estrela com renda</h3>
    <div class="grid2">
      <table style="margin:0"><tr><td>Material</td><td style="text-align:right">R$ 1,30</td></tr><tr><td>Mão de obra (20 min)</td><td style="text-align:right">R$ 6,67</td></tr><tr><td>Subtotal</td><td style="text-align:right">R$ 7,97</td></tr><tr><td><b>× 1,5</b></td><td style="text-align:right"><b>R$ 11,96</b></td></tr></table>
      <div class="box gold" style="margin:0"><h4>Arredonde</h4><p style="margin:0">Preços “redondos” vendem melhor: cobre <b>R$ 12,00</b> a unidade ou <b>3 por R$ 33,00</b> para incentivar a compra de mais peças.</p></div>
    </div>`));

  const tabela = [
    ['Enfeite simples liso (lua, coração, estrela)', 'R$ 8 a R$ 12'],
    ['Enfeite texturizado ou com dourado', 'R$ 12 a R$ 18'],
    ['Personagem (Papai Noel, rena, boneco de neve)', 'R$ 15 a R$ 25'],
    ['Enfeite personalizado com nome', 'R$ 18 a R$ 28'],
    ['Medalhão da mãozinha / 1º Natal', 'R$ 30 a R$ 50'],
    ['Guirlanda de estrelas (varal com 9 a 12)', 'R$ 45 a R$ 80'],
    ['Porta-vela estrela', 'R$ 25 a R$ 40'],
    ['Casinha da vila (3D, com LED)', 'R$ 35 a R$ 60'],
    ['Presépio minimalista', 'R$ 60 a R$ 120'],
    ['Vila natalina completa', 'R$ 250 a R$ 450'],
    ['Centro de mesa montado', 'R$ 90 a R$ 180'],
  ];
  pages.push(page(`${intro('Parte 3', 'Tabela de preços de referência', 'Valores praticados no varejo de artesanato. Use como ponto de partida e ajuste para a sua região, o seu acabamento e o seu público.')}
    <table><tr><th>Peça</th><th style="width:30%">Preço sugerido</th></tr>${tabela.map(([a, b]) => `<tr><td>${a}</td><td><b>${b}</b></td></tr>`).join('')}</table>
    <div class="grid2">
      <div class="box green"><h4>Cobre mais quando</h4><ul class="clean"><li>A peça é personalizada.</li><li>Vai em embalagem de presente.</li><li>O prazo é curto (encomenda urgente: +20%).</li><li>O cliente é empresa (brinde corporativo).</li></ul></div>
      <div class="box"><h4>Ofereça desconto quando</h4><ul class="clean"><li>O cliente leva kit ou quantidade.</li><li>A encomenda é feita com antecedência.</li><li>São peças de pronta-entrega no fim da temporada.</li></ul></div>
    </div>`));

  const kits = [
    ['Kit Árvore Clean', '6 peças brancas e douradas: estrela com renda, floco, lua, coração, sino e anjinho.', 'R$ 60 a R$ 90'],
    ['Kit Família', 'Uma meia com nome para cada pessoa da casa (4 a 6 peças).', 'R$ 70 a R$ 130'],
    ['Kit Professora', 'Plaquinha “Feliz Natal” com o nome + bengala doce, em saquinho de celofane.', 'R$ 20 a R$ 30'],
    ['Kit Primeiro Natal', 'Medalhão da mãozinha + estrela com nome do bebê, em caixa kraft.', 'R$ 50 a R$ 80'],
    ['Kit Mesa Posta', '6 marcadores de lugar com nome + porta-vela estrela.', 'R$ 90 a R$ 140'],
    ['Kit Personagens', 'Papai Noel, rena, boneco de neve e pinguim.', 'R$ 60 a R$ 90'],
    ['Kit Rústico', 'Pinha, azevinho, pinheirinho gota e estrela de anis com canela em pau.', 'R$ 55 a R$ 80'],
    ['Lembrancinha corporativa', 'Plaquinha ou medalhão com o logo ou nome da empresa (a partir de 20 unidades).', 'R$ 10 a R$ 18 cada'],
  ];
  pages.push(page(`${intro('Parte 4', 'Kits que vendem mais', 'Kits aumentam o valor de cada venda e facilitam a escolha do cliente. Monte de 3 a 5 kits fixos e fotografe cada um.')}
    <div class="grid2" style="gap:3.5mm">${kits.map(([t, d, p]) => `<div class="box" style="margin:0"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:3mm"><b style="color:${C.red};font-size:11pt">${t}</b><span style="font-weight:800;color:${C.green};white-space:nowrap;font-size:9.5pt">${p}</span></div><div style="font-size:9.5pt;margin-top:1mm">${d}</div></div>`).join('')}</div>
    <div class="box gold" style="margin-top:4mm"><h4>Truque do kit</h4><p style="margin:0">Mostre o kit primeiro e as peças avulsas depois. O cliente compara e percebe que o kit compensa.</p></div>`));

  pages.push(page(`${intro('Parte 5', 'Embalagem que valoriza')}
    <p class="lead">Uma embalagem simples e caprichada faz a peça parecer de loja e justifica um preço melhor.</p>
    <div class="grid2">
      <div class="box"><h4>Materiais baratos</h4><ul class="clean"><li>Caixinhas kraft com visor ou tampa</li><li>Papel de seda branco ou vermelho</li><li>Saquinhos de celofane</li><li>Barbante cru, fita de juta ou de cetim</li><li>Raminho de pinheiro artificial ou canela em pau</li><li>Tag de papel com seu nome e o @ do Instagram</li></ul></div>
      <div class="box"><h4>Passo a passo da caixinha</h4>${steps(['Forre a caixa com papel de seda amassado.', 'Acomode a peça no centro, com o furo para cima.', 'Coloque um raminho ou canela ao lado.', 'Feche, amarre com barbante e um laço.', 'Pendure a tag com o nome do cliente.'])}</div>
    </div>
    <div class="grid2">
      <div class="box gold"><h4>Cartãozinho que fideliza</h4><p style="margin:0;font-family:Caveat;font-size:15pt;line-height:1.2;color:${C.red}">“Este enfeite foi feito à mão, com carinho, para fazer parte do seu Natal. Guarde em papel de seda e ele vai brilhar por muitos anos.”</p></div>
      <div class="box green"><h4>Para enviar pelo correio</h4><ul class="clean"><li>Plástico-bolha em volta da caixinha.</li><li>Caixa de papelão com papel amassado nos espaços vazios.</li><li>Etiqueta “Frágil”.</li></ul></div>
    </div>`));

  pages.push(page(`${intro('Parte 6', 'Fotos que vendem pelo celular')}
    <div class="grid2">
      <div>${steps([
        '<b>Luz natural:</b> fotografe perto de uma janela, de dia, sem sol batendo direto.',
        '<b>Fundo simples:</b> madeira, linho, papel kraft ou um tecido branco.',
        '<b>Cenário de Natal desfocado:</b> pisca-pisca e galhos de pinheiro ao fundo.',
        '<b>Três fotos por peça:</b> de perto (detalhe), na mão (tamanho) e na árvore (uso).',
        '<b>Mesma luz e mesmo fundo</b> em todas as fotos: o seu perfil fica com cara de loja.',
        '<b>Vídeo curto:</b> 10 segundos mostrando a peça girando ou sendo pendurada.',
      ])}</div>
      <div class="box gold"><h4>Ideias de conteúdo para o Instagram</h4><ul class="clean">
        <li>Antes e depois: massa crua × peça pronta.</li>
        <li>Vídeo acelerado fazendo uma estrela com renda.</li>
        <li>“Qual nome você colocaria?” com um enfeite personalizado.</li>
        <li>Bastidores: a bandeja de secagem cheia.</li>
        <li>Cliente pendurando a peça na árvore (peça autorização).</li>
        <li>Contagem regressiva: “últimos dias para encomendas”.</li></ul></div>
    </div>
    <h3>Legendas prontas</h3>
    <div class="grid2">
      <div class="box"><p style="margin:0">🎄 Feito à mão, peça por peça. Enfeites em cerâmica fria com o nome de quem você ama. Encomendas abertas até 10/12. Chama no direct ou no WhatsApp do perfil!</p></div>
      <div class="box"><p style="margin:0">✨ Uma árvore com a cara da sua família. Kit com 6 enfeites brancos e dourados, prontos para pendurar. Poucas unidades, pronta-entrega. Comente “EU QUERO”.</p></div>
    </div>`));

  pages.push(page(`${intro('Parte 7', 'Vendendo pelo WhatsApp')}
    <div class="grid2">
      <div class="box"><h4>Prepare o seu WhatsApp</h4><ul class="clean"><li>Use o WhatsApp Business (gratuito).</li><li>Monte o catálogo com foto, nome e preço de cada peça.</li><li>Configure uma mensagem de saudação automática.</li><li>Crie etiquetas: “orçamento”, “pago”, “em produção”, “entregue”.</li></ul></div>
      <div class="box"><h4>Status todos os dias</h4><ul class="clean"><li>Manhã: peça pronta com preço.</li><li>Tarde: bastidor (fazendo, secando, pintando).</li><li>Noite: depoimento ou foto de cliente.</li></ul></div>
    </div>
    <h3>Mensagens prontas para copiar</h3>
    ${[
      ['Divulgação para a lista de contatos', 'Oi, [nome]! Tudo bem? 🎄 Este ano estou fazendo enfeites de Natal em cerâmica fria, feitos à mão e com o nome da pessoa. Ficam lindos na árvore e são um presente cheio de carinho. Posso te mandar as fotos e os preços?'],
      ['Resposta de orçamento', 'Que bom que gostou! 😊 O [modelo] personalizado com nome sai por R$ [valor]. Para kits a partir de 3 peças, faço R$ [valor]. O prazo é de [X] dias, porque cada peça precisa secar com calma. Qual nome você gostaria?'],
      ['Fechamento do pedido', 'Perfeito! Seu pedido: [peças e nomes]. Total: R$ [valor]. Para iniciar a produção, peço 50% de sinal no Pix [chave]. O restante é na entrega. Te aviso por aqui quando estiver pronto! 🎁'],
      ['Pós-venda', 'Oi, [nome]! Seu enfeite chegou bem? Se puder, me manda uma foto dele na árvore. Fico muito feliz em ver! E se quiser indicar para alguém, tenho um mimo para você no próximo pedido. ✨'],
    ].map(([t, m]) => `<div class="box" style="margin-bottom:3mm;padding:3.5mm 5mm"><h4 style="margin-bottom:1mm">${t}</h4><p style="margin:0;font-size:9.8pt">${m}</p></div>`).join('')}`));

  pages.push(page(`${intro('Parte 8', 'Calendário de vendas de Natal')}
    <table><tr><th style="width:24%">Quando</th><th>O que fazer</th></tr>
      <tr><td><b>1ª quinzena de novembro</b></td><td>Defina os modelos, faça as peças de mostruário e fotografe tudo. Monte o catálogo.</td></tr>
      <tr><td><b>2ª quinzena de novembro</b></td><td>Divulgue para a sua lista, poste todos os dias e abra as encomendas. Produza estoque das peças mais pedidas.</td></tr>
      <tr><td><b>1º a 10 de dezembro</b></td><td>Pico das encomendas personalizadas. Feche a agenda de personalizados no dia 10 (as peças precisam de tempo para secar).</td></tr>
      <tr><td><b>11 a 20 de dezembro</b></td><td>Finalize, embale e entregue. Venda as peças de pronta-entrega.</td></tr>
      <tr><td><b>21 a 24 de dezembro</b></td><td>Última chamada: só pronta-entrega. Peça fotos e depoimentos aos clientes.</td></tr>
      <tr><td><b>Janeiro</b></td><td>Anote o que mais vendeu. Ofereça ímãs, chaveiros e lembrancinhas para o resto do ano.</td></tr></table>
    <h3>Ficha de encomenda</h3>
    <table><tr><th style="width:15%">Data</th><th style="width:22%">Cliente</th><th>Peça e personalização</th><th style="width:11%">Valor</th><th style="width:10%">Sinal</th><th style="width:13%">Entrega</th></tr>
      ${Array.from({ length: 8 }).map(() => '<tr><td style="height:9mm"></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}</table>
    <div class="box gold"><h4>Regras de ouro das encomendas</h4><ul class="clean"><li>Sempre peça 50% de sinal antes de começar.</li><li>Confirme a grafia do nome por escrito.</li><li>Dê o prazo contando a secagem, com 2 dias de folga.</li></ul></div>`));
  return pages;
}

// ═════════ BÔNUS 4 · CRIANÇAS ═════════
function buildCriancas() {
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 04', title: '15 Enfeites<br><em>para Fazer com as Crianças</em>', sub: 'Peças simples e seguras para fazer em família nas férias de fim de ano.', badge: '15 enfeites · a partir de 2 anos com ajuda',
    arts: [['snowman', [P.white, P.red], 10, 36, 58, -6], ['gingerbread', [P.brown], 74, 36, 62, 4], ['penguin', [P.black], 142, 24, 58, 6]],
  }));
  pages.push(page(`${intro('Antes de começar', 'Artesanato em família, com segurança', 'Modelar massa é uma das atividades preferidas das crianças: desenvolve a coordenação, a criatividade e a paciência. E no fim fica uma lembrança para pendurar todo Natal.')}
    <div class="grid2">
      <div class="box" style="border-color:${C.red}"><h4 style="color:${C.red}">Segurança em primeiro lugar</h4><ul class="clean">
        <li>O <b>adulto prepara a massa</b> (fogão e micro-ondas são tarefas de adulto).</li>
        <li>A massa <b>não é comestível</b>. Fique de olho nos pequenos.</li>
        <li>Para crianças menores de 3 anos, só com supervisão o tempo todo e peças grandes.</li>
        <li>Estilete e arame: <b>só o adulto</b> usa.</li>
        <li>Use tintas e glitter <b>atóxicos</b>.</li>
        <li>Lave as mãos antes e depois.</li></ul></div>
      <div class="box green"><h4>Para dar tudo certo</h4><ul class="clean">
        <li>Sessões curtas: de 20 a 30 minutos.</li>
        <li>Separe a massa já colorida em bolinhas, uma de cada cor.</li>
        <li>Prefira cortadores de biscoito em vez de moldes e estilete.</li>
        <li>Forre a mesa e use avental ou camiseta velha.</li>
        <li>Elogie o processo, não a perfeição.</li>
        <li>Escreva o nome e a idade atrás de cada peça.</li></ul></div>
    </div>
    <h3>Kit da criança</h3>
    <div class="grid3">${[['modelar', 'Massa já colorida'], ['corte', 'Cortadores de biscoito'], ['textura', 'Palito sem ponta, garfo, tampinhas'], ['rolo', 'Rolinho pequeno'], ['pincel', 'Canetinhas e tinta atóxica'], ['secar', 'Bandeja com papel-manteiga']].map(([i, t]) => `<div class="box" style="margin:0;display:flex;gap:3mm;align-items:center">${icon(i)}<b style="font-size:10pt">${t}</b></div>`).join('')}</div>`));

  for (let i = 0; i < CRIANCAS.length; i += 3) {
    const trio = CRIANCAS.slice(i, i + 3);
    pages.push(page(`<div class="kicker">Enfeites ${i + 1} a ${i + trio.length}</div>
      ${trio.map((k, j) => `<div class="box" style="display:grid;grid-template-columns:44mm 1fr;gap:6mm;align-items:center;margin-bottom:4.5mm;min-height:76mm">
        <div class="ornament-ring" style="width:44mm;height:44mm;display:flex;align-items:center;justify-content:center;${k.colors[0] === P.white || k.colors[0] === P.pink ? `background:${C.green}` : ''}">${svgArt(k.shape, k.colors, 32)}</div>
        <div><div style="display:flex;align-items:center;gap:3mm;margin-bottom:1.5mm"><span class="num-step">${i + j + 1}</span><h3 style="margin:0;color:${C.red};font-size:17pt">${k.nome}</h3></div>
          <div style="font-size:9pt;color:${C.muted};margin-bottom:2mm">Idade: <b style="color:${C.ink}">${k.idade}</b> · Tempo: <b style="color:${C.ink}">${k.tempo}</b> · Secagem: <b style="color:${C.ink}">24 a 48 h</b></div>
          ${k.passos.map((t, n) => `<div style="display:flex;gap:2mm;font-size:10pt;margin-bottom:1mm"><b style="color:${C.gold}">${n + 1}.</b><span>${t}</span></div>`).join('')}
          <div style="margin-top:2mm;font-size:9pt;background:#FBF1DA;border-radius:2mm;padding:1.5mm 3mm"><b>Parte do adulto:</b> ${k.adulto}</div></div></div>`).join('')}`));
  }

  pages.push(page(`<div style="border:2mm solid ${C.gold};border-radius:4mm;height:100%;padding:16mm;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff">
    <div style="display:flex;gap:6mm">${svgArt('star', [P.white, null, P.gold], 26)}${svgArt('snowman', [P.white, P.red], 26)}${svgArt('star', [P.white, null, P.gold], 26)}</div>
    <div class="kicker" style="margin-top:6mm">Certificado</div>
    <h1 style="font-size:34pt">Pequeno Artesão<br>de Natal</h1>
    <p class="lead" style="margin-top:6mm">Certificamos que</p>
    <div style="border-bottom:1px solid ${C.ink};width:130mm;height:14mm"></div>
    <p class="lead" style="margin-top:6mm;max-width:140mm">fez com as próprias mãos enfeites de Natal em cerâmica fria e deixou a nossa casa ainda mais especial neste Natal de 2026.</p>
    <div style="display:flex;gap:30mm;margin-top:16mm"><div><div style="border-bottom:1px solid ${C.ink};width:55mm;height:10mm"></div><div style="font-size:9pt;margin-top:1mm">Data</div></div><div><div style="border-bottom:1px solid ${C.ink};width:55mm;height:10mm"></div><div style="font-size:9pt;margin-top:1mm">Assinatura da família</div></div></div>
    <p class="hand" style="font-size:22pt;color:${C.red};margin-top:12mm">Imprima e entregue com um abraço!</p></div>`, '', true));
  return pages;
}

// ═════════ BÔNUS 5 · VILA NATALINA ═════════
function houseArt(h, scale = 3.2) {
  // fachada frontal desenhada a partir das medidas reais
  const W = h.W * 10, H = h.H * 10, R = h.R * 10;
  const w = W + 20, tot = H + R + 16;
  const x0 = 10, y0 = 8 + R;
  const winW = Math.min(12, W / 5), winH = winW * 1.2;
  const wins = [];
  const nW = h.janelas >= 3 ? 2 : h.janelas;
  for (let i = 0; i < nW; i++) {
    const cx = x0 + (W / (nW + 1)) * (i + 1);
    if (Math.abs(cx - (x0 + W / 2)) < 8) continue;
    wins.push(`<rect x="${cx - winW / 2}" y="${y0 + H * 0.28}" width="${winW}" height="${winH}" fill="#F4C25B" stroke="${C.ink}" stroke-opacity=".25"/>`);
  }
  if (h.janelas >= 3) wins.push(`<circle cx="${x0 + W / 2}" cy="${y0 - R * 0.35}" r="${Math.min(6, R / 4)}" fill="#F4C25B"/>`);
  const doorW = Math.min(14, W / 4), doorH = H * 0.42;
  const chim = h.chamine ? `<rect x="${x0 + W * 0.68}" y="${y0 - R * 0.9}" width="9" height="${R * 0.7}" fill="${C.red}"/><rect x="${x0 + W * 0.68 - 1.5}" y="${y0 - R * 0.9 - 3}" width="12" height="4" fill="#fff"/>` : '';
  const nm = h.nome || '';
  const doorX = x0 + W / 2 - doorW / 2, doorY = y0 + H - doorH;
  let extra = '';
  if (nm.includes('Padaria')) {
    const ay = y0 + H * 0.18, n = 8, sw = (W + 6) / n;
    for (let i = 0; i < n; i++) extra += `<path d="M${x0 - 3 + i * sw} ${ay} h${sw} l-1 7 h${-sw + 2} Z" fill="${i % 2 ? '#fff' : C.red}" stroke="${C.ink}" stroke-opacity=".15"/>`;
    extra += `<rect x="${x0 + W / 2 - 13}" y="${y0 - R * 0.45}" width="26" height="7" rx="1.5" fill="#fff" stroke="${C.gold}"/><text x="${x0 + W / 2}" y="${y0 - R * 0.45 + 5.2}" font-size="4.4" text-anchor="middle" font-family="Nunito" font-weight="800" fill="${C.red}">PADARIA</text>`;
  }
  if (nm.includes('Correio')) {
    const cy = y0 - R * 0.35;
    extra += `<circle cx="${x0 + W / 2}" cy="${cy}" r="${Math.min(6, R / 4) + .5}" fill="#fff" stroke="${C.gold}" stroke-width="1.4"/><path d="M${x0 + W / 2} ${cy} v-3.5 M${x0 + W / 2} ${cy} h2.6" stroke="${C.ink}" stroke-width=".8"/>`;
    extra += `<rect x="${doorX + doorW + 3}" y="${y0 + H - 12}" width="6" height="8" rx="2" fill="${C.red}"/><rect x="${doorX + doorW + 5.5}" y="${y0 + H - 4}" width="1" height="4" fill="${C.ink}"/>`;
  }
  if (nm.includes('Chalé')) {
    const cy = y0 - R * 0.42;
    extra += `<path d="M${x0 + W / 2} ${cy + 4} c-6 -4 -6 -9 -2.5 -9 c1.5 0 2.5 1 2.5 2 c0 -1 1 -2 2.5 -2 c3.5 0 3.5 5 -2.5 9z" fill="${C.red}"/>`;
    extra += `<path d="M${x0 + 2} ${y0 + H * 0.62} H${x0 + W - 2}" stroke="${C.kraft || '#8A6248'}" stroke-width="2"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${x0 + 4 + i * (W - 8) / 6} ${y0 + H * 0.62} v6" stroke="#8A6248" stroke-width="1.2"/>`).join('')}`;
  }
  if (nm.includes('Brinquedos')) {
    extra += `<rect x="${x0 + 4}" y="${y0 + H * 0.45}" width="${W / 2 - doorW / 2 - 7}" height="${H * 0.4}" fill="#F4C25B" stroke="${C.ink}" stroke-opacity=".25"/>`;
    extra += `<rect x="${x0 + 7}" y="${y0 + H * 0.72}" width="6" height="6" fill="${C.red}"/><rect x="${x0 + 14}" y="${y0 + H * 0.68}" width="5" height="9" fill="${C.green}"/>`;
    extra += `<rect x="${x0 + W / 2 - 14}" y="${y0 - R * 0.45}" width="28" height="7" rx="1.5" fill="#fff" stroke="${C.gold}"/><text x="${x0 + W / 2}" y="${y0 - R * 0.45 + 5.2}" font-size="3.8" text-anchor="middle" font-family="Nunito" font-weight="800" fill="${C.green}">BRINQUEDOS</text>`;
  }
  if (nm.includes('Vovó')) {
    extra += `<rect x="${x0 + 3}" y="${y0 + H * 0.28 + winH + 1}" width="${W - 6}" height="4" rx="1" fill="${C.green}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x0 + 6 + i * (W - 12) / 5}" cy="${y0 + H * 0.28 + winH}" r="1.8" fill="${C.red}"/>`).join('')}`;
  }
  return `<svg viewBox="0 0 ${w} ${tot}" width="${(w * scale) / 10}mm" height="${(tot * scale) / 10}mm">
    ${chim}
    <path d="M${x0} ${y0} L${x0 + W / 2} ${y0 - R} L${x0 + W} ${y0} L${x0 + W} ${y0 + H} L${x0} ${y0 + H} Z" fill="#fff" stroke="${C.ink}" stroke-opacity=".3"/>
    <path d="M${x0 - 5} ${y0 + 2} L${x0 + W / 2} ${y0 - R - 3} L${x0 + W + 5} ${y0 + 2}" fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M${x0 - 6} ${y0 - 1} L${x0 + W / 2} ${y0 - R - 6} L${x0 + W + 6} ${y0 - 1}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
    ${wins.join('')}
    <rect x="${x0 + W / 2 - doorW / 2}" y="${y0 + H - doorH}" width="${doorW}" height="${doorH}" rx="${doorW / 2}" fill="${C.red}"/>
    <circle cx="${x0 + W / 2}" cy="${y0 + H - doorH - 5}" r="3" fill="${C.green}"/>
    ${extra}
    <rect x="0" y="${y0 + H}" width="${w}" height="6" rx="3" fill="#fff" stroke="${C.ink}" stroke-opacity=".15"/>
  </svg>`;
}

// Painéis (moldes) de uma casa, em mm
function housePanels(h) {
  const W = h.W * 10, D = h.D * 10, H = h.H * 10, R = h.R * 10;
  const slope = Math.sqrt((W / 2) ** 2 + R ** 2) + 5;
  const doorW = Math.min(14, W / 4), doorH = H * 0.42;
  const winW = Math.min(12, W / 5), winH = winW * 1.2;
  const lab = (x, y, t, sub) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="3.2" fill="${C.red}">${t}</text>${sub ? `<text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Nunito" font-size="2.6" fill="${C.muted}">${sub}</text>` : ''}`;
  const cut = (x, y, w, hh, arch) => arch
    ? `<path d="M${x} ${y + hh} L${x} ${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L${x + w} ${y + hh}" fill="none" stroke="${C.ink}" stroke-width=".35" stroke-dasharray="1.4 1"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="none" stroke="${C.ink}" stroke-width=".35" stroke-dasharray="1.4 1"/>`;
  const pent = `M0 ${R} L${W / 2} 0 L${W} ${R} L${W} ${R + H} L0 ${R + H} Z`;
  const nW = h.janelas >= 3 ? 2 : h.janelas;
  const frontWins = [];
  for (let i = 0; i < nW; i++) {
    const cx = (W / (nW + 1)) * (i + 1);
    if (Math.abs(cx - W / 2) < doorW / 2 + winW / 2 + 2) continue;
    frontWins.push(cut(cx - winW / 2, R + H * 0.28, winW, winH));
  }
  const panels = [
    { w: W, h: R + H, svg: `<path d="${pent}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${frontWins.join('')}${cut(W / 2 - doorW / 2, R + H - doorH, doorW, doorH, true)}${lab(W / 2, R * 0.75, 'FRENTE', '1 peça')}` },
    { w: W, h: R + H, svg: `<path d="${pent}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${cut(W / 2 - winW / 2, R + H * 0.3, winW, winH)}${lab(W / 2, R * 0.75, 'FUNDO', '1 peça')}` },
    { w: D, h: H, svg: `<rect x="0" y="0" width="${D}" height="${H}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${cut(D / 2 - winW / 2, H * 0.3, winW, winH)}${lab(D / 2, H * 0.2, 'LATERAL', 'cortar 2')}` },
    { w: D + 10, h: slope, svg: `<rect x="0" y="0" width="${D + 10}" height="${slope}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${lab((D + 10) / 2, slope / 2, 'TELHADO', 'cortar 2')}` },
  ];
  if (h.chamine) panels.push({ w: 15, h: 30, svg: `<rect x="0" y="0" width="15" height="30" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${lab(7.5, 14, 'CHAMINÉ', '×4')}` });
  return panels.map((p) => ({ ...p, name: h.nome }));
}

function churchPanels(c) {
  const W = c.W * 10, D = c.D * 10, H = c.H * 10, R = c.R * 10;
  const slope = Math.sqrt((W / 2) ** 2 + R ** 2) + 5;
  const L = c.torre.L * 10, TH = c.torre.H * 10, TP = c.torre.ponta * 10;
  const spireH = Math.sqrt(TP ** 2 + (L / 2) ** 2);
  const lab = (x, y, t, sub) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="3.2" fill="${C.red}">${t}</text><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Nunito" font-size="2.6" fill="${C.muted}">${sub}</text>`;
  const pent = `M0 ${R} L${W / 2} 0 L${W} ${R} L${W} ${R + H} L0 ${R + H} Z`;
  const dash = `fill="none" stroke="${C.ink}" stroke-width=".35" stroke-dasharray="1.4 1"`;
  return [
    { w: W, h: R + H, svg: `<path d="${pent}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/><path d="M${W / 2 - 8} ${R + H} L${W / 2 - 8} ${R + H - 18} A8 8 0 0 1 ${W / 2 + 8} ${R + H - 18} L${W / 2 + 8} ${R + H}" ${dash}/><circle cx="${W / 2}" cy="${R + 14}" r="6" ${dash}/>${lab(W / 2, R * 0.8, 'FRENTE', '1 peça')}` },
    { w: W, h: R + H, svg: `<path d="${pent}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${lab(W / 2, R + H / 2, 'FUNDO', '1 peça')}` },
    { w: D, h: H, svg: `<rect width="${D}" height="${H}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${[0.25, 0.5, 0.75].map((f) => `<path d="M${D * f - 4} ${H * 0.75} L${D * f - 4} ${H * 0.35} A4 4 0 0 1 ${D * f + 4} ${H * 0.35} L${D * f + 4} ${H * 0.75}" ${dash}/>`).join('')}${lab(D / 2, H * 0.17, 'LATERAL', 'cortar 2')}` },
    { w: D + 10, h: slope, svg: `<rect width="${D + 10}" height="${slope}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${lab((D + 10) / 2, slope / 2, 'TELHADO', 'cortar 2')}` },
    { w: L, h: TH, svg: `<rect width="${L}" height="${TH}" fill="#fff" stroke="${C.ink}" stroke-width=".55"/><path d="M${L / 2 - 4} ${TH * 0.45} L${L / 2 - 4} ${TH * 0.25} A4 4 0 0 1 ${L / 2 + 4} ${TH * 0.25} L${L / 2 + 4} ${TH * 0.45}" ${dash}/>${lab(L / 2, TH * 0.72, 'TORRE', '×4')}` },
    { w: L, h: spireH, svg: `<path d="M0 ${spireH} L${L / 2} 0 L${L} ${spireH} Z" fill="#fff" stroke="${C.ink}" stroke-width=".55"/>${lab(L / 2, spireH * 0.72, 'PONTA', '×4')}` },
  ].map((p) => ({ ...p, name: c.nome }));
}

function panelPages(title, panels) {
  const items = panels.map((p) => ({ ...p, w: p.w + 2, h: p.h + 2 }));
  const packed = pack(items, 178, 226, 6);
  return packed.map((its, i) => page(`<div class="kicker">Bônus 05 · Moldes</div><div style="font-family:Playfair;font-size:15pt;color:${C.red};font-weight:700;margin-bottom:2mm">${title}${packed.length > 1 ? ` · folha ${i + 1} de ${packed.length}` : ''}</div>${calib}
    <div style="font-size:8.5pt;color:${C.muted};margin:2mm 0">Linha contínua: contorno da placa. Linha tracejada: janela ou porta para vazar com estilete.</div>
    <div style="position:relative;height:226mm;background:#fff;border:1px dashed ${C.line};border-radius:2mm"><div style="position:absolute;inset:3mm">
    ${its.map((p) => `<svg style="position:absolute;left:${p.x}mm;top:${p.y}mm;overflow:visible" width="${p.w - 2}mm" height="${p.h - 2}mm" viewBox="0 0 ${p.w - 2} ${p.h - 2}">${p.svg}</svg>`).join('')}</div></div>`));
}

function buildVila() {
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 05 · Especial', title: 'Vila Natalina<br><em>Iluminada Completa</em>', sub: 'Passo a passo para montar uma vila com 7 casinhas, igreja e pinheiros iluminados por dentro com LED. A peça que rouba a cena na sua sala.', badge: '7 casinhas · igreja · pinheiros · moldes',
    arts: [['village', [P.white], 6, 44, 66, 0], ['church', [P.white, P.brown, P.gold], 72, 6, 66, 0], ['coneTree', [P.green, P.kraft], 146, 40, 54, 0]],
  }));

  pages.push(page(`${intro('Visão geral', 'Como a vila é construída', 'Cada casinha é uma caixa feita de placas de cerâmica fria: frente, fundo, duas laterais e duas águas de telhado. As placas secam planas e só depois são montadas. Por dentro, uma vela LED acende as janelas.')}
    <div style="display:flex;justify-content:center;gap:2mm;align-items:flex-end;margin:4mm 0 6mm;background:${C.green};border-radius:4mm;padding:8mm 4mm 6mm">${VILA.map((h) => houseArt(h, 2.1)).join('')}</div>
    <div class="grid3">
      <div class="box"><h4>Placas planas</h4><p style="margin:0">Secar plano é rápido e não deforma. A montagem fica firme e reta.</p></div>
      <div class="box"><h4>Janelas vazadas</h4><p style="margin:0">A luz do LED passa pelas janelas e dá o efeito de casinha “habitada”.</p></div>
      <div class="box"><h4>Neve e detalhes</h4><p style="margin:0">Telhados com neve, portas vermelhas e guirlandas mini dão o charme.</p></div>
    </div>
    <h3>O que você vai fazer</h3>
    <table><tr><th>Peça</th><th>Medidas (L × P × A)</th><th>Massa</th><th>Tempo total</th></tr>
      ${VILA.map((h) => `<tr><td><b>${h.nome}</b></td><td>${h.W} × ${h.D} × ${(h.H + h.R).toFixed(1).replace('.0', '')} cm</td><td>~${Math.round((h.W * (h.H + h.R / 2) * 2 + h.D * h.H * 2 + (h.D + 1) * Math.sqrt((h.W / 2) ** 2 + h.R ** 2) * 2) * 0.6 * 1.2)} g</td><td>1 h + secagem</td></tr>`).join('')}
      <tr><td><b>${IGREJA.nome}</b></td><td>${IGREJA.W} × ${IGREJA.D} × ${IGREJA.H + IGREJA.R + IGREJA.torre.H} cm (com torre)</td><td>~250 g</td><td>2 h + secagem</td></tr>
      <tr><td><b>Pinheiros (5 a 7)</b></td><td>4, 6 e 9 cm de altura</td><td>~150 g</td><td>15 min cada</td></tr></table>
    <p style="font-size:9pt;color:${C.muted}">Total aproximado: 1,5 kg de massa (cerca de 4 receitas caseiras). Você pode montar a vila aos poucos, uma casinha por dia.</p>`));

  pages.push(page(`${intro('Passo a passo geral', 'Montando uma casinha')}
    <div class="grid2" style="grid-template-columns:1.15fr .85fr;gap:6mm">
      <div>${steps([
        '<b>Imprima os moldes</b> da casinha em tamanho real e recorte as placas.',
        '<b>Abra a massa com 6 mm</b> usando os palitos-guia. Placas finas demais entortam.',
        '<b>Corte cada placa</b> pelo molde: frente, fundo, 2 laterais e 2 telhados.',
        '<b>Vaze janelas e porta</b> com o estilete, seguindo a linha tracejada. Guarde a porta para colar depois, por fora.',
        '<b>Texturize</b> enquanto a massa está mole: tijolinhos com palito, tábuas com régua, telhas com canudo.',
        '<b>Seque as placas planas por 24 h</b>, virando depois de 12 h, com um peso leve por cima.',
        '<b>Monte a caixa:</b> cole frente, laterais e fundo com cola branca grossa. Reforce as emendas por dentro com rolinhos de massa mole.',
        '<b>Cole o telhado</b> apoiando as duas águas nas paredes, com cola e massa mole na cumeeira.',
        '<b>Finalize:</b> porta, guirlanda, neve no telhado e detalhes de cada casa. Seque mais 48 h.',
        '<b>Deixe o fundo aberto</b> ou com uma abertura para trocar a vela LED.',
      ])}</div>
      <div>
        <div class="box gold"><h4>Base (opcional)</h4><p style="margin:0">Corte um retângulo de massa 1 cm maior que a casinha e cole por baixo. A casinha fica mais firme e ganha um “quintal” para neve.</p></div>
        <div class="box"><h4>Neve que parece de verdade</h4><p style="margin:0">Misture 2 colheres de bicarbonato com 1 colher de cola branca e um pingo de tinta branca. Aplique com espátula nos telhados e na base. Seca em 2 h.</p></div>
        <div class="box green"><h4>Por dentro</h4><p style="margin:0">Pinte o interior das paredes de amarelo-claro ou cole papel vegetal atrás das janelas: a luz fica dourada e difusa.</p></div>
        <div class="box red"><h4>Segurança</h4><p style="margin:0">Use <b>somente vela LED ou fio de LED a pilha</b>. Vela de verdade, nunca: a cerâmica fria não resiste ao calor e pode queimar.</p></div>
      </div>
    </div>`));

  VILA.forEach((h, i) => {
    pages.push(page(`<div class="kicker">Casinha ${i + 1} de 7</div><h2>${h.nome}</h2><p class="lead">${h.desc}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6mm;align-items:center;margin:4mm 0">
        <div style="background:${C.green};border-radius:4mm;height:92mm;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8mm">${houseArt(h, 7.2)}</div>
        <div><table style="margin-bottom:3mm"><tr><th colspan="2">Medidas</th></tr><tr><td>Largura (frente)</td><td><b>${h.W} cm</b></td></tr><tr><td>Profundidade</td><td><b>${h.D} cm</b></td></tr><tr><td>Altura da parede</td><td><b>${h.H} cm</b></td></tr><tr><td>Altura total</td><td><b>${(h.H + h.R).toString().replace('.', ',')} cm</b></td></tr><tr><td>Placas</td><td><b>6${h.chamine ? ' + chaminé' : ''}</b></td></tr></table>
        <div class="box gold" style="margin:0"><h4>Detalhes desta casinha</h4><ul class="clean">${h.detalhes.map((d) => `<li>${d}</li>`).join('')}</ul></div></div>
      </div>
      <div class="grid3" style="margin-bottom:2mm">
        <div class="box" style="margin:0"><h4>Massa</h4><p style="margin:0">Cerca de ${Math.round((h.W * (h.H + h.R / 2) * 2 + h.D * h.H * 2 + (h.D + 1) * Math.sqrt((h.W / 2) ** 2 + h.R ** 2) * 2) * 0.6 * 1.2)} g de massa branca + pedacinhos de vermelho, verde e dourado.</p></div>
        <div class="box" style="margin:0"><h4>Tempo</h4><p style="margin:0">1 h de modelagem, 24 h de secagem das placas e 48 h depois de montada.</p></div>
        <div class="box" style="margin:0"><h4>Luz</h4><p style="margin:0">1 vela LED tipo rechaud, colocada pelo fundo aberto.</p></div>
      </div>
      <h3>Passo a passo</h3>
      ${steps([
        `Corte as 6 placas pelos moldes da folha “${h.nome}” e vaze as ${h.janelas} janelas e a porta.`,
        `Texturize as paredes ${i % 2 ? 'com tábuas horizontais (risque com uma régua)' : 'com tijolinhos (pontinhos e linhas com palito)'} e o telhado com telhas (canudo cortado ao meio).`,
        'Seque as placas planas por 24 h e monte a caixa como no passo a passo geral.',
        `Faça os detalhes: ${h.detalhes.map((d) => d.toLowerCase()).join('; ')}.`,
        'Aplique a neve no telhado, seque 48 h e coloque a vela LED por trás.',
      ])}`));
    pages.push(...panelPages(`Moldes · ${h.nome}`, housePanels(h)));
  });

  pages.push(page(`<div class="kicker">Peça principal</div><h2>${IGREJA.nome}</h2><p class="lead">A maior peça da vila, com torre e sino. Fica no centro ou ao fundo, um pouco mais alta que as casinhas.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6mm;align-items:center;margin:4mm 0">
      <div style="background:${C.green};border-radius:4mm;height:86mm;display:flex;align-items:center;justify-content:center">${svgArt('church', [P.white, P.red, P.gold], 66)}</div>
      <div><table><tr><th colspan="2">Medidas</th></tr><tr><td>Corpo</td><td><b>${IGREJA.W} × ${IGREJA.D} × ${IGREJA.H + IGREJA.R} cm</b></td></tr><tr><td>Torre</td><td><b>${IGREJA.torre.L} × ${IGREJA.torre.L} × ${IGREJA.torre.H} cm</b></td></tr><tr><td>Ponta da torre</td><td><b>${IGREJA.torre.ponta} cm</b></td></tr><tr><td>Placas</td><td><b>14</b></td></tr></table></div>
    </div>
    <h3>Passo a passo</h3>
    ${steps([
      'Corte frente, fundo, 2 laterais e 2 telhados. Vaze a porta em arco, a rosácea redonda e as 3 janelas de cada lateral.',
      'Corte as 4 paredes da torre e as 4 pontas triangulares. Vaze a janelinha do sino em cada parede.',
      'Seque todas as placas planas por 24 h.',
      'Monte o corpo da igreja como uma casinha. Monte a torre como uma caixinha quadrada e a ponta como uma pirâmide.',
      'Cole a torre em pé sobre a frente da igreja, apoiada na cumeeira, com bastante massa mole. Cole a pirâmide no topo.',
      'Coloque um sino de massa dourada dentro da torre e a cruz de arame na ponta. Neve nos telhados e LED dentro.',
    ])}
    <div class="box gold"><h4>Dica</h4><p style="margin:0">Monte a torre separada e só cole na igreja quando as duas partes estiverem secas. Fica muito mais fácil acertar o prumo.</p></div>`));
  pages.push(...panelPages(`Moldes · ${IGREJA.nome}`, churchPanels(IGREJA)));

  pages.push(page(`${intro('Complementos', 'Pinheiros e montagem da vila')}
    <div class="grid2" style="grid-template-columns:.8fr 1.2fr;align-items:center">
      <div style="display:flex;align-items:flex-end;justify-content:center;gap:2mm;background:${C.green};border-radius:4mm;padding:8mm 2mm">${svgArt('coneTree', [P.green, P.kraft], 22)}${svgArt('coneTree', [P.white, P.kraft], 32)}${svgArt('coneTree', [P.green, P.kraft], 42)}</div>
      <div><h3 style="margin-top:0">Pinheiros em 3 tamanhos</h3>${steps(['Faça cones de papel-alumínio de 4, 6 e 9 cm.', 'Cubra com 3 mm de massa verde (ou branca, para pinheiros nevados).', 'Com a tesoura de ponta fina, levante pontinhas de baixo para cima.', 'Faça 5 a 7 pinheiros e seque 3 dias em pé.'])}</div>
    </div>
    <h3>Montando a vila</h3>
    ${steps([
      'Use uma base de MDF, uma tábua ou uma bandeja grande (por volta de 60 × 25 cm).',
      'Forre com algodão, feltro branco ou a neve de bicarbonato.',
      'Coloque a igreja ao fundo e no centro, mais alta.',
      'Distribua as casinhas em duas fileiras, as maiores atrás. Deixe “ruazinhas” entre elas.',
      'Espalhe os pinheiros nas pontas e entre as casas, em grupos de 2 ou 3.',
      'Passe um fio de LED a pilha por trás das casas e coloque uma vela LED dentro de cada uma.',
      'Complete com caminhos de pedrinhas, um lago de espelho, um trenó e bonequinhos de neve.',
    ])}
    <div class="box red" style="margin-top:3mm"><h3 style="margin-top:0">O toque final</h3><p style="margin:0">Apague as luzes da sala e acenda só a vila. As janelas acesas, a neve e os pinheiros fazem a peça virar o centro das atenções do Natal.</p></div>`));
  return pages;
}

// ═════════ BÔNUS 6 · MATERIAIS ═════════
function buildMateriais() {
  const pages = [];
  pages.push(cover({
    tag: 'Bônus 06', title: 'Lista Completa<br><em>de Materiais</em>', sub: 'Tudo o que comprar (e o que trocar pelo que já tem em casa), com a receita da massa caseira e um checklist para levar na loja.', badge: 'Lista · substituições · receita · checklist', green: true,
    arts: [['gift', [P.white, P.gold, P.gold], 10, 46, 58, -6], ['cup', [P.white], 74, 6, 62, 4], ['mitten', [P.white, P.kraft, P.gold], 142, 50, 58, 6]],
  }));
  pages.push(page(`${intro('Antes de comprar', 'Comece com pouco', 'Você não precisa comprar tudo de uma vez. Com o <b>kit essencial</b> já dá para fazer a maioria dos enfeites. Os outros itens entram conforme você avança.')}
    <div class="grid2">
      <div class="box red"><h4>Kit essencial (cerca de R$ 60 a R$ 90)</h4><ul class="clean" style="color:#fff">
        <li>500 g de massa pronta ou ingredientes da massa caseira</li><li>Creme hidratante</li><li>Rolo pequeno e palitos-guia</li><li>Estilete</li><li>Palitos e canudos</li><li>Cola branca</li><li>Tinta acrílica branca, vermelha, verde e dourada</li><li>Verniz à base de água</li><li>Barbante ou fita</li></ul></div>
      <div class="box gold"><h4>Onde economizar</h4><ul class="clean">
        <li><b>Massa caseira</b> custa cerca de um terço da pronta.</li>
        <li><b>Rendas e toalhinhas</b> antigas da família viram texturas lindas.</li>
        <li><b>Tampinhas, botões e garfos</b> são ótimos carimbos.</li>
        <li><b>Compre tinta em cores básicas</b> e misture as outras.</li>
        <li>Lojas de <b>embalagens e festas</b> têm cortadores e fitas mais baratos.</li></ul></div>
    </div>
    <h3>Receita rápida da massa caseira</h3>
    <div class="grid2">
      <div class="box"><h4>Ingredientes (~400 g)</h4><ul class="clean"><li>1 xícara (chá) de amido de milho</li><li>1 xícara (chá) de cola branca PVA</li><li>1 colher (sopa) de vaselina líquida ou óleo</li><li>1 colher (sopa) de suco de limão ou vinagre</li></ul></div>
      <div class="box"><h4>Modo de fazer</h4><p style="margin:0">Misture tudo frio na panela antiaderente. Fogo baixo, mexendo sem parar, até virar uma bola que solta da panela (5 a 8 min). Sove morna com creme e descanse 8 h embrulhada em filme.</p></div>
    </div>`));
  const tabela = (gs) => gs.map((g) => `<h3 style="margin-top:3.5mm;margin-bottom:1.5mm">${g.grupo}</h3><table style="margin-bottom:1mm;font-size:8.8pt"><tr><th style="width:42%">Item</th><th style="width:26%">Onde comprar</th><th>Troque por (o que já tem em casa)</th></tr>${g.itens.map(([a, b, c]) => `<tr><td style="padding:1.3mm 3mm">${a}</td><td style="padding:1.3mm 3mm">${b}</td><td style="padding:1.3mm 3mm">${c}</td></tr>`).join('')}</table>`).join('');
  pages.push(page(`${intro('Lista completa · 1/2', 'O que comprar e o que trocar')}${tabela(MATERIAIS.slice(0, 3))}`));
  pages.push(page(`${intro('Lista completa · 2/2', 'Cor, acabamento e montagem')}${tabela(MATERIAIS.slice(3))}`));
  pages.push(page(`<div style="display:flex;justify-content:space-between;align-items:flex-end"><div>${intro('Para levar na loja', 'Checklist de compras')}</div><div class="hand" style="font-size:18pt;color:${C.red}">Imprima e marque ✓</div></div>
    <div style="columns:2;column-gap:8mm">
      ${MATERIAIS.map((g) => `<div style="break-inside:avoid;margin-bottom:4mm"><div style="font-family:Playfair;color:${C.green};font-weight:700;font-size:12pt;margin-bottom:1.5mm">${g.grupo}</div>${g.itens.map(([a]) => `<div style="display:flex;gap:2.5mm;align-items:flex-start;margin-bottom:1.6mm;font-size:9.5pt"><span style="flex:none;width:4.5mm;height:4.5mm;border:1.5px solid ${C.red};border-radius:1mm;margin-top:.6mm"></span><span>${a}</span></div>`).join('')}</div>`).join('')}
      <div style="break-inside:avoid"><div style="font-family:Playfair;color:${C.green};font-weight:700;font-size:12pt;margin-bottom:1.5mm">Anotações</div>${Array.from({ length: 6 }).map(() => `<div style="border-bottom:1px solid ${C.line};height:7mm"></div>`).join('')}</div>
    </div>`));
  return pages;
}

module.exports = { buildSecagem, buildVender, buildCriancas, buildVila, buildMateriais };
