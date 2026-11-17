import { useId, useMemo, useState } from "react";
import { OFERTA } from "@/config/oferta";
import { formatarPreco, linkSuporte, montarCheckoutUrl } from "@/lib/checkout";

/* ------------------------------------------------------------------
 * Imagens locais (client/public/assets/ceia-a-dois/)
 * Cada foto tem a versão original (1440 px) e uma de 720 px para celular.
 * ------------------------------------------------------------------ */
const PASTA = "/assets/ceia-a-dois/";

type FotoProps = {
  nome: string;
  largura: number;
  altura: number;
  alt: string;
  sizes: string;
  prioridade?: boolean;
  className?: string;
};

function Foto({ nome, largura, altura, alt, sizes, prioridade = false, className }: FotoProps) {
  return (
    <img
      className={className}
      src={`${PASTA}${nome}-720.webp`}
      srcSet={`${PASTA}${nome}-720.webp 720w, ${PASTA}${nome}.webp 1440w`}
      sizes={sizes}
      width={largura}
      height={altura}
      alt={alt}
      loading={prioridade ? "eager" : "lazy"}
      decoding={prioridade ? "sync" : "async"}
      fetchPriority={prioridade ? "high" : "auto"}
    />
  );
}

/* ------------------------------------------------------------------
 * Conteúdo dos cardápios (proposta — conferir com o PDF final)
 * ------------------------------------------------------------------ */
type Cardapio = {
  data: "Natal" | "Réveillon";
  nivel: "Econômico" | "Especial";
  foto: { nome: string; altura: number; alt: string };
  entrada: string;
  principal: string;
  sobremesa: string;
};

const CARDAPIOS: Cardapio[] = [
  {
    data: "Natal",
    nivel: "Econômico",
    foto: {
      nome: "02-natal-economico",
      altura: 810,
      alt: "Mesa de Natal com bruschettas de tomate, sobrecoxas assadas com batatas douradas e taças de mousse de chocolate",
    },
    entrada: "Bruschetta de tomate",
    principal: "Sobrecoxas assadas com batatas",
    sobremesa: "Mousse de chocolate",
  },
  {
    data: "Natal",
    nivel: "Especial",
    foto: {
      nome: "03-natal-especial",
      altura: 810,
      alt: "Lombo suíno fatiado ao molho de laranja com batatas gratinadas, espetinhos caprese e taças de pavê de frutas vermelhas",
    },
    entrada: "Espetinhos caprese",
    principal: "Lombo suíno ao molho de laranja com batatas gratinadas",
    sobremesa: "Pavê de frutas vermelhas",
  },
  {
    data: "Réveillon",
    nivel: "Econômico",
    foto: {
      nome: "04-reveillon-economico",
      altura: 810,
      alt: "Risoto de limão com frango grelhado, torradas com ricota e ervas e taças de mousse de maracujá em mesa clara de Réveillon",
    },
    entrada: "Torradas com ricota e ervas",
    principal: "Risoto de limão com frango",
    sobremesa: "Mousse de maracujá",
  },
  {
    data: "Réveillon",
    nivel: "Especial",
    foto: {
      nome: "05-reveillon-especial",
      altura: 960,
      alt: "Salmão assado com arroz de limão e vagem, canapés de pepino com cream cheese e mini cheesecakes com morangos",
    },
    entrada: "Canapés de pepino com cream cheese",
    principal: "Salmão com arroz de limão e vagem",
    sobremesa: "Mini cheesecake com morangos",
  },
];

const DATAS: { data: Cardapio["data"]; descricao: string }[] = [
  { data: "Natal", descricao: "Para a noite de 24 ou o almoço do dia 25." },
  { data: "Réveillon", descricao: "Para esperar a virada a dois." },
];

const CONTEUDO_GUIA = [
  {
    titulo: "Receitas com porções para dois",
    texto: "Entrada, prato principal e sobremesa com quantidades pensadas para duas pessoas.",
  },
  {
    titulo: "Lista de mercado por cardápio",
    texto: "Cada cardápio tem a própria lista de compras. É só escolher a ceia e levar a lista ao mercado.",
  },
  {
    titulo: "Ordem de preparo",
    texto: "A sequência de cada etapa, do que pode ser adiantado ao que vai ao forno por último, para servir tudo no ponto.",
  },
];

const PASSOS = ["Escolham o cardápio", "Façam as compras com a lista", "Sigam a ordem de preparo"];

/* ------------------------------------------------------------------
 * FAQ (acordeão acessível por teclado: Tab + Enter/Espaço)
 * ------------------------------------------------------------------ */
type Pergunta = { pergunta: string; resposta: React.ReactNode };

function ItemFaq({ pergunta, resposta, aberto, alternar }: Pergunta & { aberto: boolean; alternar: () => void }) {
  const id = useId();
  return (
    <div className={`faq-item${aberto ? " aberto" : ""}`}>
      <h3>
        <button type="button" id={`${id}-q`} aria-expanded={aberto} aria-controls={`${id}-r`} onClick={alternar}>
          <span>{pergunta}</span>
          <span className="faq-icone" aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-r`} role="region" aria-labelledby={`${id}-q`} hidden={!aberto} className="faq-resposta">
        <p>{resposta}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function BotaoTopo() {
  return (
    <a className="cta" href="#oferta">
      Quero os 4 cardápios
    </a>
  );
}

export default function Home() {
  const preco = formatarPreco(OFERTA.precoCentavos);
  const checkout = useMemo(() => montarCheckoutUrl(), []);
  const suporte = linkSuporte();
  const entrega = OFERTA.entrega.trim();
  const garantiaDias = OFERTA.garantia.dias;
  const temGarantia = typeof garantiaDias === "number" && garantiaDias > 0;
  const textoGarantia =
    OFERTA.garantia.texto?.trim() ||
    `Você tem ${garantiaDias} dias a partir da compra para pedir o reembolso, conforme a política da plataforma de pagamento.`;

  const perguntas: Pergunta[] = [
    {
      pergunta: "O que vem no kit?",
      resposta:
        "Quatro cardápios completos: dois de Natal e dois de Réveillon. Cada um tem entrada, prato principal e sobremesa, com lista de compras e ordem de preparo.",
    },
    {
      pergunta: "Quantas pessoas serve?",
      resposta: "As receitas são pensadas para duas pessoas.",
    },
    {
      pergunta: "Inclui as duas datas?",
      resposta:
        "Sim. Os cardápios de Natal e de Réveillon estão no mesmo guia. Vocês podem fazer um em cada data ou escolher só o que preferirem.",
    },
    {
      pergunta: "Como recebo o acesso?",
      resposta: entrega
        ? `É um material digital, sem envio físico. ${entrega}`
        : "É um material digital em PDF, sem envio físico. A forma de acesso é informada na finalização da compra.",
    },
    {
      pergunta: "O pagamento é único?",
      resposta: `Sim. Você paga ${preco} uma única vez. Não é assinatura nem cobrança recorrente.`,
    },
  ];
  if (temGarantia) perguntas.push({ pergunta: "Tem garantia?", resposta: textoGarantia });
  if (suporte)
    perguntas.push({
      pergunta: "Como falo com o suporte?",
      resposta: (
        <>
          Pelo canal oficial: <a href={suporte.href}>{suporte.texto}</a>.
        </>
      ),
    });

  const [abertos, setAbertos] = useState<Set<number>>(() => new Set([0]));
  const alternar = (i: number) =>
    setAbertos(atual => {
      const novo = new Set(atual);
      if (novo.has(i)) novo.delete(i);
      else novo.add(i);
      return novo;
    });

  return (
    <div className="ceia">
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="marca">
        <span className="marca-nome">Ceia a Dois</span>
        <span className="marca-sub">Natal e Réveillon em casa</span>
      </header>

      <main id="conteudo">
        {/* 1. TOPO */}
        <section className="hero" aria-labelledby="titulo-principal">
          <div className="hero-texto">
            <p className="kicker">Guia digital · 4 cardápios para dois</p>
            <h1 id="titulo-principal">Uma ceia especial para vocês dois, do Natal à virada.</h1>
            <p className="hero-sub">
              Escolha entre 4 cardápios de Natal e Réveillon com porções para dois, lista de compras e a ordem certa para preparar
              cada prato.
            </p>
            <div className="hero-acao">
              <BotaoTopo />
              <p className="nota-digital">Material digital em PDF · nada é enviado pelo correio</p>
            </div>
          </div>
          <div className="hero-foto">
            <Foto
              nome="01-capa-ceia-a-dois"
              largura={1440}
              altura={810}
              sizes="(min-width: 960px) 52vw, 100vw"
              alt="Casal brindando com espumante diante de uma mesa de ceia com ave assada, velas e árvore de Natal ao fundo"
              prioridade
            />
          </div>
        </section>

        {/* 2. ESCOLHA A CEIA */}
        <section id="cardapios" className="secao secao-marfim" aria-labelledby="titulo-cardapios">
          <div className="largura">
            <p className="kicker">Escolha a ceia</p>
            <h2 id="titulo-cardapios">Quatro cardápios completos, dois para cada data</h2>
            <p className="intro">Cada cardápio tem entrada, prato principal e sobremesa. Há uma opção econômica e uma especial por data.</p>

            {DATAS.map(({ data, descricao }) => (
              <div className="grupo-data" key={data}>
                <div className="grupo-cabecalho">
                  <h3>{data}</h3>
                  <p>{descricao}</p>
                </div>
                <div className="cards">
                  {CARDAPIOS.filter(c => c.data === data).map(c => (
                    <article className="card" key={c.foto.nome}>
                      <Foto
                        className="card-foto"
                        nome={c.foto.nome}
                        largura={1440}
                        altura={c.foto.altura}
                        sizes="(min-width: 1120px) 520px, (min-width: 720px) 46vw, 100vw"
                        alt={c.foto.alt}
                      />
                      <div className="card-corpo">
                        <span className={`selo selo-${c.nivel === "Especial" ? "especial" : "economico"}`}>{c.nivel}</span>
                        <h4>
                          {c.data} {c.nivel.toLowerCase()}
                        </h4>
                        <dl className="pratos">
                          <div>
                            <dt>Entrada</dt>
                            <dd>{c.entrada}</dd>
                          </div>
                          <div>
                            <dt>Principal</dt>
                            <dd>{c.principal}</dd>
                          </div>
                          <div>
                            <dt>Sobremesa</dt>
                            <dd>{c.sobremesa}</dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. POR DENTRO DO GUIA */}
        <section id="guia" className="secao" aria-labelledby="titulo-guia">
          <div className="largura duas-colunas">
            <figure className="previa">
              <Foto
                nome="06-previa-do-guia"
                largura={1440}
                altura={960}
                sizes="(min-width: 960px) 50vw, 100vw"
                alt="Tablet mostrando uma receita do guia ao lado de uma lista de compras e de uma folha com a ordem de preparo, sobre mesa com guardanapos bordô"
              />
              <figcaption>Prévia ilustrativa</figcaption>
            </figure>
            <div>
              <p className="kicker">Por dentro do guia</p>
              <h2 id="titulo-guia">Tudo o que vocês precisam para a ceia sair no ponto</h2>
              <ul className="blocos">
                {CONTEUDO_GUIA.map(b => (
                  <li key={b.titulo}>
                    <h3>{b.titulo}</h3>
                    <p>{b.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. COMO USAR */}
        <section id="como-usar" className="secao secao-bordo" aria-labelledby="titulo-como-usar">
          <div className="largura duas-colunas invertida">
            <div>
              <p className="kicker">Como usar</p>
              <h2 id="titulo-como-usar">Para fazer juntos ou para surpreender quem você ama</h2>
              <p className="texto-largo">
                Escolha o cardápio, faça as compras com a lista e siga a ordem de preparo para servir a ceia.
              </p>
              <ol className="passos">
                {PASSOS.map((p, i) => (
                  <li key={p}>
                    <span className="passo-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
              <BotaoTopo />
            </div>
            <Foto
              className="foto-arredondada"
              nome="07-preparo-em-casal"
              largura={1440}
              altura={810}
              sizes="(min-width: 960px) 50vw, 100vw"
              alt="Casal sorrindo enquanto prepara a ceia juntos na cozinha, temperando um assado com batatas"
            />
          </div>
        </section>

        {/* 5. OFERTA */}
        <section id="oferta" className="secao secao-oferta" aria-labelledby="titulo-oferta">
          <div className="oferta-card">
            <Foto
              className="oferta-foto"
              nome="01-capa-ceia-a-dois"
              largura={1440}
              altura={810}
              sizes="(min-width: 760px) 680px, 100vw"
              alt="Mesa de ceia a dois com ave assada, taças de espumante e velas acesas"
            />
            <div className="oferta-corpo">
              <p className="kicker">Oferta</p>
              <h2 id="titulo-oferta">{OFERTA.produto}</h2>
              <ul className="inclui">
                <li>4 cardápios completos: 2 de Natal e 2 de Réveillon</li>
                <li>Entrada, prato principal e sobremesa em cada um</li>
                <li>Porções para duas pessoas</li>
                <li>Lista de compras por cardápio</li>
                <li>Ordem de preparo de cada ceia</li>
                <li>Material digital em PDF</li>
              </ul>

              <div className="preco">
                <span className="preco-valor">{preco}</span>
                <span className="preco-nota">pagamento único</span>
              </div>

              {checkout ? (
                <a className="cta" href={checkout}>
                  Quero minha Ceia a Dois
                </a>
              ) : (
                <>
                  <button type="button" className="cta" disabled aria-describedby="status-oferta">
                    Quero minha Ceia a Dois
                  </button>
                  <p id="status-oferta" className="status-oferta" role="status">
                    As vendas ainda não abriram. O botão será liberado assim que o pagamento estiver disponível.
                  </p>
                </>
              )}

              <dl className="oferta-detalhes">
                <div>
                  <dt>Formato</dt>
                  <dd>Digital (PDF), sem envio físico</dd>
                </div>
                {entrega && (
                  <div>
                    <dt>Entrega</dt>
                    <dd>{entrega}</dd>
                  </div>
                )}
                {suporte && (
                  <div>
                    <dt>Suporte</dt>
                    <dd>
                      <a href={suporte.href}>{suporte.texto}</a>
                    </dd>
                  </div>
                )}
              </dl>

              {temGarantia && (
                <div className="garantia">
                  <strong>Garantia de {garantiaDias} dias</strong>
                  <p>{textoGarantia}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section id="duvidas" className="secao secao-marfim" aria-labelledby="titulo-faq">
          <div className="largura estreita">
            <p className="kicker">Dúvidas frequentes</p>
            <h2 id="titulo-faq">Perguntas sobre a Ceia a Dois</h2>
            <div className="faq">
              {perguntas.map((p, i) => (
                <ItemFaq key={p.pergunta} {...p} aberto={abertos.has(i)} alternar={() => alternar(i)} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="rodape">
        <strong>{OFERTA.produto}</strong>
        {OFERTA.responsavel.trim() && <span>{OFERTA.responsavel}</span>}
        {suporte && (
          <span>
            Suporte: <a href={suporte.href}>{suporte.texto}</a>
          </span>
        )}
        <small>Fotos meramente ilustrativas. © {new Date().getFullYear()} Todos os direitos reservados.</small>
      </footer>
    </div>
  );
}
