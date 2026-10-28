import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const browser = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
if (!browser) throw new Error("Nenhum Chrome/Edge local disponível para QA.");
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [
    ["list"],
    ["json", { outputFile: "../../work/playwright-results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:5173",
    headless: true,
    launchOptions: { executablePath: browser },
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "360",
      use: {
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "390-facebook-ua",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/485.0.0.0.0;]",
      },
    },
    { name: "768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
