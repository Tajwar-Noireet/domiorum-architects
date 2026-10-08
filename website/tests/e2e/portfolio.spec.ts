import { expect, test } from "@playwright/test";
import portfolio from "../../src/content/portfolio.json";

test("native desktop scrolling stacks, spreads and reverses cards on both routes", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  for (const route of ["/projects", "/"]) {
    await page.goto(route);
    const showcase = page.locator(".project-showcase");
    await expect(showcase).toHaveAttribute("data-stack", "true");
    expect(
      await showcase.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe("rgb(8, 24, 46)");
    const first = showcase.locator(".showcase-project").first();
    const second = showcase.locator(".showcase-project").nth(1);
    await showcase.locator(".showcase-index a").first().click();
    const start = await page.evaluate(() => scrollY);
    const distance = await showcase.evaluate(
      (el) =>
        el.clientHeight -
        el.querySelector(".showcase-viewport")!.clientHeight -
        48,
    );
    const scale = () =>
      first.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11);
    await expect.poll(scale).toBeCloseTo(1, 2);
    await page.mouse.wheel(0, distance / 5.5);
    await expect(second).not.toHaveAttribute("inert", "");
    await expect.poll(scale).toBeCloseTo(0.965, 2);
    expect(
      await second.evaluate((el) => el.getBoundingClientRect().top),
    ).toBeLessThan(400);
    expect(
      await showcase
        .locator(".showcase-project")
        .last()
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeGreaterThan(900);
    await page.mouse.wheel(0, -distance / 5.5);
    await expect.poll(scale).toBeCloseTo(1, 2);
    await page.mouse.wheel(0, distance * 0.995);
    await expect(showcase).toHaveAttribute("data-fan", "true");
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(start + distance * 0.98);
    const bounds = await showcase
      .locator(".showcase-project")
      .evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, bottom: r.bottom };
        }),
      );
    for (let i = 0; i < bounds.length; i++) {
      expect(bounds[i].left).toBeGreaterThanOrEqual(0);
      expect(bounds[i].right).toBeLessThanOrEqual(1440);
      expect(bounds[i].bottom).toBeLessThan(900);
      if (i) expect(bounds[i].left).toBeGreaterThan(bounds[i - 1].right);
    }
    await expect(showcase.getByRole("link", { name: /^Open / })).toHaveCount(5);
    await expect(
      showcase.getByRole("link", { name: "View project", exact: true }),
    ).toHaveCount(0);
    for (const image of await showcase.locator(".showcase-cover img").all()) {
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await showcase
      .getByRole("link", { name: "Open RUAP", exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText("RUAP");
    await page.getByRole("link", { name: "All projects", exact: true }).click();
    await expect(showcase).toHaveAttribute("data-stack", "true");
    await page.setViewportSize({ width: 1280, height: 800 });
    await showcase.locator(".showcase-index a").nth(2).click();
    await expect(
      showcase.locator(".showcase-project").nth(2),
    ).not.toHaveAttribute("inert", "");
    await expect(
      showcase.locator(".showcase-project").nth(2).locator("h2"),
    ).toBeInViewport();
    await page.setViewportSize({ width: 900, height: 650 });
    await expect(showcase).toHaveAttribute("data-stack", "false");
    expect(
      await first.evaluate((el) => getComputedStyle(el).position),
    ).not.toBe("absolute");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(showcase).toHaveAttribute("data-stack", "true");
    await showcase.locator(".showcase-index a").first().click();
    await expect.poll(scale).toBeCloseTo(1, 2);
  }
});

test("all projects stay in page flow and keyboard index links reach each gallery", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.locator(".showcase-project")).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".project-showcase")).toHaveAttribute(
    "data-animated",
    test.info().project.name === "reduced-motion" ? "false" : "true",
  );
  for (const project of portfolio) {
    await page
      .locator(".showcase-index")
      .getByRole("link", { name: new RegExp(project.title) })
      .press("Enter");
    const article = page.locator(`#selected-${project.slug}`);
    await expect(
      article.getByRole("heading", { name: project.title, exact: true }),
    ).toBeInViewport();
    const link = article.getByRole("link", {
      name: "View project",
      exact: true,
    });
    await expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
    await expect(article.locator("img")).toHaveCount(
      project.category === "Architecture" ? 1 : 2,
    );
    for (const image of await article.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await link.click();
    await expect(page.locator("h1")).toHaveText(project.title);
    await expect(page.locator("#rooms figure")).toHaveCount(
      project.images.length,
    );
    await page.getByRole("link", { name: "All projects" }).click();
  }
});

test("live device motion preferences keep every project readable without toggles", async ({
  page,
}, info) => {
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  const showcase = page.locator(".project-showcase");
  if (info.project.name !== "reduced-motion") {
    await expect(showcase).toHaveAttribute("data-animated", "true");
    await page.emulateMedia({ reducedMotion: "reduce" });
  }
  await expect(showcase).toHaveAttribute("data-animated", "false");
  for (const cover of await page.locator(".showcase-cover").all()) {
    expect(await cover.evaluate((el) => getComputedStyle(el).clipPath)).toBe(
      "none",
    );
    expect(
      await cover
        .locator("img")
        .evaluate((el) => getComputedStyle(el).transform),
    ).toBe("none");
  }
  await expect(page.locator(".showcase-motion")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(showcase).toHaveAttribute("data-animated", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(showcase).toHaveAttribute("data-animated", "false");
  await page.reload();
  await expect(showcase).toHaveAttribute("data-animated", "false");
  for (const title of await page.locator(".showcase-title-line").all()) {
    expect(await title.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
  }
});

test("the selection and project index work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: test.info().project.use.baseURL,
  });
  const page = await context.newPage();
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".showcase-project")).toHaveCount(5);
  await page
    .locator(".showcase-index")
    .getByRole("link", { name: /Doctors Residence/ })
    .click();
  await expect(page.locator("#selected-doctors-residence h2")).toBeInViewport();
  await page
    .locator("#selected-doctors-residence .showcase-link")
    .press("Enter");
  await expect(page.locator("h1")).toHaveText("Doctors Residence");
  await context.close();
});
