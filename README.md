# Sabores de Natal — página de vendas

Reconstrução em React 19, Vite, TypeScript, Tailwind e Framer Motion. O build pré-renderiza o HTML: a oferta e os links de compra funcionam mesmo antes do JavaScript. A saída é estática, compatível com Cloudflare Pages.

O redesign mais recente usa fundo branco, verde e turquesa, composição centralizada e botões verdes. Veja [REDESIGN.md](REDESIGN.md) para o escopo e a validação atual. `VALIDACAO.md` registra a etapa visual anterior.

## Rodar e verificar

```sh
npm ci
npm run dev
npm run build
npm run test:build
npm test
npm run audit:mobile
node scripts/production-check.mjs
```

Os testes usam Chrome ou Edge já instalado no Windows, com seleção automática em `playwright.config.ts`. Para outros ambientes, ajuste `executablePath` ou use o navegador instalado pelo Playwright. O teste de checkout real é separado e somente abre a página: `node scripts/checkout-live.mjs`. Ele não informa dados nem gera Pix ou pagamento.

## Configuração central

Edite `public/config.json` e gere um novo build. O build incorpora uma cópia validada da configuração ao HTML para evitar dependência de uma requisição antes da primeira tela.

- `checkoutUrl`: checkout HTTPS real. Todos os CTAs usam a constante `CHECKOUT_URL`, derivada dessa configuração, com links nativos na mesma aba. Sem pop-up ou formulário intermediário.
- `price`: preço base; `checkoutServiceFee`: taxa observada no checkout. Em 28/10/2026, Pix e cartão exibiram base de R$ 19,90, taxa de R$ 0,99 e total à vista de R$ 20,89. Reconfirme após mudanças na Cakto. Não alteramos as condições do checkout.
- `contactName`: Carlos Sanches, identificado no checkout. `supportEmail` continua vazio até receber um canal autorizado; não há contato inventado.
- `coverImage`: atualmente a imagem real de divulgação cadastrada no checkout. Não foi apresentada como uma página interna real do PDF.
- `previewPages`: vazio. Quando houver páginas reais, adicione objetos como `{ "src": "/images/pagina-1.webp", "alt": "Sumário do e-book" }`. O componente passa automaticamente para um carrossel por toque/teclado. Use somente uma amostra; nunca publique o PDF completo em `public/`.
- `categories`: categorias e exemplos extraídos da descrição real do produto na Cakto.
- `refundText`, `termsUrl` e `refundUrl`: orientações e links oficiais da Cakto. Nenhuma garantia promocional foi inventada.
- `privacyUrl`: reservado para política própria completa. A interface já contém explicação do tratamento realizado pela landing page.
- `metaPixelId`: vazio, preservado. A landing page não envia dados à Meta sem um ID válido e consentimento.

## Rastreamento

Com ID configurado e consentimento: um `PageView` por carregamento e o evento personalizado `RecipeCTAClick`, com posição do CTA, nome e preço do produto. Recusar ou revogar impede novos eventos. O localStorage é protegido para não quebrar navegadores internos que bloqueiam armazenamento.

Não há evento `InitiateCheckout` ou `Purchase` na landing page. Um clique não comprova carregamento do checkout nem pagamento. Configure a integração oficial na Cakto para eventos que ela possa confirmar, usando o ID autorizado e verificando deduplicação no Gerenciador de Eventos da Meta. Sem ID e acesso ao painel não é possível validar o recebimento dos eventos reais na Meta; os testes isolam e verificam a lógica de consentimento e os nomes dos eventos.

## Publicar no Cloudflare

Para o diagnóstico do erro de build e os fluxos distintos de Pages e Workers, consulte [CLOUDFLARE.md](CLOUDFLARE.md).

O fluxo atual, confirmado pelo log remoto, é **Workers Builds**, Worker `natal`. Use a raiz do repositório, Node 24.22.0, Build command `npm run build` e Deploy command `npx wrangler deploy --config wrangler.jsonc`. A configuração padrão publica apenas os assets de `dist`; não injeta adaptadores e não repete o build. Para testar sem publicar, execute `npm run deploy:check`.

O SSR usa uma configuração separada, `vite.prerender.config.ts`, e roda somente durante a geração do HTML. Uma migração ao Pages é opcional e não é necessária para corrigir a falha. Veja `CLOUDFLARE.md` para a causa exata, o conteúdo antigo detectado no log e os campos do painel.

Atualize a URL canônica e as URLs Open Graph em `index.html` ao mudar de domínio. Gere um novo build após mudanças na configuração do produto.

O projeto também mantém a identidade de hospedagem existente em `.openai/hosting.json`. Esse ID não deve ser trocado ou reutilizado para criar outro site. A publicação atual do Sites é privada; a liberação para visitantes dos anúncios é uma mudança de audiência separada e ainda depende de autorização explícita.

## Arquitetura

`src/App.tsx`: estrutura, oferta, categorias, benefícios, FAQ nativo e privacidade. `src/components/PurchaseLink.tsx`: todos os CTAs. `src/components/EbookPreview.tsx`: divulgação real e amostras configuráveis. `src/analytics.ts`: consentimento e eventos. `src/config.ts`: tipos e validação. `src/server.tsx` e `scripts/prerender.mjs`: pré-renderização estática. `src/style.css` e `src/fonts.css`: visual e fontes locais. `tests/purchase.spec.ts`: fluxos em 360, 390, 768 e 1440 px.

## Limites e pendências

Não foram fornecidos o PDF, a capa isolada ou as páginas internas. A imagem da Cakto permite apresentar o produto real, mas não substitui uma amostra do conteúdo. Faltam um contato de suporte do vendedor e eventual política própria completa. Não há depoimentos publicados. Os dados de 141 visitas vieram do briefing; não houve acesso ao Ads Manager ou histórico de analytics para confirmar a causa da ausência de entradas no checkout.

O teste com user agent do Facebook é uma emulação no Chrome, não uma execução no aplicativo real. Nenhuma compra foi realizada; o processo de entrega após pagamento não foi testado ponta a ponta. Métricas Lighthouse são de laboratório local e não garantem resultados em redes reais. INP real requer dados de uso em produção.

Veja também `ASSETS.md` para origem das imagens e `VALIDACAO.md` para resultados e pendências.
