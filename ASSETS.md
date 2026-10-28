# Origem e preparação dos recursos

## Imagem do produto

Fonte pública, verificada em 28/10/2026: https://cdn-checkout.cakto.com.br/products/d0732d7b-ff7f-40b1-9384-4e60a11449f6.png

Imagem real de divulgação do produto cadastrado no checkout https://pay.cakto.com.br/kb3fq4x_1250915. O original está em `assets-source/product-original.png`. As versões WebP e os recortes são gerados por `scripts/prepare-images.mjs`, sem criar novas receitas ou páginas.

`public/images/product.webp` e `product-small.webp`: apresentação integral. `hero-food.webp`, `pratos.webp`, `acompanhamentos.webp` e `sobremesas.webp`: detalhes gastronômicos extraídos da mesma divulgação. As legendas deixam explícita essa origem. As fotografias genéricas externas da versão anterior foram removidas.

## Composição editorial

Ferramenta usada: ImageGen nativa. Original em `assets-source/table-editorial-original.png`; versão utilizada em `public/images/table-editorial.webp`. Não representa uma fotografia do produto, uma página interna nem uma receita pronta. A legenda identifica a composição como ilustrativa.

Prompt utilizado:

> Use case: photorealistic-natural. Asset type: premium Brazilian Christmas recipe ebook landing page editorial photograph, landscape 1536x1024. A beautifully styled intimate Brazilian Christmas dining table BEFORE the food is served. Warm natural candlelight, ivory linen, burgundy fabric napkins tied with rosemary, ceramic ivory plates with subtle gold edges, brass cutlery, clear glass goblets, restrained natural evergreen branches, a few tiny warm fairy lights softly blurred behind. Rich texture, sophisticated premium food magazine photography, authentic inviting home not a restaurant, subtly imperfect linen. Composition intimate overhead oblique angle, place settings filling foreground, candles at rear, no people. Palette wine red #851F28, pine #173D32, cream #FFF9F0, soft gold #D7B16A. IMPORTANT: no food, no recipe dishes, no books, no tablet, no text, no logos, no watermark. This is an atmospheric table photograph only, not a product image.

## Fontes

Playfair Display e DM Sans, obtidas de Google Fonts e servidas localmente em `public/fonts`. Não há conexão ao Google Fonts durante a visita. Regeneração opcional: `node scripts/prepare-fonts.mjs`.

Fontes dos projetos: https://github.com/googlefonts/Playfair e https://github.com/googlefonts/dm-fonts. Inclua as licenças OFL fornecidas com as fontes ao redistribuir.
