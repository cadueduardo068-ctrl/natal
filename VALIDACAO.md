# Validação — Sabores de Natal

Reconstrução validada em 28/10/2026.

## Implementação

Nova interface mobile-first com a imagem real de divulgação da Cakto, oferta legível, categorias com receitas confirmadas na descrição, benefícios, seção editorial, oferta principal, FAQ nativo, privacidade e informações do vendedor. Imagens WebP e fontes hospedadas localmente. HTML pré-renderizado para que texto, preço e compra funcionem antes do JavaScript.

## Build e testes

- TypeScript e build Vite/SSR estático concluídos sem erro.
- 24 testes Playwright aprovados em 360, 390, 768 e 1440 px. Incluem rolagem horizontal, primeira oferta dentro da tela, imagens, console, todos os CTAs, barra fixa, FAQ, foco do diálogo, consentimento, revogação, armazenamento bloqueado e amostras configuradas.
- Build de produção verificado com e sem JavaScript: oferta e checkout disponíveis, sem erros de hidratação ou console.
- Navegação de cada CTA interceptada somente nos testes automatizados. Checkout real adicionalmente aberto no Chrome mobile emulado com user agent do Facebook: HTTP 200, produto correto, formulário carregado, sem erros de JavaScript. Nenhuma cobrança, geração de Pix ou compra foi feita. Isso não substitui um teste dentro do aplicativo real do Facebook/Instagram.

## Lighthouse mobile local

| Medida | Resultado |
|---|---|
| Performance | 100/100 |
| Acessibilidade | 100/100 |
| Boas práticas | 100/100 |
| SEO | 100/100 |
| LCP | 1.1 s |
| CLS | 0.002 |
| TBT | 20 ms |

Perfil móvel simulado do Lighthouse sobre o build servido localmente. Não são dados de campo. INP real não foi medido; TBT não equivale a INP. Rede, aparelho e hospedagem afetam os resultados. O relatório completo acompanha a entrega.

## Checkout e taxas

URL preservada: https://pay.cakto.com.br/kb3fq4x_1250915 . Base R$ 19,90. O checkout exibiu taxa R$ 0,99 e total à vista R$ 20,89 tanto no cartão quanto no Pix; a página agora informa isso. Não alteramos a configuração financeira da Cakto. Carlos Sanches é o nome apresentado no checkout. Pix, cartão e PicPay foram exibidos; carteiras Google/Apple constam na configuração e dependem do dispositivo.

## Rastreamento

ID Meta Pixel continua vazio: não existe medição real ativa nesta landing page. Estrutura pronta para PageView único e RecipeCTAClick, somente com ID válido e consentimento. Não há InitiateCheckout ou Purchase inventados. Testes verificam a fila de eventos com script externo isolado; não validam recebimento no Gerenciador de Eventos. Eventos de checkout e compra devem vir de integração confirmada da Cakto.

## Informações pendentes

PDF, capa isolada e páginas internas reais ainda precisam ser fornecidos. O componente de amostras já está preparado e não cria páginas falsas. Falta canal autorizado de suporte do vendedor e eventual política própria completa. A orientação de reembolso usa os links oficiais da Cakto; nenhuma garantia adicional foi criada. Não há depoimentos.

## Acesso e publicação

A audiência encontrada no Sites é somente o proprietário. Ela foi preservada. Visitantes dos anúncios não devem ser enviados para esse endereço enquanto o acesso não for liberado ao público. Esse é um possível bloqueio de acesso, não uma prova da causa histórica das 141 visitas sem checkout; não houve acesso ao Ads Manager.

Para Cloudflare Pages: npm ci, comando npm run build, diretório dist, Node 22 ou 24. Atualize URLs canônica/Open Graph se mudar de domínio. Instruções completas em README.md.

## Arquivos principais

- src/App.tsx, src/style.css, src/fonts.css: nova interface e estilos.
- src/components/PurchaseLink.tsx e EbookPreview.tsx: compra e amostras.
- src/config.ts e public/config.json: configuração centralizada e taxas.
- src/analytics.ts: consentimento e eventos.
- src/entry.tsx, src/server.tsx e scripts/prerender.mjs: HTML estático e hidratação.
- tests/purchase.spec.ts, playwright.config.ts e scripts de auditoria: validação.
- index.html, public/images, public/fonts e public/_headers: SEO, recursos locais e cabeçalhos.
- README.md e ASSETS.md: operação, publicação, origem das imagens e prompt ImageGen.
