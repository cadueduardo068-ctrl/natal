import { test, expect } from "@playwright/test";
import fs from "node:fs";
const config = JSON.parse(
  fs.readFileSync(new URL("../public/config.json", import.meta.url), "utf8"),
);
const checkout = "https://pay.cakto.com.br/kb3fq4x_1250915";
test("layout legível, sem overflow ou erros, preço e CTA inicial visíveis", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".hero-offer strong")).toHaveText("R$ 19,90");
  const box = await page.locator('[data-cta="hero"]').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await expect(page.locator(".consent-banner")).toHaveCount(0);
  await page.locator("#oferta").scrollIntoViewIfNeeded();
  await page.locator("#duvidas").scrollIntoViewIfNeeded();
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await page
    .locator("img")
    .evaluateAll((imgs) => imgs.forEach((img) => (img.loading = "eager")));
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((img) => img.getClientRects().length > 0)
      .every((img) => img.complete && img.naturalWidth > 0),
  );
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `../../work/qa-${info.project.name}.png`,
    fullPage: true,
  });
});
test("todos os CTAs abrem diretamente o checkout, inclusive no user agent do Facebook", async ({
  page,
}, info) => {
  await page.route(checkout, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>Checkout interceptado pelo teste</title><h1>Checkout</h1>",
    }),
  );
  const places = [
    "hero",
    "editorial",
    "offer",
    ...(Number(info.project.name.slice(0, 3)) < 700 ? ["mobile-sticky"] : []),
  ];
  for (const placement of places) {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const cta = page.locator(`[data-cta="${placement}"]`);
    await expect(cta).toHaveAttribute("href", checkout);
    if (placement === "mobile-sticky")
      await page.locator("#receitas").scrollIntoViewIfNeeded();
    await cta.click();
    await expect(page).toHaveURL(checkout);
  }
});
test("barra móvel, FAQ, privacidade e foco por teclado", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".sticky-offer")).not.toBeVisible();
  await page.locator("#receitas").scrollIntoViewIfNeeded();
  if (info.project.name === "360" || info.project.name.startsWith("390"))
    await expect(page.locator(".sticky-offer")).toBeVisible();
  await page.locator("#duvidas").scrollIntoViewIfNeeded();
  const summary = page.getByText("Posso acessar pelo celular?", {
    exact: true,
  });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator("details").filter({ has: summary }),
  ).toHaveAttribute("open", "");
  await page
    .getByRole("button", { name: "Privacidade e cookies", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Privacidade e cookies", exact: true }),
  ).toBeFocused();
});
test("pixel só após consentimento; PageView único e clique sem checkout ou compra inventados", async ({
  page,
}) => {
  await page.route("**/config.json", (r) =>
    r.fulfill({ json: { ...config, metaPixelId: "123456789012345" } }),
  );
  await page.route("https://connect.facebook.net/**", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: "/* Pixel isolado no teste. */",
    }),
  );
  await page.route(checkout, (r) =>
    r.fulfill({ contentType: "text/html", body: "<h1>Checkout</h1>" }),
  );
  await page.goto("/");
  await expect(page.locator(".consent-banner")).toBeVisible();
  expect(await page.locator("#sn-meta-pixel").count()).toBe(0);
  await page.getByRole("button", { name: "Aceitar", exact: true }).click();
  await expect(page.locator("#sn-meta-pixel")).toHaveCount(1);
  let queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue.filter((e: any[]) => e[1] === "PageView")).toHaveLength(1);
  await page
    .getByRole("button", { name: "Privacidade e cookies", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Autorizar medição", exact: true })
    .click();
  queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue.filter((e: any[]) => e[1] === "PageView")).toHaveLength(1);
  await page.evaluate(() => {
    document.addEventListener("click", (e) => {
      if ((e.target as Element).closest("[data-cta]")) e.preventDefault();
    });
  });
  await page.locator('[data-cta="hero"]').click();
  queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue.filter((e: any[]) => e[1] === "RecipeCTAClick")).toHaveLength(1);
  expect(
    queue.some(
      (e: any[]) => e[1] === "Purchase" || e[1] === "InitiateCheckout",
    ),
  ).toBe(false);
  await page
    .getByRole("button", { name: "Privacidade e cookies", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Recusar / revogar medição", exact: true })
    .click();
  await page.locator('[data-cta="hero"]').click();
  queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue.filter((e: any[]) => e[1] === "RecipeCTAClick")).toHaveLength(1);
  expect(queue.at(-1)).toEqual(["consent", "revoke"]);
});
test("recusa não injeta pixel; navegador sem localStorage continua funcional", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("Storage indisponível");
      },
    });
  });
  await page.route("**/config.json", (r) =>
    r.fulfill({ json: { ...config, metaPixelId: "123456789012345" } }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Recusar", exact: true }).click();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#sn-meta-pixel")).toHaveCount(0);
  await expect(page.locator('[data-cta="hero"]')).toHaveAttribute(
    "href",
    checkout,
  );
});
test("prévias configuradas mostram somente as páginas fornecidas", async ({
  page,
}) => {
  await page.route("**/config.json", (r) =>
    r.fulfill({
      json: {
        ...config,
        previewPages: [
          { src: "/images/product-small.webp", alt: "Amostra de teste 1" },
          { src: "/images/product-small.webp", alt: "Amostra de teste 2" },
        ],
      },
    }),
  );
  await page.goto("/");
  await page.locator("#ebook").scrollIntoViewIfNeeded();
  await expect(page.locator(".page-rail figure")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Próxima página", exact: true })
    .click();
  await expect(page.locator(".preview-nav>span")).toHaveText("2 / 2");
});
