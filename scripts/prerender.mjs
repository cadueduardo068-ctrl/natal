import fs from "node:fs/promises";
import { renderPage } from "../.prerender/server.js";
import path from "node:path";
import { projectRoot, outputDir } from "./build-paths.mjs";
const config = JSON.parse(
  await fs.readFile(path.join(projectRoot, "public/config.json"), "utf8"),
);
const html = renderPage(config);
const outputIndex = path.join(outputDir, "index.html");
const source = await fs.readFile(outputIndex, "utf8");
const root =
  '<div id="root"><div class="initial-loading" role="status">Carregando Sabores de Natal…</div></div>';
if (!source.includes(root))
  throw Error("Root de pré-renderização não encontrado");
const embedded = JSON.stringify(config).replaceAll("<", "\\u003c");
await fs.writeFile(
  outputIndex,
  source.replace(
    root,
    `<div id="root">${html}</div><script id="site-config" type="application/json">${embedded}</script>`,
  ),
);
console.log(
  "Página completa pré-renderizada: conteúdo e links disponíveis antes de carregar JavaScript.",
);
