# Diagnóstico e configuração do Cloudflare

## Estado do diagnóstico

O erro remoto ainda não foi reproduzido. O código do commit `e9ab666` compilou antes de qualquer alteração e também após instalação limpa pelo lockfile. O trecho enviado mostra apenas que o comando de build chamado pelo Wrangler retornou erro; não contém a primeira exceção ou mensagem de compilação.

Não é possível atribuir a falha a TypeScript, Vite, SSR, uma dependência ou ao Cloudflare sem essa mensagem. Também não há status ou log de CI acessível pelo GitHub para esse commit. Os testes locais são executados em Windows, Node 24.22.0; não houve reprodução no ambiente Linux do Cloudflare.

## Ajustes preparados

- `.node-version` fixa Node 24.22.0, a versão validada localmente. `engines.node` documenta versões compatíveis com as dependências atuais.
- `.npmrc` inclui dependências de desenvolvimento e opcionais. TypeScript, Vite, Tailwind e os binários nativos precisam estar presentes na máquina de build, mesmo se `NODE_ENV=production` estiver definido.
- `package.json` divide o build em `typecheck`, `build:client`, `build:prerender` e `build:check`, para que o próximo log identifique a etapa que falha.
- A saída `dist` é declarada explicitamente no Vite. O script de pré-renderização resolve os caminhos do projeto e lê a saída efetiva do Vite.
- `build:check` confirma o HTML pré-renderizado, a configuração incorporada, o checkout HTTPS e os recursos locais referenciados pelo HTML/CSS.
- `wrangler.worker.jsonc` declara somente assets estáticos e o comando de build. O nome do Worker existente é informado por parâmetro para não criar/renomear recursos sem intenção.
- Wrangler é dependência de desenvolvimento com versão exata e lockfile atualizado. Nenhum recurso visual ou funcional foi removido.

Esses ajustes eliminam ambiguidades de configuração; não constituem confirmação de correção do incidente remoto.

## Resultados da validação local

- Instalação limpa: `npm ci --include=dev --include=optional --no-audit --no-fund` concluída com sucesso após a atualização do lockfile.
- `npm run build` concluído com sucesso dentro do custom build do Wrangler 4.154.0. TypeScript, Vite, pré-renderização e `build:check` passaram. A verificação encontrou 12 recursos referenciados; o Wrangler leu os 21 arquivos totais da saída estática.
- `wrangler deploy --dry-run` terminou com código zero e a mensagem `--dry-run: exiting now.` Nenhum upload/deploy real foi executado.
- `node scripts/production-check.mjs`: site pré-renderizado verificado com e sem JavaScript, checkout preservado e nenhum erro de console/hidratação.
- `npm test`: 24 testes aprovados em 360, 390, 768 e 1440 px.
- Os bundles JS/CSS de produção mantiveram os mesmos hashes da compilação original: a interface e as funcionalidades não foram alteradas.

Arquivos alterados/adicionados: `.gitignore`, `.node-version`, `.npmrc`, `package.json`, `package-lock.json`, `vite.config.ts`, `scripts/build-paths.mjs`, `scripts/check-build.mjs`, `scripts/prerender.mjs`, `wrangler.worker.jsonc`, `README.md` e este `CLOUDFLARE.md`.

## Cloudflare Pages — integração Git

| Campo | Valor |
|---|---|
| Diretório raiz | Raiz do repositório `natal`, onde está `package.json` |
| Preset | None / Vite, mantendo o comando abaixo |
| Node | 24.22.0, por `.node-version` ou `NODE_VERSION=24.22.0` no painel |
| Instalação, se configurável | `npm ci --include=dev --include=optional` |
| Build command | `npm run build` |
| Build output directory | `dist` — confirmado em `vite.config.ts` e no build |
| Deploy command separado | Não é necessário na integração Git nativa do Pages |

O arquivo `wrangler.worker.jsonc` é exclusivo do fluxo Workers e não deve ser usado como configuração Pages. Não aponte a publicação para `.prerender`, `src` ou `public`. O SSR é usado somente para gerar HTML durante o build; não existe servidor Node de produção.

## Cloudflare Workers — Wrangler / Workers Builds

Use o nome **real do Worker existente** no lugar de `NOME_EXISTENTE`:

```sh
npx wrangler deploy --config wrangler.worker.jsonc --name NOME_EXISTENTE
```

Esse comando é de publicação: execute somente após autorização. O Wrangler executa o custom build `npm run build` antes de publicar `dist`. No painel Workers Builds, deixe o **Build command vazio** e configure esse comando como **Deploy command** para não compilar duas vezes. Use Node 24.22.0 e a raiz correta do projeto.

Para validar sem publicar:

```sh
npx wrangler deploy --config wrangler.worker.jsonc --name natal-build-check --dry-run --outdir .wrangler/dry-run
```

`natal-build-check` é apenas um nome de teste local usado com `--dry-run`, não o nome confirmado do seu Worker. O dry-run não testa permissões de conta, domínio, DNS ou publicação real.

## Variáveis e rotas

A compilação não requer segredos, banco, APIs externas, geração de imagens ou credenciais da Cakto. Produto e checkout vêm de `public/config.json`. Credenciais Cloudflare só são necessárias para uma publicação real por CLI fora de um ambiente autenticado. Não coloque tokens no código ou no JSON público.

O Vite gera recursos em `/assets`; imagens e fontes são copiadas de `public/`. A página usa âncoras, sem roteador de páginas adicional. O diretório publicado deve estar na raiz do domínio; hospedagem em subpasta exigiria ajuste de `base` e dos caminhos absolutos. `public/_headers` acompanha a saída estática.

## Logs ainda necessários para identificar a causa exata

No mesmo build que falhou às **13:56:37**, envie as linhas **anteriores** a `Running custom build npm run build failed`, começando na instalação das dependências. Precisamos de:

1. Versões de Node/npm e comando de instalação.
2. Comando e diretório de build/deploy efetivos.
3. Primeira mensagem de erro: por exemplo `error TS...`, `Cannot find module`, `failed to load config`, erro de pré-renderização ou código npm, incluindo o stack trace.
4. Identificação do produto Cloudflare: Pages ou Workers, além do commit/branch usado.

Se o painel permitir exportar o log completo, o caminho mencionado pelo Wrangler foi `/opt/buildhome/.config/.wrangler/logs/wrangler-2026-10-28_16-55-27_193.log`. Esse arquivo pertence ao ambiente remoto; não está disponível neste computador.

## Referências oficiais

- [Versão do Node no Pages](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Assets estáticos no Workers](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Custom builds do Wrangler](https://developers.cloudflare.com/workers/wrangler/custom-builds/)

Nenhum push ou deploy faz parte desta investigação sem autorização.
