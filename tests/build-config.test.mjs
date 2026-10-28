import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { resolveConfig } from "vite";
import { renderPage } from "../.prerender/server.js";

test("SSR has a dedicated Node configuration and a stable server.js entry", async () => {
  const config = await resolveConfig(
    { configFile: "vite.prerender.config.ts" },
    "build",
  );
  assert.equal(config.build.ssr, "src/server.tsx");
  assert.equal(config.build.outDir, ".prerender");
  assert.equal(config.build.rollupOptions.output.entryFileNames, "server.js");
  assert.equal(config.build.copyPublicDir, false);
  assert(!config.plugins.some((plugin) => /cloudflare/i.test(plugin.name)));
  const content = JSON.parse(await fs.readFile("public/config.json", "utf8"));
  const html = renderPage(content);
  assert(html.includes('data-cta="hero"'));
  assert(html.includes(content.checkoutUrl));
  assert(html.includes("<h1"));
});

test("default Wrangler config serves the generated assets without auto-setup or a second build", async () => {
  const worker = JSON.parse(await fs.readFile("wrangler.jsonc", "utf8"));
  assert.equal(worker.name, "natal");
  assert.equal(worker.assets.directory, "./dist");
  assert.equal(worker.build, undefined);
  assert.equal(worker.main, undefined);
  const html = await fs.readFile("dist/index.html", "utf8");
  assert(html.includes('id="site-config"'));
  assert(!html.includes('class="initial-loading"'));
  const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
  assert.equal(pkg.scripts.deploy, "wrangler deploy --config wrangler.jsonc");
  assert(!pkg.dependencies?.["@cloudflare/vite-plugin"]);
  assert(!pkg.devDependencies?.["@cloudflare/vite-plugin"]);
});
