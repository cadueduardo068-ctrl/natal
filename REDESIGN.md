# Redesign branco, verde e turquesa

O briefing de 28/10/2026 foi implementado com hero centralizado, badge, título moderno, linhas decorativas, composição do produto real e botão verde logo abaixo. As seções foram reorganizadas em conteúdo incluído, público, três etapas de acesso, oferta, FAQ e CTA final.

O anexo recebido continha somente o texto. Não havia imagem de referência disponível; a direção visual foi baseada na composição descrita, sem afirmar correspondência com uma imagem não vista.

Checkout preservado: `https://pay.cakto.com.br/kb3fq4x_1250915`. O checkout foi consultado novamente: preço base R$ 19,90, taxa R$ 0,99 e total à vista R$ 20,89. Essas condições continuam visíveis. O acesso imediato é qualificado como acesso após confirmação do pagamento. Não há preço antigo, depoimentos, bônus ou contadores inventados.

Os componentes de amostras reais, consentimento, eventos do Meta Pixel, privacidade e barra móvel foram preservados. O campo do Pixel continua vazio. O carrossel de páginas só aparece quando existem páginas reais configuradas.

## Validação

- `npm run build`: saída 0, com HTML pré-renderizado e recursos locais verificados.
- 36 testes funcionais nas larguras 320, 360, 390, 430, 768 e 1440 px.
- 2 testes de regressão da configuração SSR/Cloudflare.
- Build de produção conferido com e sem JavaScript; o diálogo de privacidade também verifica que a hidratação conclui.
- Wrangler dry-run: saída 0, sem autoconfiguração ou segundo build.
- Lighthouse mobile local: Performance 99, Acessibilidade 100, Boas práticas 100, SEO 100. LCP 2,1 s; CLS 0,002; TBT 60 ms. São medidas de laboratório, não dados reais de campo.

O HTML estático já fornece conteúdo, links de compra e FAQ nativo. O JavaScript de React/animações é carregado após a primeira pintura da página, evitando bloquear a imagem principal. No desenvolvimento, a inicialização segue imediata. As fontes e imagens continuam locais.

## Arquivos principais

- `src/components/SalesContent.tsx`: nova composição da página e suas seções.
- `src/App.tsx`: integra a nova composição, mantendo a lógica de compra, consentimento e privacidade.
- `src/style.css`: nova identidade visual e responsividade.
- `src/entry.tsx` e `src/hydrate.tsx`: primeira pintura e hidratação progressiva.
- `index.html`: preload responsivo da imagem efetivamente utilizada e cor do navegador.
- `playwright.config.ts`, `tests/purchase.spec.ts`, `scripts/production-check.mjs`: cobertura do novo layout e hidratação.

As correções de Cloudflare em `wrangler.jsonc`, `vite.prerender.config.ts` e nos scripts de build foram mantidas. O fluxo do painel continua: Workers `natal`, branch `main`, Build `npm run build`, Deploy `npx wrangler deploy --config wrangler.jsonc`, assets `dist`. A confirmação de um deploy real depende do novo build no Cloudflare; o teste local não publica.
