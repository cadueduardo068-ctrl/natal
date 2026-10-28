import {
  BookOpen,
  Check,
  ChefHat,
  ChevronDown,
  ClipboardList,
  FileText,
  Heart,
  LockKeyholeOpen,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { m } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import type { SiteConfig } from "../config";
import { PurchaseLink } from "./PurchaseLink";
import { EbookPreview } from "./EbookPreview";
type Props = {
  config: SiteConfig;
  checkoutUrl: string;
  onPurchase: (placement: string) => void;
  price: string;
  feeNote: ReactNode;
  firstOfferRef: RefObject<HTMLDivElement | null>;
  faqs: string[][];
};
function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function SalesContent({
  config: c,
  checkoutUrl,
  onPurchase,
  price,
  feeNote,
  firstOfferRef,
  faqs,
}: Props) {
  const purchase = { href: checkoutUrl, onPurchase };
  return (
    <main id="conteudo">
      <section id="inicio" className="hero container">
        <div className="hero-badge">
          <ChefHat size={16} />
          <span>SEU NATAL COM MAIS SABOR</span>
        </div>
        <h1>
          Sabores <span>de Natal</span>
        </h1>
        <div className="title-underline" aria-hidden="true" />
        <p className="hero-subtitle">
          Uma ceia especial começa com
          <br className="mobile-break" /> boas receitas.
        </p>
        <div className="cyan-rule" aria-hidden="true" />
        <p className="hero-description">
          Sem ideias para o cardápio de Natal? Reúna os sabores da festa em um
          só lugar e escolha o que preparar para quem você ama.
        </p>
        <p className="hero-promise">
          <strong>
            {c.recipeCount} receitas + lista de compras + sugestões de
            cardápios.
          </strong>
          <span>Tudo em um e-book digital para consultar no seu ritmo.</span>
        </p>
        <div
          className="product-showcase"
          aria-label="Apresentação do e-book Sabores de Natal"
        >
          <div className="showcase-orbit" aria-hidden="true" />
          <div className="showcase-food food-left">
            <img
              src={c.categories[0]?.image}
              alt=""
              width="650"
              height="430"
              loading="lazy"
            />
            <span>Pratos salgados</span>
          </div>
          <figure className="product-mockup">
            <img
              className="hero-product"
              src={c.coverImage}
              srcSet={c.productImageSrcSet}
              sizes="(max-width:600px) 57vw, 270px"
              width="1145"
              height="1374"
              fetchPriority="high"
              alt="Imagem oficial do e-book Sabores de Natal, com receitas e apresentação do produto"
            />
          </figure>
          <div className="showcase-food food-right">
            <img
              src={c.categories[2]?.image}
              alt=""
              width="650"
              height="430"
              loading="lazy"
            />
            <span>Sobremesas</span>
          </div>
          <div className="showcase-label label-recipes">
            <BookOpen size={18} />
            <span>
              <b>{c.recipeCount} receitas</b>
              <small>para sua ceia</small>
            </span>
          </div>
          <div className="showcase-label label-digital">
            <Smartphone size={18} />
            <span>
              <b>100% digital</b>
              <small>formato PDF</small>
            </span>
          </div>
        </div>
        <div className="first-offer" ref={firstOfferRef}>
          <PurchaseLink {...purchase} placement="hero">
            <LockKeyholeOpen size={20} /> QUERO ACESSO IMEDIATO
          </PurchaseLink>
          <div className="hero-offer">
            <span>Seu e-book por apenas</span>
            <strong>{price}</strong>
            <small>pagamento único</small>
          </div>
          {feeNote}
          <p className="access-note">
            <FileText size={14} /> Produto digital. Acesso após a confirmação do
            pagamento.
          </p>
        </div>
      </section>
      <section className="receive-section section container" id="receitas">
        <SectionHeading
          label="O QUE VOCÊ VAI RECEBER"
          title={
            <>
              Do prato principal
              <br className="mobile-break" /> à <em>sobremesa.</em>
            </>
          }
          text="Receitas para compor sua ceia, com ingredientes e modo de preparo passo a passo."
        />
        <div className="category-grid">
          {c.categories.map((cat) => (
            <m.article
              className="category-card"
              key={cat.name}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <div className="category-image">
                <img
                  src={cat.image}
                  alt={`${cat.name}: imagem de divulgação do produto`}
                  width="650"
                  height="430"
                  loading="lazy"
                />
              </div>
              <div className="category-text">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <small>{cat.examples.join(" · ")}</small>
              </div>
            </m.article>
          ))}
        </div>
        <div className="included-grid">
          {[
            [ClipboardList, "Lista de compras", "Organize os ingredientes."],
            [
              BookOpen,
              "Sugestões de cardápios",
              "Combine os sabores da noite.",
            ],
            [ChefHat, "Dicas de organização", "Planeje o preparo da ceia."],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof BookOpen;
            return (
              <div className="included-item" key={String(title)}>
                <I size={22} />
                <span>
                  <b>{String(title)}</b>
                  <small>{String(text)}</small>
                </span>
              </div>
            );
          })}
        </div>
      </section>
      {c.previewPages.length > 0 && (
        <div className="sample-section container">
          <EbookPreview
            pages={c.previewPages}
            productImage={c.coverImage}
            srcSet={c.productImageSrcSet}
          />
        </div>
      )}
      <section className="audience-section">
        <div className="container audience-inner">
          <div>
            <span className="eyebrow">PARA QUEM É</span>
            <h2>
              Para quem quer celebrar
              <br />
              com <em>carinho e sabor.</em>
            </h2>
            <p>
              Não precisa reinventar o Natal.
              <br />
              Uma boa ideia de receita já é um começo.
            </p>
          </div>
          <ul>
            {[
              "Quer sair da dúvida sobre o que servir na ceia.",
              "Gosta de cozinhar e procura novas ideias para o Natal.",
              "Prefere ter receitas e orientações reunidas em um material.",
            ].map((t) => (
              <li key={t}>
                <Check size={19} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="how-section section container" id="como-funciona">
        <SectionHeading
          label="COMO FUNCIONA"
          title={
            <>
              Da compra à cozinha.
              <br className="mobile-break" /> <em>Simples assim.</em>
            </>
          }
        />
        <div className="steps-grid">
          {[
            [
              "01",
              "Realize a compra",
              "Escolha a forma de pagamento no checkout da Cakto.",
            ],
            [
              "02",
              "Receba o acesso digital",
              "Após a confirmação do pagamento, siga as instruções enviadas pela plataforma.",
            ],
            [
              "03",
              "Escolha e prepare",
              "Abra seu PDF, escolha as receitas e consulte o passo a passo.",
            ],
          ].map(([number, title, text]) => (
            <article className="step" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="offer-section section" id="oferta">
        <div className="container">
          <div className="offer-card">
            <span className="offer-badge">
              <Sparkles size={15} /> SUA CEIA COMEÇA AQUI
            </span>
            <h2>
              Leve mais sabor
              <br />
              para o seu <em>Natal.</em>
            </h2>
            <p className="offer-subtitle">
              E-book {c.productName} · {c.recipeCount} receitas em PDF
            </p>
            <ul className="offer-checks">
              {[
                "Pratos salgados, acompanhamentos e sobremesas",
                "Ingredientes e preparo passo a passo",
                "Lista de compras e sugestões de cardápios",
                "Dicas para organizar sua ceia",
              ].map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="offer-price">
              <span>TUDO EM UM ÚNICO MATERIAL</span>
              <strong>{price}</strong>
              <small>pagamento único · sem mensalidade</small>
            </div>
            {feeNote}
            <PurchaseLink {...purchase} placement="offer">
              <LockKeyholeOpen size={20} /> QUERO ACESSO IMEDIATO
            </PurchaseLink>
            <p className="payment-note">Pagamento no checkout da Cakto.</p>
            <div className="payment-methods">
              <span>Pix</span>
              <i />
              <span>Cartão de crédito</span>
              <i />
              <span>PicPay</span>
            </div>
            <div className="offer-format">
              <Smartphone size={16} /> Consulte em dispositivos compatíveis com
              PDF.
            </div>
          </div>
        </div>
      </section>
      <section className="faq-section section container" id="duvidas">
        <SectionHeading
          label="PERGUNTAS FREQUENTES"
          title={
            <>
              Antes de começar,
              <br className="mobile-break" /> <em>tire suas dúvidas.</em>
            </>
          }
        />
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
                {q === "Posso pedir reembolso?" && (
                  <a href={c.refundUrl || checkoutUrl}>
                    Consultar política da Cakto <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="final-cta section container">
        <div className="final-icon">
          <Heart size={25} />
        </div>
        <h2>
          O próximo Natal tem
          <br />
          um ingrediente especial: <em>você.</em>
        </h2>
        <p>Escolha suas receitas e prepare uma ceia para compartilhar.</p>
        <PurchaseLink {...purchase} placement="final">
          <LockKeyholeOpen size={20} /> QUERO ACESSO IMEDIATO
        </PurchaseLink>
        <small>Acesso digital após a confirmação do pagamento.</small>
      </section>
      <div className="trust-section container">
        <p>
          {c.contactName && (
            <>
              Vendedor: <b>{c.contactName}</b> ·{" "}
            </>
          )}
          Pagamento pela Cakto.
        </p>
        <div>
          {c.supportEmail && <a href={`mailto:${c.supportEmail}`}>Suporte</a>}
          <a href={c.termsUrl || checkoutUrl}>Termos de compra</a>
          <a href={c.refundUrl || checkoutUrl}>Reembolso</a>
        </div>
      </div>
    </main>
  );
}
