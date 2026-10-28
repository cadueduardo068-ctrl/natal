import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { ArrowUpRight, TreePine, X } from "lucide-react";
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
import { SalesContent } from "./components/SalesContent";

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
        <div className="top-announcement">
          <span>✨ OFERTA ESPECIAL — ACESSO IMEDIATO</span>
          <small>Após a confirmação do pagamento</small>
        </div>
        <header className="site-header">
          <div className="container header-inner">
            <Brand />
            <span className="header-note">17 receitas em PDF</span>
          </div>
        </header>
        <SalesContent
          config={c}
          checkoutUrl={CHECKOUT_URL}
          onPurchase={onPurchase}
          price={price}
          feeNote={feeNote}
          firstOfferRef={firstOffer}
          faqs={faqs}
        />
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
