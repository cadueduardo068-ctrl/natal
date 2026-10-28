import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import http from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
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
    const target = path.resolve(
      root,
      "." + new URL(req.url, "http://localhost").pathname,
    );
    if (!target.startsWith(root + path.sep) && target !== root)
      throw Error("Path");
    const file = target === root ? path.join(root, "index.html") : target;
    const data = await fs.readFile(file);
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((r) => server.listen(5174, "127.0.0.1", r));
const chromePath = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const chrome = await launch({
  chromePath,
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
});
try {
  const result = await lighthouse("http://127.0.0.1:5174/", {
    port: chrome.port,
    output: ["html", "json"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile("reports/lighthouse-mobile.html", result.report[0]);
  await fs.writeFile("reports/lighthouse-mobile.json", result.report[1]);
  const l = result.lhr;
  console.log(
    JSON.stringify(
      {
        scores: Object.fromEntries(
          Object.entries(l.categories).map(([k, v]) => [k, v.score]),
        ),
        metrics: Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "cumulative-layout-shift",
            "total-blocking-time",
            "speed-index",
          ].map((k) => [k, l.audits[k]?.displayValue]),
        ),
        issues: Object.entries(l.audits)
          .filter(([, v]) => v.score !== null && v.score < 0.9)
          .map(([k, v]) => ({
            id: k,
            title: v.title,
            display: v.displayValue,
          })),
      },
      null,
      2,
    ),
  );
} finally {
  await chrome.kill();
  server.close();
}
