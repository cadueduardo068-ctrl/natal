import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { outputDir } from "./build-paths.mjs";

const html = await fs.readFile(path.join(outputDir, "index.html"), "utf8");
const config = JSON.parse(
  await fs.readFile(path.join(outputDir, "config.json"), "utf8"),
);
const embedded = html.match(
  /<script id="site-config" type="application\/json">([\s\S]*?)<\/script>/,
)?.[1];
assert(embedded, "O HTML não contém a configuração pré-renderizada.");
assert.deepEqual(
  JSON.parse(embedded),
  config,
  "A configuração do HTML difere de config.json.",
);
assert(
  html.includes("<h1") && html.includes('data-cta="hero"'),
  "Hero ou CTA ausente no HTML estático.",
);
assert(
  !html.includes('class="initial-loading"'),
  "A pré-renderização não substituiu o carregamento inicial.",
);
assert.equal(
  new URL(config.checkoutUrl).protocol,
  "https:",
  "Checkout precisa usar HTTPS.",
);

const assets = new Set();
function collect(text, expression) {
  for (const match of text.matchAll(expression)) {
    const url = match[1];
    if (!url.startsWith("/") || url.startsWith("//") || url === "/") continue;
    assets.add(decodeURIComponent(url.split(/[?#]/)[0]));
  }
}
collect(html, /(?:src|href)="([^"\s]+)"/g);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const entry of match[1].split(",")) {
    const url = entry.trim().split(/\s+/)[0];
    if (url.startsWith("/")) assets.add(url);
  }
}
for (const asset of [...assets]) {
  const file = path.resolve(outputDir, "." + asset);
  assert(
    file.startsWith(outputDir + path.sep),
    `Recurso fora da saída: ${asset}`,
  );
  const stat = await fs.stat(file).catch(() => {
    throw Error(`Recurso ausente no build: ${asset}`);
  });
  assert(stat.isFile(), `Recurso não é um arquivo: ${asset}`);
  if (file.endsWith(".css"))
    collect(await fs.readFile(file, "utf8"), /url\(["']?([^\s)"']+)/g);
}
for (const asset of assets) await fs.access(path.join(outputDir, asset));
console.log(
  `Build verificado em ${outputDir}: HTML pré-renderizado, checkout HTTPS e ${assets.size} recursos locais presentes.`,
);
