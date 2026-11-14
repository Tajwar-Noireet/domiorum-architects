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
  const links = page.getByRole("navigation", { name: "Services on this page" });
  for (const [title, anchor] of [
    ["Residential Interior", "service-1"],
    ["Commercial Interior", "commercial-interior"],
    ["Architecture Consultancy", "service-2"],
  ]) {
    await links.getByRole("link", { name: title }).click();
    const article = page.locator(`#${anchor}`);
    await expect(article.locator("h2")).toBeInViewport();
    await expect(article).toHaveCSS("opacity", "1");
    await expect(
      article.getByRole("link", { name: "Discuss your project" }),
    ).toHaveAttribute("href", "/book-consultation");
  }
  for (const department of ["Residential Interior", "Commercial Interior"]) {
    const section = page.getByRole("region", { name: department });
    for (const name of ["Essentia", "Signature", "Prestige"]) {
      await expect(
        section.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
    }
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

test("package links open the enquiry form with the department and package selected", async ({
  page,
}) => {
  await page.goto("/services");
  for (const [department, plan] of [
    ["Residential Interior", "Essentia"],
    ["Residential Interior", "Signature"],
    ["Residential Interior", "Prestige"],
    ["Commercial Interior", "Essentia"],
    ["Commercial Interior", "Signature"],
    ["Commercial Interior", "Prestige"],
  ]) {
    await page
      .getByRole("link", { name: `Enquire about ${plan} for ${department}` })
      .click();
    await expect(page).toHaveURL(/\/book-consultation\?.*#enquiry-form$/);
    const heading = page.getByRole("heading", {
      name: `Enquire about ${plan}`,
    });
    await expect(heading).toBeInViewport();
    await expect(page.getByLabel("Department", { exact: true })).toHaveValue(
      department,
    );
    await expect(page.getByLabel("Package", { exact: true })).toHaveValue(plan);
    await page.getByLabel("Your name").fill("Test client");
    await page.getByLabel("Email address").fill("client@example.com");
    await page
      .getByLabel("A little about your project")
      .fill("A fit-out in Dhaka.");
    await page.getByRole("button", { name: "Prepare my enquiry" }).click();
    await expect(page.getByLabel("Prepared enquiry text")).toHaveValue(
      new RegExp(`Department: ${department}\\nPackage: ${plan}`),
    );
    await page.goBack();
  }
});

test("the Services process heading moves through all stages and resets on reverse scroll", async ({
  page,
}) => {
  await page.goto("/services");
  const process = page.locator(".services-process-chapters");
  const grid = process.locator(".process-grid");
  const heading = process.getByRole("heading", { level: 2 });
  const scrollToProgress = (progress: number) =>
    grid.evaluate((element, progress) => {
      const rect = element.getBoundingClientRect();
      const start = scrollY + rect.top - innerHeight * 0.88;
      const distance = rect.height + innerHeight * 0.33;
      window.scrollTo({
        top: start + distance * progress,
        behavior: "instant",
      });
    }, progress);

  for (const [progress, title] of [
    [0.125, "First, we listen."],
    [0.375, "Then, we explore."],
    [0.625, "We refine the design."],
    [0.875, "We prepare for the next stage."],
    [0.375, "Then, we explore."],
    [-0.1, "A clear path from the first conversation."],
  ] as const) {
    await scrollToProgress(progress);
    await expect(heading).toHaveAccessibleName(title);
    await expect(heading).toBeInViewport();
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
  await expect(page).toHaveURL(/\/book-consultation$/);
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
});
