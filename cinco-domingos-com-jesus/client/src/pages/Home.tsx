import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, Download, HeartHandshake, Mail, MessageCircle, Printer, Scissors, X } from "lucide-react";
import {
  OFFER,
  canSell,
  formatPrice,
  sampleAvailable,
  showPrice,
  supportContact,
} from "@shared/offer";
import { ENCOUNTERS, HOW_IT_WORKS, IMAGES, KIT_ITEMS, type SiteImage } from "@/content/landing";

type OpenImage = (image: SiteImage) => void;

/** Imagem com dimensões fixas (sem deslocamento de layout) e selo de prévia ilustrativa. */
function Figure({
  image,
  className = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, 640px",
  onOpen,
}: {
  image: SiteImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onOpen?: OpenImage;
}) {
  const picture = (
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      // React 19 aceita fetchPriority em minúsculas no DOM.
      fetchPriority={priority ? "high" : "auto"}
    />
  );
  return (
    <figure className={`photo ${className}`}>
      {onOpen ? (
        <button type="button" className="photo-zoom" onClick={() => onOpen(image)} aria-label="Ampliar imagem">
          {picture}
        </button>
      ) : (
        picture
      )}
      {OFFER.imagesAreIllustrative && <figcaption className="preview-tag">Prévia ilustrativa</figcaption>}
    </figure>
  );
}

function FullScreenImage({ image, onClose }: { image: SiteImage; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Imagem ampliada" onClick={onClose}>
      <button type="button" aria-label="Fechar imagem" className="lightbox-close" onClick={onClose} autoFocus>
        <X size={26} />
      </button>
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#topo">
          <span className="brand-star" aria-hidden="true">✦</span>
          {OFFER.name}
        </a>
        <a className="header-link" href="#oferta">Quero os 5 encontros</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="topo" className="hero" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{OFFER.name}</p>
          <h1 id="hero-title">Monte um presépio com seu filho em 5 domingos e descubram juntos a história do primeiro Natal.</h1>
          <p className="hero-sub">
            Em cerca de 15 minutos por encontro, vocês leem uma história, fazem uma atividade e acrescentam uma nova peça ao presépio de papel.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#oferta">Quero os 5 encontros</a>
            <a className="btn btn-secondary" href="#amostra">Baixar o primeiro domingo grátis</a>
          </div>
          <p className="hero-note">Kit digital em PDF · para crianças de 5 a 9 anos · para imprimir em casa</p>
        </div>
        <Figure image={IMAGES.hero} className="hero-photo" priority sizes="(max-width: 899px) 100vw, 56vw" />
      </div>
    </section>
  );
}

function HowItWorks() {
  const icons = [Printer, BookOpen, Scissors];
  return (
    <section className="section how" aria-labelledby="how-title">
      <div className="shell how-grid">
        <Figure image={IMAGES.familia} className="how-photo" sizes="(max-width: 899px) 100vw, 50vw" />
        <div>
          <p className="eyebrow">Como funciona</p>
          <h2 id="how-title">Um encontro por semana, em três passos</h2>
          <ol className="steps">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = icons[index];
              return (
                <li key={step.title}>
                  <span className="step-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
                  <div>
                    <h3><span className="step-number">{index + 1}.</span> {step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Encounters({ onOpen }: { onOpen: OpenImage }) {
  return (
    <section id="encontros" className="section encounters" aria-labelledby="encounters-title">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Os cinco encontros</p>
          <h2 id="encounters-title">A cada domingo, uma parte da história e uma nova peça no presépio</h2>
          <p>Também dá para fazer em cinco dias seguidos ou no ritmo da família.</p>
        </div>
        <ol className="timeline">
          {ENCOUNTERS.map((encounter) => (
            <li className="encounter" key={encounter.number}>
              <div className="encounter-marker" aria-hidden="true">{encounter.number}</div>
              <article className="encounter-card" aria-labelledby={`encounter-${encounter.number}`}>
                <Figure image={encounter.image} className="encounter-photo" onOpen={onOpen} sizes="(max-width: 899px) 100vw, 520px" />
                <div className="encounter-body">
                  <p className="encounter-kicker">Domingo {encounter.number}</p>
                  <h3 id={`encounter-${encounter.number}`}>{encounter.title}</h3>
                  <p className="encounter-story">{encounter.story}</p>
                  <p className="encounter-meta">
                    <span className="piece"><strong>Nova peça:</strong> {encounter.piece}</span>
                    <span className="reference">{encounter.reference}</span>
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
        <p className="timeline-note">
          <strong>Por que a manjedoura chega por último?</strong> É uma escolha de montagem: guardamos o Menino Jesus para o encerramento.
          Na história, os pastores recebem a notícia depois que Jesus nasce.
        </p>
      </div>
    </section>
  );
}

function KitContents({ onOpen }: { onOpen: OpenImage }) {
  return (
    <section id="kit" className="section kit" aria-labelledby="kit-title">
      <div className="shell kit-grid">
        <div>
          <p className="eyebrow">O que vem no kit</p>
          <h2 id="kit-title">Leia, converse e monte em família</h2>
          <ul className="kit-list">
            {KIT_ITEMS.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="digital-note"><Printer size={18} aria-hidden="true" /> Kit digital para imprimir em casa</p>
        </div>
        <Figure image={IMAGES.kit} className="kit-photo" onOpen={onOpen} sizes="(max-width: 899px) 100vw, 50vw" />
      </div>
    </section>
  );
}

function SampleSection() {
  const available = sampleAvailable();
  return (
    <section id="amostra" className="section sample" aria-labelledby="sample-title">
      <div className="shell sample-card">
        <Figure image={IMAGES.amostra} className="sample-photo" sizes="(max-width: 899px) 100vw, 50vw" />
        <div className="sample-copy">
          <p className="eyebrow">Amostra grátis</p>
          <h2 id="sample-title">Comece com a visita do anjo a Maria</h2>
          <p>Baixe o primeiro encontro, com as peças de Maria e do anjo, e veja como ele funciona na sua casa antes de levar o kit completo.</p>
          {available ? (
            <a className="btn btn-primary" href={OFFER.sample.pdfUrl.trim()} download>
              <Download size={18} aria-hidden="true" /> Baixar o primeiro domingo grátis
            </a>
          ) : (
            <>
              <button type="button" className="btn btn-primary" disabled aria-describedby="sample-status">
                <Download size={18} aria-hidden="true" /> Baixar o primeiro domingo grátis
              </button>
              <p id="sample-status" className="status-note">A amostra gratuita estará disponível para download em breve.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function OfferSection() {
  const priceVisible = showPrice();
  const sellable = canSell();
  return (
    <section id="oferta" className="section offer" aria-labelledby="offer-title">
      <div className="shell offer-card">
        <Figure image={IMAGES.hero} className="offer-photo" sizes="(max-width: 899px) 100vw, 50vw" />
        <div className="offer-copy">
          <p className="eyebrow">{OFFER.name}</p>
          <h2 id="offer-title">Tudo para os cinco encontros</h2>
          <ul className="check-list">
            <li>5 histórias do primeiro Natal para ler com a criança</li>
            <li>Orientação para os responsáveis conduzirem cada encontro</li>
            <li>5 atividades infantis, uma por encontro</li>
            <li>Peças do presépio de papel para recortar e montar: Maria, o anjo, José, a base, a estrela, os pastores, as ovelhas e Jesus na manjedoura</li>
          </ul>
          <p className="digital-note"><Printer size={18} aria-hidden="true" /> Kit digital para imprimir em casa</p>
          {priceVisible && (
            <p className="price">
              <span className="price-value">{formatPrice(OFFER.price.amountCents)}</span>
              <span className="price-note">pagamento único</span>
            </p>
          )}
          {sellable ? (
            <a className="btn btn-primary btn-block" href={OFFER.checkout.url.trim()}>Quero os 5 encontros</a>
          ) : (
            <p className="status-note status-box" role="status">As vendas abrem em breve. Enquanto isso, conheça o primeiro domingo na amostra grátis.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function SupportLinks() {
  const { email, whatsappUrl } = supportContact();
  if (!email && !whatsappUrl) {
    return <span className="status-note">O canal de suporte desta oferta está em configuração.</span>;
  }
  return (
    <span className="support-links">
      {email && <a href={`mailto:${email}`}><Mail size={16} aria-hidden="true" /> {email}</a>}
      {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>}
    </span>
  );
}

function Faq() {
  const delivery = OFFER.deliveryNote.trim();
  const faqs: { q: string; a: ReactNode }[] = [
    {
      q: "Em que formato vem o material?",
      a: "O kit é digital, em arquivos PDF. Você imprime em casa, numa impressora comum, só os encontros que for usar. Nenhum item físico é enviado.",
    },
    {
      q: "Para qual idade é indicado?",
      a: "A faixa sugerida é de 5 a 9 anos. Crianças menores podem participar com mais ajuda do adulto, e as maiores costumam ler sozinhas trechos da história.",
    },
    {
      q: "Que materiais preciso para montar?",
      a: "Papel, impressora, tesoura sem ponta e lápis de cor. Papel um pouco mais grosso deixa as peças mais firmes em pé. O adulto acompanha o recorte o tempo todo.",
    },
    {
      q: "Preciso começar num domingo específico?",
      a: "Não. Os encontros foram pensados para os cinco domingos antes do Natal, mas podem ser feitos em cinco dias seguidos ou quando a família puder.",
    },
    {
      q: "Como vou receber os arquivos?",
      a: delivery || <span className="status-note">As informações de entrega serão publicadas aqui quando o pagamento estiver configurado.</span>,
    },
    {
      q: "Como falo com o suporte?",
      a: <SupportLinks />,
    },
  ];
  return (
    <section id="perguntas" className="section faq" aria-labelledby="faq-title">
      <div className="shell faq-inner">
        <p className="eyebrow">Perguntas frequentes</p>
        <h2 id="faq-title">Dúvidas sobre o kit</h2>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <div className="faq-answer">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button type="button" className="scroll-top" aria-label="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      ↑
    </button>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState<SiteImage | null>(null);

  return (
    <>
      <SiteHeader />
      <main className="site-page">
        <Hero />
        <HowItWorks />
        <Encounters onOpen={setLightbox} />
        <KitContents onOpen={setLightbox} />
        <SampleSection />
        <OfferSection />
        <Faq />
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <p className="footer-brand"><HeartHandshake size={18} aria-hidden="true" /> {OFFER.name}</p>
          <p>Kit digital em PDF para pais e responsáveis viverem o Advento com as crianças.</p>
          {OFFER.imagesAreIllustrative && <p className="footer-small">As imagens desta página são prévias ilustrativas do material.</p>}
          <p className="footer-small"><SupportLinks /></p>
        </div>
      </footer>
      <ScrollTop />
      {lightbox && <FullScreenImage image={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
