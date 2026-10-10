import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
});

test("service chapters navigate to readable content at every viewport", async ({
  page,
}, info) => {
  await page.goto("/services");
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  const links = page.locator(".service-index a");
  for (let index = 0; index < 4; index++) {
    await links.nth(index).click();
    const article = page.locator(`#service-${index + 1}`);
    await expect(article.locator("h2")).toBeInViewport();
    await expect(article).toHaveCSS("opacity", "1");
    await expect(
      article.getByRole("link", { name: "Discuss your project" }),
    ).toHaveAttribute("href", "/book-consultation");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.locator(".service-index a").first().click();
  await page.locator("#service-1 .text-link").click();
  await expect(page).toHaveURL(/\/book-consultation$/);
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await page.goBack();
  await expect(page.locator("#service-1")).toHaveCSS("opacity", "1");
  if (info.project.name === "desktop") {
    await page.goto("/services");
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");
    await expect(page.locator("h1")).toHaveCSS("transform", "none");
    await expect
      .poll(() =>
        page
          .locator(".services-banner img")
          .evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.screenshot({
      path: "../output/website-review/upgrade-services-desktop.png",
    });
  }
});

test("room gallery keeps keyboard, chapter selection and progress in sync", async ({
  page,
}) => {
  await page.goto("/");
  const buttons = page.locator(".interior-controls button");
  const viewport = page.locator(".interior-viewport");
  await buttons.first().click();
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
  await viewport.press("End");
  await expect(buttons.last()).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page
        .locator(".interior-reading-progress span")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeGreaterThan(0.99);
  await viewport.press("ArrowLeft");
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await viewport.press("Home");
  await expect(buttons.first()).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page
        .locator(".interior-reading-progress span")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeLessThan(0.35);
});

test("process and footer reveal without covering content or trapping navigation", async ({
  page,
}, info) => {
  await page.goto("/services");
  const line = page.locator("[data-process-progress]");
  await expect
    .poll(() =>
      line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeLessThan(0.01);
  const steps = page.locator("[data-process-step]");
  for (const step of await steps.all()) {
    await step.scrollIntoViewIfNeeded();
    await expect(step).toHaveCSS("opacity", "1");
    await expect(step).toHaveCSS("transform", "none");
    await expect(step.locator("h3")).toBeInViewport();
  }
  await expect
    .poll(() =>
      line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeGreaterThan(0);
  const footer = page.locator(".studio-footer");
  await footer.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11),
    )
    .toBeGreaterThan(0.99);
  for (const panel of await footer.locator("[data-folio-reveal]").all()) {
    await panel.scrollIntoViewIfNeeded();
    await expect(panel).toHaveCSS("opacity", "1");
    await expect(panel).toHaveCSS("transform", "none");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  if (info.project.name === "mobile" || info.project.name === "desktop") {
    await page.screenshot({
      path: `../output/website-review/upgrade-footer-${info.project.name}.png`,
    });
  }
  await footer
    .getByRole("link", { name: "Tell us about your project" })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
});

test("project scenes stay visible when jumping forward and backward", async ({
  page,
}) => {
  await page.goto("/projects/mirpur-dohs-interior");
  const gallery = page.locator(".project-scroll-gallery");
  await expect(gallery).toHaveAttribute("data-animated", "true");
  const buttons = gallery.locator(".project-gallery-controls button");
  const count = await buttons.count();
  expect(count).toBeGreaterThan(2);
  for (const index of [count - 1, 0, Math.floor(count / 2)]) {
    await buttons.nth(index).click();
    await expect(buttons.nth(index)).toHaveAttribute("aria-pressed", "true");
    const scene = gallery.locator(".project-gallery-scene").nth(index);
    await expect(scene).toHaveAttribute("data-rendered", "true");
    await expect(scene).toHaveCSS("visibility", "visible");
    await expect
      .poll(() =>
        scene
          .locator("img")
          .first()
          .evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
      )
      .toBe(true);
    expect(
      await gallery.locator('[data-rendered="true"]').count(),
    ).toBeLessThanOrEqual(3);
  }
});
