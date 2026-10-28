import fs from "node:fs/promises";
import { renderPage } from "../.prerender/server.js";
const config = JSON.parse(await fs.readFile("public/config.json", "utf8"));
const html = renderPage(config);
const source = await fs.readFile("dist/index.html", "utf8");
const root =
  '<div id="root"><div class="initial-loading" role="status">Carregando Sabores de Natal…</div></div>';
if (!source.includes(root))
  throw Error("Root de pré-renderização não encontrado");
const embedded = JSON.stringify(config).replaceAll("<", "\\u003c");
await fs.writeFile(
  "dist/index.html",
  source.replace(
    root,
    `<div id="root">${html}</div><script id="site-config" type="application/json">${embedded}</script>`,
  ),
);
console.log(
  "Página completa pré-renderizada: conteúdo e links disponíveis antes de carregar JavaScript.",
);
