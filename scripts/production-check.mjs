import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
const root = path.resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const file = path.join(root, pathname === "/" ? "index.html" : pathname);
    const b = await fs.readFile(file);
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.end(b);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(5175, "127.0.0.1", r));
const executablePath = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const browser = await chromium.launch({ headless: true, executablePath });
try {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({
      javaScriptEnabled,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("http://127.0.0.1:5175/");
    await page.waitForSelector("h1");
    await page.waitForLoadState("networkidle");
    if (errors.length) throw Error(errors.join("\n"));
    if (!(await page.locator("h1").isVisible())) throw Error("Hero ausente");
    const href = await page.locator('[data-cta="hero"]').getAttribute("href");
    if (href !== "https://pay.cakto.com.br/kb3fq4x_1250915")
      throw Error("Checkout incorreto");
    console.log(
      JSON.stringify({ javaScriptEnabled, hero: true, href, errors }),
    );
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
