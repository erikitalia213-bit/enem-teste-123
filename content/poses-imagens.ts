/**
 * Descrição das poses de início e fim de cada exercício, usadas para gerar
 * docs/prompt-imagens-exercicios.md (npm run docs:imagens).
 * `vista`: "lateral" é o padrão; "frontal" só para movimentos que acontecem para o lado.
 */
export interface PoseImagem {
  vista: "lateral" | "frontal";
  musculo: string;
  equipamento: string;
  inicio: string;
  fim: string;
}

export const posesImagens: Record<string, PoseImagem> = {
  "hip-thrust-barra": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "banco reto baixo e barra olímpica com protetor acolchoado sobre o quadril, anilhas cinza-escuras",
    inicio: "costas apoiadas na borda do banco na altura das escápulas, quadril baixo perto do chão, joelhos dobrados, pés no chão, barra sobre a dobra do quadril",
    fim: "quadril elevado até o tronco ficar alinhado com as coxas (paralelo ao chão), joelhos a 90°, queixo levemente para dentro, barra no alto",
  },
  "hip-thrust-chao": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "colchonete escuro",
    inicio: "deitada de barriga para cima no colchonete, joelhos dobrados, pés apoiados perto do bumbum, quadril no chão, braços ao lado do corpo",
    fim: "quadril elevado formando uma linha reta de joelhos a ombros, braços no chão",
  },
  "hip-thrust-mochila": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "sofá baixo e mochila escura cheia apoiada sobre o quadril, segurada com as mãos",
    inicio: "costas apoiadas na borda do sofá, quadril baixo, joelhos dobrados, pés no chão, mochila sobre o quadril",
    fim: "quadril elevado com o tronco paralelo ao chão, joelhos a 90°, mochila no alto",
  },
  "glute-bridge-unilateral": {
    vista: "lateral",
    musculo: "glúteo da perna de apoio",
    equipamento: "colchonete escuro",
    inicio: "deitada de barriga para cima, um pé apoiado perto do bumbum, a outra perna esticada no ar apontando para o teto, quadril no chão",
    fim: "quadril elevado e nivelado, apoiado em um só pé, perna livre esticada para cima",
  },
  "frog-pump": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "colchonete escuro",
    inicio: "deitada de barriga para cima, solas dos pés juntas e joelhos abertos como borboleta, cotovelos apoiados, quadril no chão",
    fim: "quadril elevado mantendo as solas dos pés juntas e os joelhos abertos",
  },
  "ponte-isometria": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "colchonete escuro e mini band nos joelhos",
    inicio: "deitada de barriga para cima, joelhos dobrados, pés na largura do quadril, quadril no chão, mini band acima dos joelhos",
    fim: "quadril elevado e parado em linha reta de joelhos a ombros, joelhos empurrando o elástico para fora",
  },
  "coice-polia": {
    vista: "lateral",
    musculo: "glúteo da perna que chuta",
    equipamento: "aparelho de polia baixa cinza com tornozeleira presa no tornozelo",
    inicio: "em pé de frente para a polia, segurando o aparelho, tronco levemente inclinado, perna de trabalho ao lado da perna de apoio",
    fim: "perna de trabalho estendida para trás e um pouco para cima, calcanhar empurrando, tronco estável sem arquear a lombar",
  },
  "coice-elastico-4-apoios": {
    vista: "lateral",
    musculo: "glúteo da perna que empurra",
    equipamento: "colchonete escuro e elástico passando pela sola do pé, pontas presas sob as mãos",
    inicio: "em quatro apoios, mãos sob os ombros, joelhos sob o quadril, joelho da perna de trabalho perto do chão",
    fim: "perna de trabalho empurrada para trás e para cima até a coxa alinhar com o tronco, elástico esticado, costas retas",
  },
  "kickback-pe-elastico": {
    vista: "lateral",
    musculo: "glúteo da perna que vai para trás",
    equipamento: "mini band nos tornozelos e parede para apoio das mãos",
    inicio: "em pé, mãos apoiadas na parede, tronco levemente inclinado, pés juntos com a mini band nos tornozelos",
    fim: "uma perna estendida para trás em diagonal contra o elástico, quadril alinhado, tronco parado",
  },
  "extensao-quadril-banco-45": {
    vista: "lateral",
    musculo: "glúteos e parte de cima do posterior de coxa",
    equipamento: "banco de hiperextensão 45° cinza",
    inicio: "no banco 45°, quadril logo acima do apoio, tronco dobrado para baixo, costas levemente arredondadas",
    fim: "corpo em linha reta da cabeça aos pés (sem passar da linha), glúteos contraídos",
  },
  stiff: {
    vista: "lateral",
    musculo: "posterior de coxa e glúteos",
    equipamento: "barra olímpica com anilhas cinza-escuras",
    inicio: "em pé, barra na frente das coxas, joelhos levemente dobrados, coluna reta",
    fim: "quadril empurrado para trás, tronco inclinado com a coluna reta, barra rente às pernas na altura das canelas",
  },
  "stiff-unilateral": {
    vista: "lateral",
    musculo: "posterior de coxa e glúteo da perna de apoio",
    equipamento: "halter cinza na mão oposta à perna de apoio",
    inicio: "em pé sobre uma perna, joelho levemente dobrado, halter ao lado da coxa",
    fim: "tronco inclinado à frente e perna livre estendida para trás formando uma linha (gangorra), quadril nivelado, halter perto da canela",
  },
  "good-morning": {
    vista: "lateral",
    musculo: "posterior de coxa e glúteos",
    equipamento: "barra apoiada no trapézio",
    inicio: "em pé, barra nas costas, joelhos levemente dobrados, coluna reta",
    fim: "quadril para trás e tronco quase paralelo ao chão, coluna reta, barra nas costas",
  },
  "mesa-flexora": {
    vista: "lateral",
    musculo: "posterior de coxa",
    equipamento: "mesa flexora cinza",
    inicio: "deitada de barriga para baixo na mesa flexora, pernas estendidas, rolo acima dos calcanhares",
    fim: "joelhos dobrados trazendo o rolo em direção ao bumbum, quadril colado no banco",
  },
  "flexora-toalha": {
    vista: "lateral",
    musculo: "posterior de coxa",
    equipamento: "toalha sob os calcanhares e piso liso",
    inicio: "deitada de barriga para cima, quadril elevado, pernas quase esticadas com os calcanhares sobre a toalha",
    fim: "quadril ainda elevado, calcanhares puxados com a toalha até perto do bumbum, joelhos dobrados",
  },
  "abducao-maquina": {
    vista: "frontal",
    musculo: "glúteo médio (lateral do quadril)",
    equipamento: "cadeira abdutora cinza",
    inicio: "sentada na cadeira abdutora, tronco levemente inclinado à frente, pernas fechadas contra as almofadas",
    fim: "pernas abertas ao máximo empurrando as almofadas para fora",
  },
  "abducao-quadril-cabo": {
    vista: "frontal",
    musculo: "glúteo médio da perna que se move",
    equipamento: "polia baixa com tornozeleira",
    inicio: "em pé de lado para a polia, mão apoiada no aparelho, perna de trabalho cruzada levemente à frente da perna de apoio",
    fim: "perna de trabalho levada para o lado e um pouco para trás, tronco reto",
  },
  "abducao-elastico-sentada": {
    vista: "frontal",
    musculo: "glúteo médio (lateral do quadril)",
    equipamento: "cadeira simples e mini band acima dos joelhos",
    inicio: "sentada na ponta da cadeira, tronco levemente inclinado, pés e joelhos juntos com o elástico acima dos joelhos",
    fim: "joelhos abertos ao máximo contra o elástico, pés juntos no chão",
  },
  "abducao-elastico-deitada": {
    vista: "frontal",
    musculo: "glúteo médio da perna de cima",
    equipamento: "colchonete escuro e mini band nos tornozelos",
    inicio: "deitada de lado, pernas esticadas uma sobre a outra, cabeça apoiada no braço",
    fim: "perna de cima elevada um pouco acima da altura do quadril, pé apontando para a frente",
  },
  "clam-shell": {
    vista: "frontal",
    musculo: "glúteo médio e rotadores",
    equipamento: "colchonete escuro e mini band acima dos joelhos",
    inicio: "deitada de lado, joelhos dobrados a 45°, pés e joelhos juntos",
    fim: "joelho de cima aberto como uma ostra, pés ainda juntos, quadril empilhado",
  },
  "caminhada-lateral-elastico": {
    vista: "frontal",
    musculo: "glúteo médio dos dois lados",
    equipamento: "mini band acima dos joelhos",
    inicio: "em meio agachamento, pés na largura do quadril, elástico esticado acima dos joelhos",
    fim: "ainda em meio agachamento, um passo largo para o lado, pés afastados além da largura dos ombros",
  },
  "afundo-lateral": {
    vista: "frontal",
    musculo: "glúteo da perna dobrada",
    equipamento: "halter segurado junto ao peito",
    inicio: "em pé, pés juntos, halter junto ao peito",
    fim: "passo largo para o lado, quadril sentado para trás sobre a perna dobrada, outra perna esticada, pés apontando para a frente",
  },
  "agachamento-bulgaro": {
    vista: "lateral",
    musculo: "glúteo da perna da frente",
    equipamento: "banco reto atrás e halteres nas mãos",
    inicio: "em pé, peito do pé de trás apoiado no banco, perna da frente à frente com passo longo, tronco levemente inclinado",
    fim: "agachada com a coxa da frente quase paralela ao chão, joelho de trás perto do chão",
  },
  "agachamento-sumo": {
    vista: "frontal",
    musculo: "glúteos e parte interna das coxas",
    equipamento: "kettlebell segurado com os braços esticados entre as pernas",
    inicio: "em pé, pés bem afastados com as pontas para fora, kettlebell pendurado entre as pernas",
    fim: "agachada com o quadril baixo, joelhos apontando na direção dos pés, peito aberto",
  },
  "agachamento-pausa": {
    vista: "lateral",
    musculo: "glúteos e coxas",
    equipamento: "nenhum (peso do corpo), braços estendidos à frente",
    inicio: "em pé, pés na largura dos ombros, braços estendidos à frente",
    fim: "agachamento profundo e parado, quadril para trás e para baixo, coluna reta, braços à frente",
  },
  "agachamento-goblet": {
    vista: "lateral",
    musculo: "coxas (frente) e glúteos",
    equipamento: "halter segurado junto ao peito",
    inicio: "em pé, halter junto ao peito, pés na largura dos ombros",
    fim: "agachada com os cotovelos passando por dentro dos joelhos, peito aberto, calcanhares no chão",
  },
  "passada-para-tras": {
    vista: "lateral",
    musculo: "glúteo da perna da frente",
    equipamento: "halteres nas mãos ao lado do corpo",
    inicio: "em pé, pés na largura do quadril, halteres ao lado do corpo",
    fim: "passo grande para trás, joelho de trás quase tocando o chão, coxa da frente paralela ao chão",
  },
  "step-up-banco": {
    vista: "lateral",
    musculo: "glúteo da perna que está no banco",
    equipamento: "banco reto ou caixote",
    inicio: "um pé inteiro apoiado em cima do banco, outro pé no chão, tronco levemente inclinado",
    fim: "em pé em cima do banco sobre a perna de trabalho, outra perna dobrada no ar",
  },
  "leg-press-pes-altos": {
    vista: "lateral",
    musculo: "glúteos e coxas",
    equipamento: "leg press 45° cinza",
    inicio: "sentada no leg press, lombar colada, pés na parte alta da plataforma, pernas quase estendidas",
    fim: "plataforma descida, joelhos dobrados em direção ao peito, bumbum colado no banco",
  },
  "ativacao-5-minutos": {
    vista: "lateral",
    musculo: "glúteos inteiros",
    equipamento: "colchonete escuro e mini band",
    inicio: "deitada de barriga para cima, joelhos dobrados, pés no chão, mini band nos joelhos (início da ponte de ativação)",
    fim: "quadril elevado na ponte, joelhos empurrando o elástico para fora",
  },
  "mobilidade-90-90": {
    vista: "lateral",
    musculo: "glúteo da perna da frente",
    equipamento: "colchonete escuro",
    inicio: "sentada no chão, uma perna dobrada à frente a 90° e a outra dobrada ao lado a 90°, tronco reto",
    fim: "mesma posição com as pernas trocadas para o outro lado, tronco inclinado sobre a perna da frente",
  },
  "alongamento-flexor-quadril": {
    vista: "lateral",
    musculo: "frente do quadril da perna de trás e glúteo dessa mesma perna",
    equipamento: "colchonete escuro",
    inicio: "ajoelhada com uma perna à frente (pé no chão, joelho a 90°) e o joelho de trás apoiado, tronco reto",
    fim: "corpo levemente projetado à frente, quadril encaixado, glúteo da perna de trás contraído",
  },
};
