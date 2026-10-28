import { useEffect, useRef, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, m, MotionConfig } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChefHat,
  ChevronDown,
  FileText,
  Heart,
  LayoutList,
  MonitorSmartphone,
  TreePine,
  X,
} from "lucide-react";
import { formatPrice, getCheckoutUrl, type SiteConfig } from "./config";
import {
  enableAnalytics,
  readConsent,
  revokeAnalytics,
  saveConsent,
  trackCta,
  validPixel,
  type Consent,
} from "./analytics";
import { PurchaseLink } from "./components/PurchaseLink";
import { EbookPreview } from "./components/EbookPreview";

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </m.div>
  );
}
function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Sabores de Natal — início">
      <TreePine size={26} strokeWidth={1.4} />
      <span>
        Sabores <em>de Natal</em>
      </span>
    </a>
  );
}
export function App({ config: c }: { config: SiteConfig }) {
  const CHECKOUT_URL = getCheckoutUrl(c.checkoutUrl);
  const [consent, setConsent] = useState<Consent>(null),
    [consentReady, setConsentReady] = useState(false),
    [sticky, setSticky] = useState(false),
    [privacy, setPrivacy] = useState(false);
  const firstOffer = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    lastFocus = useRef<HTMLElement | null>(null);
  const price = formatPrice(c.price),
    hasPixel = validPixel(c.metaPixelId);
  const fee = c.checkoutServiceFee || 0;
  const total = formatPrice(c.price + fee);
  const feeNote =
    fee > 0 ? (
      <p className="fee-note">
        Na Cakto: + {formatPrice(fee)} de taxa de serviço.{" "}
        <strong>Total à vista: {total}.</strong>
      </p>
    ) : null;
  useEffect(() => {
    setConsent(readConsent());
    setConsentReady(true);
  }, []);
  useEffect(() => {
    if (consent === "accepted") enableAnalytics(c.metaPixelId);
    else revokeAnalytics();
  }, [consent, c.metaPixelId]);
  useEffect(() => {
    const node = firstOffer.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setSticky(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (privacy) {
      lastFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      lastFocus.current?.focus();
    }
  }, [privacy]);
  function choose(value: Exclude<Consent, null>) {
    saveConsent(value);
    setConsent(value);
  }
  function onPurchase(placement: string) {
    trackCta(consent, c.metaPixelId, placement, c.productName, c.price);
  }
  const buyProps = { href: CHECKOUT_URL, onPurchase };
  const faqs = [
    [
      "O produto é físico ou digital?",
      `É um e-book digital em PDF com ${c.recipeCount} receitas natalinas. Não há envio de livro físico.`,
    ],
    ["Como vou receber meu e-book?", c.deliveryText],
    [
      "Posso acessar pelo celular?",
      "Sim. Você pode consultar o PDF no celular, tablet ou computador com um leitor de PDF compatível.",
    ],
    [
      "Quais receitas estão incluídas?",
      "São pratos salgados, acompanhamentos e sobremesas. Entre as receitas informadas na descrição do produto estão lombo assado com molho de laranja, frango assado com ervas, salpicão de frango, arroz à grega, pavê de chocolate, pudim de leite condensado, rabanada tradicional e torta gelada de limão.",
    ],
    [
      "Como funciona o pagamento?",
      "Você segue diretamente para o checkout da Cakto. Pix e cartão de crédito estão configurados para este produto. PicPay, Google Pay e Apple Pay podem aparecer conforme o dispositivo e a elegibilidade. Confira o total e as condições antes de confirmar o pagamento.",
    ],
    [
      "Posso pedir reembolso?",
      c.refundText ||
        "Consulte a política de reembolso e os termos apresentados no checkout antes de concluir a compra. Para uma compra já realizada, use as orientações e os canais de atendimento da confirmação do pedido.",
    ],
  ];
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Brand />
            <a className="header-link" href="#oferta">
              Conheça o e-book <ArrowUpRight size={15} />
            </a>
          </div>
        </header>
        <main id="conteudo">
          <section id="inicio" className="hero">
            <div className="container hero-grid">
              <div className="hero-copy">
                <span className="eyebrow hero-badge">
                  <span /> ESPECIAL DE NATAL <i /> LIVRO DIGITAL DE RECEITAS
                </span>
                <h1>
                  Transforme sua
                  <br className="desktop-br" /> ceia de Natal em
                  <br className="desktop-br" /> um momento
                  <br className="mobile-br" /> <em>inesquecível.</em>
                </h1>
                <p className="hero-description">
                  Receitas deliciosas para preparar uma ceia especial, com
                  pratos salgados e sobremesas que vão deixar sua mesa ainda
                  mais bonita e saborosa.
                </p>
                <div className="mobile-food">
                  <img
                    src={c.images.heroMobile}
                    width="1000"
                    height="349"
                    fetchPriority="high"
                    alt="Pratos natalinos na imagem de divulgação do Sabores de Natal"
                  />
                </div>
                <div className="first-offer" ref={firstOffer}>
                  <div className="hero-offer">
                    <div>
                      <span>E-BOOK DIGITAL DE RECEITAS NATALINAS</span>
                      <strong>{price}</strong>
                    </div>
                    <p>
                      {c.recipeCount} receitas
                      <br />
                      <b>Pagamento único</b>
                    </p>
                  </div>
                  {feeNote}
                  <PurchaseLink {...buyProps} placement="hero" />
                  <p className="access-note">
                    Produto digital · Receba as instruções de acesso após a
                    compra
                  </p>
                </div>
                <div className="hero-assurance">
                  <BookOpen size={16} />
                  <span>
                    Passo a passo, lista de compras e ideias de cardápios.
                  </span>
                </div>
              </div>
              <div className="hero-art">
                <div className="hero-art-label">
                  <span>RECEITAS, AFETO & BOAS MEMÓRIAS</span>
                  <TreePine size={21} strokeWidth={1} />
                </div>
                <img
                  className="hero-product"
                  src={c.images.hero}
                  srcSet={c.productImageSrcSet}
                  sizes="(max-width:700px) 0px, (max-width:1000px) 40vw, 500px"
                  width="1145"
                  height="1374"
                  fetchPriority="high"
                  alt="Apresentação oficial do e-book Sabores de Natal, com pratos salgados e sobremesas"
                />
                <div className="art-caption">
                  <span>Sabores para compartilhar.</span>
                  <small>IMAGEM DE DIVULGAÇÃO DO PRODUTO</small>
                </div>
              </div>
            </div>
          </section>
          <div className="product-strip">
            <div className="container">
              <span>
                <BookOpen size={17} /> {c.recipeCount} receitas natalinas
              </span>
              <span>
                <FileText size={17} /> E-book em PDF
              </span>
              <span>
                <MonitorSmartphone size={17} /> No celular, tablet ou computador
              </span>
            </div>
          </div>
          <section
            className="categories-section section container"
            id="receitas"
          >
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">
                  DO PRIMEIRO PRATO À ÚLTIMA COLHERADA
                </span>
                <h2>
                  Tudo para preparar uma
                  <br /> ceia de Natal <em>deliciosa.</em>
                </h2>
              </div>
              <p>
                Escolha os sabores da sua noite.
                <br />O e-book reúne receitas para cada
                <br className="desktop-br" /> momento da comemoração.
              </p>
            </Reveal>
            <div className="category-grid">
              {c.categories.map((cat, i) => (
                <Reveal key={cat.name}>
                  <article className="category-card">
                    {cat.image && (
                      <div className="category-image">
                        <img
                          src={cat.image}
                          alt={`${cat.name}: detalhe da imagem de divulgação do produto`}
                          width="650"
                          height="430"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="category-text">
                      <span className="category-number">0{i + 1}</span>
                      <h3>{cat.name}</h3>
                      <p>{cat.description}</p>
                      <div className="recipe-examples">
                        {cat.examples.join(" · ")}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="source-caption">
              Imagens extraídas da divulgação do produto. Exemplos confirmados
              na descrição da Cakto.
            </p>
          </section>
          <div className="preview-wrap">
            <div className="container">
              <EbookPreview
                pages={c.previewPages}
                productImage={c.coverImage}
                srcSet={c.productImageSrcSet}
              />
            </div>
          </div>
          <section className="benefits-section section container">
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">MAIS IDEIAS. MAIS TEMPO À MESA.</span>
                <h2>
                  Seu Natal merece
                  <br />
                  uma mesa <em>especial.</em>
                </h2>
              </div>
              <p>
                Um material para acompanhar você
                <br />
                na escolha e no preparo da sua ceia.
              </p>
            </Reveal>
            <div className="benefit-grid">
              {[
                [
                  LayoutList,
                  "Receitas organizadas",
                  "Encontre as opções do material de maneira simples.",
                ],
                [
                  ChefHat,
                  "Preparo explicado",
                  "Siga as instruções das receitas no seu ritmo.",
                ],
                [
                  Heart,
                  "Ideias para sua ceia",
                  "Inspiração para pratos e sobremesas natalinas.",
                ],
                [
                  BookOpen,
                  "Tudo em um só lugar",
                  "Consulte o material digital quando precisar.",
                ],
              ].map(([Icon, title, description]) => {
                const I = Icon as typeof BookOpen;
                return (
                  <Reveal key={String(title)}>
                    <div className="benefit">
                      <I size={26} strokeWidth={1.4} />
                      <h3>{String(title)}</h3>
                      <p>{String(description)}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
          <section className="editorial">
            <div className="editorial-image">
              <img
                src={c.images.editorial}
                width="1200"
                height="800"
                alt="Composição editorial de uma mesa preparada para o Natal, com pratos, velas e guardanapos vinho"
                loading="lazy"
              />
              <span>COMPOSIÇÃO EDITORIAL ILUSTRATIVA</span>
            </div>
            <div className="editorial-copy">
              <Reveal>
                <span className="eyebrow">O QUE FAZ O NATAL SER NATAL</span>
                <h2>
                  Os melhores momentos acontecem
                  <br />
                  <em>ao redor da mesa.</em>
                </h2>
                <p>
                  Mais do que preparar pratos deliciosos, o Natal é uma
                  oportunidade de reunir pessoas especiais e compartilhar bons
                  momentos. Com novas ideias de receitas, você pode planejar uma
                  ceia cheia de carinho e sabor.
                </p>
                <PurchaseLink
                  {...buyProps}
                  placement="editorial"
                  className="purchase-outline"
                >
                  QUERO PREPARAR MINHA CEIA
                </PurchaseLink>
              </Reveal>
            </div>
          </section>
          <section className="offer-section section" id="oferta">
            <div className="container">
              <Reveal>
                <div className="offer-heading">
                  <span className="eyebrow">
                    UM CONVITE PARA COZINHAR COM CARINHO
                  </span>
                  <h2>
                    Prepare uma ceia especial
                    <br />
                    <em>neste Natal.</em>
                  </h2>
                </div>
                <div className="offer-card">
                  <div className="offer-image">
                    <img
                      src={c.coverImage}
                      srcSet={c.productImageSrcSet}
                      sizes="(max-width:700px) 160px, 370px"
                      width="1145"
                      height="1374"
                      alt="Imagem oficial de divulgação do e-book Sabores de Natal"
                      loading="lazy"
                    />
                    <span>PRODUTO 100% DIGITAL</span>
                  </div>
                  <div className="offer-content">
                    <span className="eyebrow">E-BOOK EM PDF</span>
                    <h3>{c.productName}</h3>
                    <p className="offer-subtitle">
                      {c.recipeCount} receitas para uma ceia especial.
                    </p>
                    <ul>
                      {[
                        "Pratos salgados, acompanhamentos e sobremesas",
                        "Ingredientes e modo de preparo passo a passo",
                        "Sugestões de cardápios e lista de compras",
                        "Dicas para planejar sua ceia",
                      ].map((t) => (
                        <li key={t}>
                          <Check size={17} />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="offer-price">
                      <span>LEVE SEU E-BOOK POR</span>
                      <strong>{price}</strong>
                      <small>pagamento único</small>
                    </div>
                    {feeNote}
                    <PurchaseLink {...buyProps} placement="offer">
                      SIM, QUERO MEU E-BOOK
                    </PurchaseLink>
                    <p className="payment-note">
                      Pagamento realizado no checkout da Cakto.
                    </p>
                    <div className="payment-methods">
                      <span>Pix</span>
                      <i /> <span>Cartão de crédito</span>
                      <small>Outras opções conforme o dispositivo.</small>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div className="purchase-facts">
                <div>
                  <BookOpen size={19} />
                  <p>
                    <strong>Formato digital</strong>Arquivo PDF. Nenhum item
                    físico será enviado.
                  </p>
                </div>
                <div>
                  <MonitorSmartphone size={20} />
                  <p>
                    <strong>Acesso após confirmação</strong>Instruções de acesso
                    enviadas pela plataforma.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="faq-section section container" id="duvidas">
            <Reveal>
              <span className="eyebrow">PARA COMPRAR COM CLAREZA</span>
              <h2>
                Ficou alguma
                <br />
                <em>dúvida?</em>
              </h2>
              <p>
                As informações que você precisa
                <br />
                antes de escolher suas receitas.
              </p>
              {c.supportEmail && (
                <a className="support-link" href={`mailto:${c.supportEmail}`}>
                  Fale com o suporte <ArrowUpRight size={15} />
                </a>
              )}
            </Reveal>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <details
                  className="faq-item"
                  key={q}
                  open={i === 0 ? true : undefined}
                >
                  <summary>
                    {q}
                    <ChevronDown size={18} />
                  </summary>
                  <div>
                    <p>{a}</p>
                    {q === "Como funciona o pagamento?" && (
                      <a href={CHECKOUT_URL}>
                        Consultar condições no checkout{" "}
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    {q === "Posso pedir reembolso?" && (
                      <a href={c.refundUrl || CHECKOUT_URL}>
                        Consultar condições da compra <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
          <section className="trust-section">
            <div className="container trust-inner">
              <div>
                <span className="eyebrow">INFORMAÇÕES DA COMPRA</span>
                <p>
                  Pagamento processado pela Cakto.
                  <br />
                  Confira o resumo do pedido e as condições antes de pagar.
                </p>
              </div>
              <div>
                {c.contactName && (
                  <p>
                    <b>Vendedor:</b> {c.contactName}
                  </p>
                )}
                {c.supportEmail && (
                  <a href={`mailto:${c.supportEmail}`}>{c.supportEmail}</a>
                )}
                <a href={c.termsUrl || CHECKOUT_URL}>
                  Termos de compra da Cakto <ArrowUpRight size={14} />
                </a>
                <a href={c.refundUrl || CHECKOUT_URL}>
                  Informações de reembolso <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer container">
          <div className="footer-main">
            <Brand />
            <p>
              Receitas para compartilhar.
              <br />
              Memórias para guardar.
            </p>
            <button className="privacy-link" onClick={() => setPrivacy(true)}>
              Privacidade e cookies
            </button>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {c.productName} · E-book digital.
            </span>
            <span>Feito para o seu Natal.</span>
          </div>
        </footer>
        <aside
          className={`sticky-offer ${sticky ? "is-visible" : ""}`}
          aria-label="Compra rápida"
          aria-hidden={!sticky}
          inert={!sticky}
        >
          <div>
            <span>
              {fee > 0 ? "Total à vista na Cakto" : "E-book Sabores de Natal"}
            </span>
            <strong>{fee > 0 ? total : price}</strong>
          </div>
          <PurchaseLink {...buyProps} placement="mobile-sticky" compact>
            QUERO AS RECEITAS
          </PurchaseLink>
        </aside>
        {hasPixel && consentReady && consent === null && (
          <aside
            className="consent-banner"
            aria-label="Preferências de cookies"
          >
            <p>
              Com sua autorização, usamos o Meta Pixel para medir visitas e
              cliques nos anúncios.
            </p>
            <div>
              <button onClick={() => choose("declined")}>Recusar</button>
              <button className="accept" onClick={() => choose("accepted")}>
                Aceitar
              </button>
              <button className="consent-more" onClick={() => setPrivacy(true)}>
                Saiba mais
              </button>
            </div>
          </aside>
        )}
        <dialog
          ref={dialog}
          className="privacy-dialog"
          aria-labelledby="privacy-title"
          onCancel={() => setPrivacy(false)}
          onClick={(e) => {
            if (e.target === dialog.current) setPrivacy(false);
          }}
        >
          <button
            className="dialog-close"
            aria-label="Fechar privacidade"
            onClick={() => setPrivacy(false)}
          >
            <X />
          </button>
          <span className="eyebrow">SABORES DE NATAL</span>
          <h2 id="privacy-title">
            Privacidade
            <br />
            <em>e suas escolhas.</em>
          </h2>
          <p>
            Esta página não solicita dados pessoais nem dados de pagamento. A
            compra acontece no checkout externo da Cakto, que apresenta suas
            próprias condições e informações de privacidade.
          </p>
          <p>
            Quando configurado e autorizado por você, o Meta Pixel mede uma
            visualização por carregamento e os cliques nos botões de compra. Um
            clique não é tratado como checkout iniciado ou compra confirmada. Os
            dados técnicos do navegador podem ser processados pela Meta.
          </p>
          <p>
            Sua preferência é salva apenas neste dispositivo. Se o navegador
            impedir o armazenamento, ela vale nesta visita. Você pode recusar ou
            revogar a medição a qualquer momento.
          </p>
          {c.supportEmail && (
            <p>
              Contato: <a href={`mailto:${c.supportEmail}`}>{c.supportEmail}</a>
            </p>
          )}
          {c.privacyUrl && (
            <a href={c.privacyUrl}>
              Política completa de privacidade <ArrowUpRight size={16} />
            </a>
          )}
          <div className="privacy-actions">
            <button
              onClick={() => {
                choose("declined");
                setPrivacy(false);
              }}
            >
              Recusar / revogar medição
            </button>
            {hasPixel && (
              <button
                onClick={() => {
                  choose("accepted");
                  setPrivacy(false);
                }}
              >
                Autorizar medição
              </button>
            )}
          </div>
        </dialog>
      </LazyMotion>
    </MotionConfig>
  );
}
