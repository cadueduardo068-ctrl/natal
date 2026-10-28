import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { PreviewPage } from "../config";
type Props = { pages: PreviewPage[]; productImage: string; srcSet?: string };
export function EbookPreview({ pages, productImage, srcSet }: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const next = Math.max(0, Math.min(pages.length - 1, index));
    const item = rail.current?.children[next] as HTMLElement | undefined;
    if (item && rail.current) {
      rail.current.scrollTo({
        left: item.offsetLeft - rail.current.offsetLeft,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      setActive(next);
    }
  }
  return (
    <section
      className="preview-section section"
      id="ebook"
      aria-labelledby="preview-heading"
    >
      <div className="preview-intro">
        <span className="eyebrow">CONHEÇA O SEU LIVRO DIGITAL</span>
        <h2 id="preview-heading">
          Dê uma olhadinha no que <em>espera por você.</em>
        </h2>
        <p>
          Do prato principal à sobremesa, suas ideias para o Natal reunidas em
          um único material.
        </p>
        <div className="preview-facts">
          <div>
            <strong>17</strong>
            <span>
              receitas
              <br />
              natalinas
            </span>
          </div>
          <div>
            <BookOpen size={28} />
            <span>
              Formato PDF
              <br />
              para consultar
            </span>
          </div>
        </div>
        <p className="preview-note">
          {pages.length
            ? "Deslize para conhecer algumas páginas reais do e-book."
            : "Na imagem, a apresentação do produto cadastrada na Cakto. O e-book é digital."}
        </p>
      </div>
      <div className="preview-visual">
        {pages.length > 0 ? (
          <>
            <div
              className="page-rail"
              ref={rail}
              aria-label="Páginas reais de amostra"
              tabIndex={0}
              onScroll={() => {
                if (rail.current)
                  setActive(
                    Math.round(
                      rail.current.scrollLeft / rail.current.clientWidth,
                    ),
                  );
              }}
            >
              {pages.map((p, i) => (
                <figure key={p.src}>
                  <img
                    src={p.src}
                    alt={p.alt || `Página de amostra ${i + 1}`}
                    loading="lazy"
                    width="650"
                    height="840"
                  />
                  <figcaption>{p.alt || `Página ${i + 1}`}</figcaption>
                </figure>
              ))}
            </div>
            <div className="preview-nav">
              <button
                aria-label="Página anterior"
                disabled={active === 0}
                onClick={() => go(active - 1)}
              >
                <ArrowLeft size={19} />
              </button>
              <span>
                {active + 1} / {pages.length}
              </span>
              <button
                aria-label="Próxima página"
                disabled={active >= pages.length - 1}
                onClick={() => go(active + 1)}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </>
        ) : (
          <figure className="real-product">
            <img
              src={productImage}
              srcSet={srcSet}
              sizes="(max-width:700px) 82vw, 430px"
              width="1145"
              height="1374"
              loading="lazy"
              alt="Imagem oficial de divulgação do e-book Sabores de Natal, cadastrada no checkout Cakto"
            />
            <figcaption>IMAGEM DE DIVULGAÇÃO DO PRODUTO</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
