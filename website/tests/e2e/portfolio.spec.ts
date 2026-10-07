import { expect, test } from "@playwright/test";
import portfolio from "../../src/content/portfolio.json";

test("portfolio uses brand colours and moves with page scrolling", async ({
  page,
}, testInfo) => {
  await page.goto("/projects");
  const showcase = page.locator(".project-showcase");
  expect(
    await showcase.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(8, 24, 46)");
  expect(
    await page
      .locator(".showcase-link")
      .evaluate((el) => getComputedStyle(el).color),
  ).toBe("rgb(225, 191, 119)");
  const top = await showcase.evaluate(
    (el) => el.getBoundingClientRect().top + scrollY,
  );
  const drift = () =>
    page
      .locator(".showcase-frame-0")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await page.evaluate(
    (top) =>
      window.scrollTo({
        top: Math.max(0, top - innerHeight * 0.65),
        behavior: "instant",
      }),
    top,
  );
  if (testInfo.project.name === "reduced-motion") {
    expect(await drift()).toBe(0);
    await page.evaluate(
      (top) => window.scrollTo({ top: top + 200, behavior: "instant" }),
      top,
    );
    expect(await drift()).toBe(0);
  } else {
    await expect.poll(drift).toBeGreaterThan(10);
    const before = await drift();
    await page.evaluate(
      (top) => window.scrollTo({ top: top + 200, behavior: "instant" }),
      top,
    );
    await expect.poll(async () => before - (await drift())).toBeGreaterThan(25);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(drift).toBe(0);
  }
  if (testInfo.project.name === "desktop") {
    await showcase.screenshot({
      path: "../output/website-review/portfolio-brand-scroll.png",
    });
  }
});

test("all five project selectors, covers and gallery links work", async ({
  page,
}, testInfo) => {
  await page.goto("/projects");
  for (const project of portfolio) {
    await page
      .getByRole("button", { name: `Show ${project.title}`, exact: true })
      .press("Enter");
    await expect(page.locator(".showcase-title")).toContainText(
      project.title.split(" ")[0],
    );
    const link = page.getByRole("link", { name: "View project", exact: true });
    await expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
    const images = page.locator(".showcase-frame img");
    await expect(images).toHaveCount(
      project.category === "Architecture" ? 1 : 3,
    );
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (
      testInfo.project.name === "mobile" &&
      project.slug === "ruap-interior"
    ) {
      await page
        .locator(".project-showcase")
        .screenshot({ path: "../output/website-review/portfolio-mobile.png" });
    }
    await link.click();
    await expect(page.locator("h1")).toHaveText(project.title);
    await expect(page.locator("#rooms figure")).toHaveCount(
      project.images.length,
    );
    await page.getByRole("link", { name: "All projects" }).click();
  }
  await page
    .getByRole("button", { name: "Previous project", exact: true })
    .click();
  await expect(page.locator(".showcase-title")).toContainText("RUAP");
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await expect(page.locator(".showcase-title")).toContainText("Aftabnagar");
});

test("project transitions respect reduced motion and finish with visible images", async ({
  page,
}, testInfo) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Show Edison", exact: true }).click();
  await expect(page.locator(".showcase-title")).toContainText("Edison");
  await expect
    .poll(() =>
      page
        .locator(".showcase-frame-1")
        .evaluate((el) => getComputedStyle(el).clipPath),
    )
    .toBe("inset(0%)");
  if (testInfo.project.name === "reduced-motion") {
    await expect(page.locator(".project-showcase")).toHaveAttribute(
      "data-animated",
      "false",
    );
    expect(
      await page
        .locator(".showcase-project")
        .evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
  } else {
    await expect(page.locator(".project-showcase")).toHaveAttribute(
      "data-animated",
      "true",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".project-showcase")).toHaveAttribute(
      "data-animated",
      "false",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".project-showcase")).toHaveAttribute(
      "data-animated",
      "true",
    );
  }
});
