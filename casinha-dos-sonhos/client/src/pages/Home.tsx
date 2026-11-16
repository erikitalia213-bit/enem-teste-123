import { useEffect, useState, type ReactNode } from "react";

const CHECKOUT_URL = "https://pay.kiwify.com.br/7Q6S8Sr";
const IMG = "https://maribea.com.br/wp-content/uploads/2026/11/";

// Data/hora em que a oferta promocional termina. Troque pela data REAL da sua promoção
// (ex.: "2026-11-30T23:59:59-03:00"). Se deixar null, o contador conta até a meia-noite de hoje.
const PROMO_END: string | null = null;

/** Repassa UTMs e demais parâmetros da URL da página para o checkout (rastreio dos anúncios). */
function useCheckoutUrl() {
  const [url, setUrl] = useState(CHECKOUT_URL);
  useEffect(() => {
    const params = window.location.search;
    if (params) setUrl(CHECKOUT_URL + (CHECKOUT_URL.includes("?") ? "&" : "?") + params.slice(1));
  }, []);
  return url;
}

function BuyButton({ children = "QUERO A CASINHA DOS SONHOS →", href }: { children?: ReactNode; href: string }) {
  return <a className="buy-button" href={href}>{children}</a>;
}

function useCountdown() {
  const getTarget = () => {
    if (PROMO_END) return new Date(PROMO_END).getTime();
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  };
  const [left, setLeft] = useState(() => Math.max(0, getTarget() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, getTarget() - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

const rooms = [
  ["QUARTO", "Caminha, guarda-roupa, criado-mudo, bolsinha, escovinha e paleta de maquiagem. Ela arruma o quarto do jeito que sonha o próprio quarto.", "MOCKUP-QUARTO.webp"],
  ["SALA", "Sofá, tapete, mesinha de centro, vasos de plantas, quadrinhos e até um gatinho dormindo. O cantinho da família.", "MOCKUP-SALA.webp"],
  ["BANHEIRO", "Banheira, pia, espelho, prateleira com shampoo e condicionador, toalha no cabide. Perfeito para brincar de \"hora do banho\" e ensinar rotina de higiene sem sermão.", "MOCKUP-BANHEIRO.webp"],
  ["VARANDA", "Rede, vasinho de flores, casinha de pet com gatinho e potinho de ração. O cômodo do cuidado e do descanso.", "MOCKUP-VARANDA-1.webp"],
  ["PISCINA", "Boia de flamingo, toalha listrada, óculos de coração, protetor solar e suquinho. O cenário favorito das tardes de brincadeira.", "MOCKUP-PISCINA.webp"],
  ["CLOSET", "Araras com vestidos, blusinhas e peças para montar looks. Aqui ela vira estilista da própria boneca.", "MOCKUP-CLOSET.webp"],
  ["DESPENSA", "Prateleiras com arroz, feijão, açúcar, farinha, macarrão, biscoito, molhos e conservas — cada item com seu rótulo escrito. É brincadeira e alfabetização ao mesmo tempo.", "MOCKUP-DISPENSA_.webp"],
  ["BONECAS PARA VESTIR", "Bonecas com roupas, acessórios e calçados para recortar e trocar quantas vezes ela quiser.", "MOCKUP-Bonecas.webp"],
];

const method = [
  ["M", "MOTRICIDADE FINA", "Recortar, dobrar, encaixar e posicionar peças pequenas fortalece exatamente os músculos da mão que ela vai usar para escrever."],
  ["O", "ORGANIZAÇÃO E LÓGICA", "Cada objeto pertence a um cômodo. Isso é categorização, a base do raciocínio lógico."],
  ["N", "NOMEAR E LER", "Os rótulos dos produtos e os objetos de cada cômodo ampliam o vocabulário e estimulam o reconhecimento de palavras."],
  ["T", "TOMAR DECISÕES", "Não existe “jeito certo” de montar. Ela precisa escolher, planejar e conviver com a própria escolha."],
  ["A", "AUTONOMIA E FAZ DE CONTA", "Ao encenar a rotina da casa, a criança organiza a própria rotina e desenvolve linguagem e empatia."],
];

const faqs = [
  ["Vem impresso? Chega em casa?", "Não. É um material digital: você recebe os arquivos na hora e imprime em casa ou em qualquer papelaria. Por isso o valor é tão acessível."],
  ["Como eu recebo?", "Assim que o pagamento é aprovado, o acesso chega no e-mail que você informou na compra. No Pix, é na hora. Se não encontrar, confira a caixa de spam e a aba Promoções."],
  ["Consigo baixar pelo celular?", "Sim. Você pode baixar pelo celular e mandar para a impressora, ou enviar o arquivo para uma papelaria pelo WhatsApp."],
  ["Preciso de impressora colorida?", "Ajuda, mas não é obrigatório. Você também recebe a versão para colorir, que fica linda impressa em preto e branco — e ainda vira mais uma atividade."],
  ["Que papel usar?", "Sulfite comum funciona. Se quiser mais durável, use papel 180g ou cole em papelão fino."],
  ["Qual a idade indicada?", "De 3 a 10 anos. Até 5 anos, a criança monta com ajuda de um adulto na hora de recortar."],
  ["Posso imprimir mais de uma vez?", "Sim, quantas vezes quiser. Estragou, molhou, chegou visita? É só imprimir de novo."],
  ["Quanto tempo tenho de acesso?", "Vitalício. Comprou, é seu."],
];

export default function Home() {
  const checkout = useCheckoutUrl();
  const countdown = useCountdown();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="landing">
      {/* 1. BARRA SUPERIOR PROMOCIONAL / TIMER */}
      <div className="promo-bar">
        <span>🎁 <b>OFERTA DE LANÇAMENTO:</b> de <s>R$ 97</s> por <b>R$ 29,90</b> + 2 bônus</span>
        <span className="timer">termina em <b>{countdown}</b></span>
      </div>

      {/* 2. HEADLINE + 3. SUBHEADLINE */}
      <section className="hero paper-grid">
        <div className="hero-copy">
          <p className="eyebrow">🧸 Kit digital imprimível · 3 a 10 anos</p>
          <h1>Em 20 minutos, sua filha troca o tablet por <em>uma casinha que ela mesma monta.</em></h1>
          <p className="subheadline">
            7 cômodos completos + bonecas para vestir para imprimir em casa, em papel sulfite, na impressora que você já tem.
            Sem espera, sem entrega e sem tela — e dá para imprimir de novo quantas vezes quiser.
          </p>
          <BuyButton href={checkout}>QUERO IMPRIMIR A CASINHA AGORA →</BuyButton>
          <div className="hero-badges">
            <span>⚡ Acesso imediato</span><span>🔒 Compra segura</span><span>🛡️ 7 dias de garantia</span>
          </div>
        </div>
        <img className="hero-mockup" src={`${IMG}mockup-principal-webp.webp`} alt="Mockup da Casinha dos Sonhos montada" />
      </section>

      {/* 4. ANTES E DEPOIS */}
      <section className="before-after section-pad">
        <div className="section-heading">
          <span className="section-kicker">Antes e depois</span>
          <h2>O que muda na sua casa <em>já na primeira tarde.</em></h2>
        </div>
        <div className="ba-grid">
          <div className="ba-card before">
            <h3>😩 ANTES</h3>
            <ul>
              <li>O tablet “só por 10 minutinhos” que vira uma hora</li>
              <li>Choro e briga na hora de tirar a tela</li>
              <li>“Mãe, tô entediada” o dia inteiro</li>
              <li>Brinquedo caro esquecido depois de 15 minutos</li>
              <li>Culpa por não ter energia para inventar brincadeira</li>
            </ul>
          </div>
          <div className="ba-arrow" aria-hidden>→</div>
          <div className="ba-card after">
            <h3>🥰 DEPOIS</h3>
            <ul>
              <li>Ela recorta, monta e decora a casinha com as próprias mãos</li>
              <li>Tardes inteiras de brincadeira longe da tela</li>
              <li>Inventa histórias, rotinas e personagens sozinha</li>
              <li>Um brinquedo que se renova: cada montagem é uma casa nova</li>
              <li>Você imprime de novo quando quiser, sem gastar mais nada</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. BENEFÍCIOS */}
      <section className="benefits-section section-pad">
        <div className="section-heading">
          <span className="section-kicker">Enquanto ela acha que está só brincando…</span>
          <h2>O cérebro dela está <em>trabalhando.</em></h2>
          <p>A Casinha dos Sonhos foi pensada em cima do <strong>Método M.O.N.T.A.</strong> — 5 frentes de desenvolvimento que acontecem naturalmente durante a brincadeira:</p>
        </div>
        <div className="method-grid">
          {method.map(([letter, title, text]) => (
            <article className="method-card" key={letter}><b>{letter}</b><div><h3>{title}</h3><p>{text}</p></div></article>
          ))}
        </div>
        <div className="practical">
          <span>🖨️<b>Impressora comum</b></span>
          <span>📄<b>Papel A4 sulfite</b></span>
          <span>🎨<b>Versão colorida e para colorir</b></span>
          <span>♾️<b>Imprime quantas vezes quiser</b></span>
        </div>
      </section>

      {/* 6. A CULPA NÃO É SUA */}
      <section className="story section-pad">
        <div className="story-card">
          <div>
            <span className="section-kicker">E não, a culpa não é sua</span>
            <h2>O tablet ocupa o tempo.<br /><em>A brincadeira constrói.</em></h2>
            <p>Você dá o tablet “só por 10 minutinhos” e, quando vê, se passou uma hora. Você tira o tablet e vem o choro. Vem o “mãe, tô entediada”. Vem a culpa.</p>
            <p>E aí você compra mais um brinquedo caro daqueles que ela abre, brinca por 15 minutos e nunca mais olha.</p>
            <p><strong>O problema não é sua filha. E não é você.</strong></p>
            <p>O problema é que quase nada hoje pede que a criança crie alguma coisa. Tudo já vem pronto, animado, respondido. Ela só assiste.</p>
            <p><strong>E criança que só assiste não desenvolve. Criança que monta desenvolve.</strong></p>
            <p>Foi por isso que nasceu a Casinha dos Sonhos: uma casinha inteira para ela <strong>inventar do jeito dela</strong>.</p>
          </div>
          <img src={`${IMG}MAE-PENSANDO-1.webp`} alt="Mãe pensando em uma brincadeira criativa" loading="lazy" />
        </div>
      </section>

      {/* 7. DEMONSTRATIVO DO MATERIAL */}
      <section className="rooms section-pad">
        <div className="section-heading">
          <span className="section-kicker">Por dentro do material</span>
          <h2>Um mundo inteiro em <em>folhas de papel.</em></h2>
          <p>Veja exatamente o que você vai imprimir. Cada ambiente abre uma nova história.</p>
        </div>
        <img className="demo-mockup" src={`${IMG}mockup-apresentacao-2-1024x810.webp`} alt="Apresentação de todos os ambientes da casinha" loading="lazy" />
        <div className="room-grid">
          {rooms.map(([title, text, image]) => (
            <article className="room-card" key={title}>
              <img src={`${IMG}${image}`} alt={`Ambiente ${title}`} loading="lazy" />
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <div className="specs">
          <p><b>Formato:</b> arquivo digital (PDF) em tamanho A4</p>
          <p><b>Você vai precisar de:</b> impressora, papel, tesoura sem ponta e cola</p>
          <p><b>Versões:</b> colorida e para colorir (preto e branco)</p>
        </div>
        <BuyButton href={checkout}>QUERO A CASINHA DOS SONHOS →</BuyButton>
      </section>

      {/* 8. PROVA SOCIAL — substitua os cartões abaixo por depoimentos e fotos REAIS de clientes */}
      <section className="social section-pad">
        <div className="section-heading">
          <span className="section-kicker">Quem já imprimiu</span>
          <h2>Mães que trocaram a tela <em>pela casinha.</em></h2>
        </div>
        <div className="social-grid">
          {[1, 2, 3].map(n => (
            <article className="social-card placeholder" key={n}>
              <div className="social-photo">📸 Foto ou print real da cliente {n}</div>
              <p>“Cole aqui o depoimento real da cliente — de preferência um print de WhatsApp ou uma foto da criança brincando com a casinha.”</p>
              <b>Nome da cliente · cidade</b>
            </article>
          ))}
        </div>
      </section>

      {/* 9. COMO A PESSOA VAI RECEBER */}
      <section className="delivery section-pad">
        <div className="section-heading">
          <span className="section-kicker">Simples assim</span>
          <h2>Como você recebe <em>a casinha.</em></h2>
        </div>
        <ol className="steps">
          <li><b>1</b><h3>Finalize a compra</h3><p>Pagamento seguro por Pix ou cartão, em menos de 1 minuto.</p></li>
          <li><b>2</b><h3>Receba no e-mail</h3><p>O acesso chega na hora no e-mail que você informou. (Confira também o spam.)</p></li>
          <li><b>3</b><h3>Baixe e imprima</h3><p>Imprima em casa ou na papelaria e comece a montar hoje mesmo.</p></li>
        </ol>
      </section>

      {/* 10. BÔNUS EXCLUSIVOS */}
      <section className="bonus section-pad">
        <div className="section-heading">
          <span className="section-kicker">Bônus exclusivos</span>
          <h2>Comprando hoje, você <em>também leva:</em></h2>
        </div>
        <div className="bonus-grid">
          <article className="bonus-card">
            <span className="bonus-tag">BÔNUS 1</span>
            <div className="bonus-icon">🃏</div>
            <h3>10 Baralhos de Alfabetização</h3>
            <p>Jogos imprimíveis para aprender letras, sílabas e palavras brincando — perfeitos para continuar a diversão depois da casinha.</p>
            <p className="bonus-value">Valor: <s>R$ 67,00</s> <b>GRÁTIS</b></p>
          </article>
          <article className="bonus-card">
            <span className="bonus-tag">BÔNUS 2</span>
            <div className="bonus-icon">📒</div>
            <h3>Caderno de Alfabetização Completo</h3>
            <p>Atividades para imprimir que reforçam a leitura e a escrita no ritmo da criança, sem pressão.</p>
            <p className="bonus-value">Valor: <s>R$ 97,00</s> <b>GRÁTIS</b></p>
          </article>
        </div>
      </section>

      {/* 11. PACOTE / OFERTA */}
      <section className="offer section-pad" id="oferta">
        <div className="offer-inner">
          <span className="section-kicker">Oferta especial</span>
          <h2>Tudo o que você recebe hoje:</h2>
          <div className="offer-list">
            <p><strong>✅ Casinha dos Sonhos</strong><span>7 cômodos + bonecas + roupas e acessórios <b>R$ 97,00</b></span></p>
            <p><strong>✅ Bônus 1</strong><span>10 Baralhos de Alfabetização <b>R$ 67,00</b></span></p>
            <p><strong>✅ Bônus 2</strong><span>Caderno de Alfabetização completo <b>R$ 97,00</b></span></p>
            <p><strong>✅ Acesso vitalício</strong><span>Imprima quantas vezes quiser <b>incluso</b></span></p>
          </div>
          <div className="total">Valor total <s>R$ 261,00</s></div>
          <div className="price"><small>HOJE POR APENAS:</small><strong>R$ 29,90</strong><span>pagamento único · sem mensalidade</span></div>
          <BuyButton href={checkout}>QUERO A CASINHA DOS SONHOS AGORA →</BuyButton>
          <p className="offer-timer">⏰ Preço promocional termina em <b>{countdown}</b></p>
        </div>
      </section>

      {/* 12. COMPRA SEGURA / GARANTIA */}
      <section className="guarantee section-pad">
        <div className="guarantee-inner">
          <img src={`${IMG}Selo-de-garantia-2.webp`} alt="Selo de garantia de 7 dias" loading="lazy" />
          <div>
            <span className="section-kicker">Compra segura e garantida</span>
            <h2>Você pode testar<br /><em>sem medo.</em></h2>
            <p><strong>7 dias de garantia incondicional.</strong></p>
            <p>Imprima, monte com sua filha, teste de verdade. Se em 7 dias você achar que não valeu, é só responder o e-mail da compra e devolvemos cada centavo. Sem pergunta, sem burocracia, sem constrangimento.</p>
            <div className="secure-badges">
              <span>🔒 Pagamento 100% seguro</span><span>⚡ Acesso imediato</span><span>💳 Pix ou cartão</span>
            </div>
          </div>
        </div>
      </section>

      <section className="faq section-pad">
        <div className="section-heading"><span className="section-kicker">FAQ</span><h2>Perguntas <em>frequentes</em></h2></div>
        <div className="faq-list">
          {faqs.map(([q, a], index) => {
            const open = openFaq === index;
            return (
              <div className={`faq-item ${open ? "open" : ""}`} key={q}>
                <button aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}><span>{q}</span><b>{open ? "−" : "+"}</b></button>
                {open && <p>{a}</p>}
              </div>
            );
          })}
        </div>
        <div className="faq-cta"><BuyButton href={checkout}>QUERO IMPRIMIR A CASINHA AGORA →</BuyButton></div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <h2>Casinha dos Sonhos</h2>
          <p>Kit Digital Imprimível</p>
          {/* Preencha com seus dados reais: e-mail/WhatsApp de suporte, CNPJ, termos e privacidade */}
          <p className="footer-info">Suporte: seu-email@dominio.com · CNPJ 00.000.000/0001-00</p>
          <small>© 2026 Casinha dos Sonhos. Todos os direitos reservados.</small>
        </div>
      </footer>

      {/* CTA fixo no celular */}
      <a className="sticky-cta" href={checkout}>QUERO A CASINHA · R$ 29,90 →</a>
    </main>
  );
}
