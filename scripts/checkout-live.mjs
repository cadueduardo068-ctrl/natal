import { chromium } from "@playwright/test";
import fs from "node:fs";
const executablePath = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(fs.existsSync);
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/485.0.0.0.0;]",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto("https://pay.cakto.com.br/kb3fq4x_1250915", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.locator('input[type="email"]').first().waitFor({ timeout: 20000 });
  await page.getByText("PIX", { exact: true }).click();
  console.log(
    JSON.stringify(
      {
        status: response?.status(),
        url: page.url(),
        title: await page.title(),
        emailField: await page.locator('input[type="email"]').count(),
        text: (await page.locator("body").innerText()).slice(-8500),
        links: await page
          .locator("a")
          .evaluateAll((links) =>
            links.map((a) => ({ text: a.textContent, href: a.href })),
          ),
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  fs.mkdirSync("reports", { recursive: true });
  await page.screenshot({
    path: "reports/checkout-mobile.png",
    fullPage: true,
  });
} finally {
  await browser.close();
}
