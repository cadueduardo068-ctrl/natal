# Correção da falha de pré-renderização no deploy

Este documento registra a correção isolada do SSR. O redesign posterior e seus resultados atuais estão em `REDESIGN.md`; os hashes e contagens da validação abaixo pertencem à etapa anterior de correção, antes da mudança visual.

## Primeiro erro real do log fornecido

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'/opt/buildhome/repo/.prerender/server.js'
imported from /opt/buildhome/repo/scripts/prerender.mjs
```

O log de 28/10/2026 mostra que o primeiro `npm run build` concluiu com sucesso às 18:11:47 UTC. A falha ocorreu somente no segundo build, disparado durante `npx wrangler deploy`.

## Causa identificada

1. O deploy padrão não encontrou um arquivo padrão de configuração do Wrangler na raiz.
2. O Wrangler iniciou a autoconfiguração: instalou `@cloudflare/vite-plugin`, alterou o Vite e criou uma configuração Workers.
3. O plugin de deploy passou a interferir também no comando de SSR. O próprio log registra a saída `.prerender/assets/server-CiraKQdb.js`, e não `.prerender/server.js`.
4. `scripts/prerender.mjs` importava o arquivo fixo `.prerender/server.js`, que deixou de existir. O Node encerrou com código 1 e o Wrangler exibiu a mensagem genérica de falha do custom build.

Não foi uma falha do TypeScript nem falta de uma variável da Cakto. A correção anterior em `wrangler.worker.jsonc` só funcionava ao informar `--config`; o comando padrão configurado no Cloudflare continuava sem uma configuração reconhecida automaticamente.

## Correção implementada

- `wrangler.jsonc` passa a ser a configuração padrão, com o nome real `natal` informado pelo log e `assets.directory = ./dist`. Ela impede a autoconfiguração do projeto no deploy padrão.
- Não há `build.command` dentro do Wrangler: o painel já executa `npm run build`. O deploy apenas publica a saída existente, sem recompilar nem instalar adaptadores.
- `vite.prerender.config.ts` separa o SSR Node da configuração de navegador/deploy. Define explicitamente `ssr: src/server.tsx`, saída `.prerender` e entrada ESM `server.js`.
- O comando `build:prerender` usa essa configuração exclusiva. Não depende mais de o adaptador respeitar o `--ssr` na configuração principal.
- O script `deploy` usa `wrangler deploy --config wrangler.jsonc`, explicitando a configuração para evitar ambiguidades.
- `wrangler.worker.jsonc` foi removido para não manter dois fluxos contraditórios.
- Foram adicionados dois testes de regressão para o arquivo SSR importável, o HTML gerado, a configuração padrão e a ausência de um segundo custom build.

Nenhum arquivo da interface, imagem, animação, texto comercial ou integração de checkout foi alterado.

## Configuração correta para este projeto no Cloudflare

O log confirma **Workers Builds**, Worker **natal**, servindo assets estáticos. A pré-renderização acontece em Node durante o build; não se deve publicar `.prerender/server.js` como uma função Worker.

| Campo | Valor |
|---|---|
| Repositório esperado | `cadueduardo068-ctrl/natal` |
| Production branch | `main` |
| Root directory | Raiz do repositório, onde está `package.json` |
| Node | `24.22.0`, por `.node-version` ou `NODE_VERSION` coerente no painel |
| Instalação | `npm ci` — `.npmrc` inclui dependências de build e opcionais |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --config wrangler.jsonc` |
| Assets directory | `dist`, declarado no Vite e no Wrangler |
| Entry point de Worker | Nenhum: publicação somente de assets estáticos |
| Variáveis da aplicação | Nenhuma obrigatória; produto e checkout vêm do JSON público |

Não adicione `npm run build` ao deploy command: ele já é executado no campo Build. Não execute `wrangler setup` nem instale `@cloudflare/vite-plugin` neste fluxo estático.

## Repositório/branch e conteúdo antigo no log

O GitHub foi consultado: a branch padrão é `main`; antes desta nova correção, seu HEAD era `96f75a843fe42e0b82ed8cf8fb38d570edd56383`.

Entretanto, o log enviado executa o script antigo `tsc --noEmit && vite build && vite build --ssr...` e informa que Wrangler não estava instalado no projeto. Isso não corresponde ao conteúdo desse HEAD, que já possuía etapas `typecheck/build:client/build:prerender/build:check` e Wrangler no lockfile. Portanto, aquela execução usou conteúdo anterior. O log não mostra SHA ou branch suficiente para distinguir branch incorreta, repetição de deployment antigo ou configuração do repositório.

Depois de enviar esta correção, inicie um **novo build do commit mais recente de main**, em vez de apenas repetir um deployment antigo. Confira no painel o SHA, o repositório, a branch e a raiz. Se aparecer novamente `Detected Project Settings` e instalação de `@cloudflare/vite-plugin`, o build não está usando a raiz com o novo `wrangler.jsonc`.

## Validação

Resultados desta correção, em Node 24.22.0 no Windows:

| Verificação | Resultado |
|---|---|
| `npm ci` | Código de saída 0; 234 pacotes instalados |
| `npm run build` | Código de saída 0; `.prerender/server.js` gerado e HTML validado |
| `npm run test:build` | 2 testes de regressão aprovados; saída 0 |
| `npm test` | 24 testes funcionais aprovados; saída 0 |
| `node scripts/production-check.mjs` | HTML e checkout corretos com/sem JavaScript; saída 0 |
| `npx wrangler deploy --dry-run` | Saída 0; sem autoconfiguração ou modificação dos arquivos |
| `npm run deploy:check` | Saída 0; leitura dos 21 assets de `dist`, sem segundo build |

O log completo do build está em `../validacao/cloudflare-build.log` e termina com `EXIT_CODE=0`. O dry-run está em `../validacao/cloudflare-dry-run.log` e também termina com `EXIT_CODE=0`. Os hashes dos bundles JS/CSS continuam `index-CAZOfJqI.js` e `index-C8bD4MTV.css`, iguais aos anteriores à correção.

Arquivos da correção: `wrangler.jsonc`, `vite.prerender.config.ts`, `package.json`, `tsconfig.json`, `playwright.config.ts`, `tests/build-config.test.mjs`, `README.md` e `CLOUDFLARE.md`; remoção de `wrangler.worker.jsonc`.

Comandos de verificação, sem publicar:

```sh
npm ci
npm run build
npm run test:build
npm test
node scripts/production-check.mjs
npm run deploy:check
```

O dry-run confirma o empacotamento, não a autorização da conta, DNS ou conclusão de um deploy real. A reprodução integral do ambiente Linux remoto não foi executada; a causa acima está comprovada pelo log remoto e a correção foi validada localmente.

## Pages ou Workers?

O site é estático e poderia ser hospedado no Pages, mas **não precisa migrar** para corrigir esta falha. O fluxo atual identificado é Workers, e a correção mantém esse produto. Uma migração futura ao Pages usaria build `npm run build` e saída `dist`, com uma configuração Pages própria, substituindo a configuração Workers.

## Fontes oficiais

- [Autoconfiguração do Wrangler e nomes de arquivo reconhecidos](https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/)
- [Workers com assets estáticos](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Configuração do Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
