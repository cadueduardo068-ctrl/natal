# Sabores de Natal

React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide. Layout responsivo, carrossel por toque, FAQ acessível, CTA móvel, avaliações condicionais e consentimento opcional do Meta Pixel.

## Executar

`npm install`, `npm run dev`. Para produção: `npm run build`.

## Configuração

Edite `public/config.json` antes de vender. `checkoutUrl`: link HTTPS real do checkout Cakto; sem ele, os botões exibem uma mensagem de vendas ainda não abertas. `supportEmail` e `contactName`: dados reais. `previewPages`: URLs de algumas páginas reais do PDF, nunca o material completo; vazio oculta a amostra. `reviews`: depoimentos reais autorizados com `name`, `rating` de 1 a 5, `comment`, `date` e `photo` opcional; vazio oculta a seção. `metaPixelId`: ID numérico opcional, ativado somente após consentimento; não há evento Purchase. `images`: URLs substituíveis.

As fotos de Unsplash são composições gastronômicas ilustrativas e não representam fotos verificadas das receitas específicas. Substitua por fotografias próprias dos pratos para correspondência exata. Capa criada como mockup ilustrativo em CSS; o PDF não foi fornecido. Confirme o conteúdo real do produto (lista de compras, dicas e cardápios previstos no briefing) antes da venda.

## Cloudflare Pages

Comando de build: `npm run build`. Diretório de saída: `dist`. Não exige servidor, segredos ou banco. O arquivo `config.json` é público: nunca inclua credenciais. Configure domínio/HTTPS no painel da Cloudflare. Acrescente URL canônica e imagem Open Graph própria ao definir o domínio final.

O pagamento e a entrega do produto são realizados pela Cakto e devem estar configurados na plataforma. A página não processa pagamentos nem entrega o PDF. Avaliações e amostras são configuradas no JSON, sem painel administrativo.
