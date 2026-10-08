import { expect, test, type Page } from "@playwright/test";

function lineOffset(page: Page, line: "first" | "second") {
  return page.locator(`.hero-line-${line}`).evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrix(transform).m41;
  });
}

async function scrollOpening(page: Page) {
  const top = await page.locator(".cinema-scroll").evaluate((element) => {
    const hero = element.querySelector<HTMLElement>(".cinema-hero")!;
    return (
      element.getBoundingClientRect().top +
      scrollY +
      ((element as HTMLElement).offsetHeight - hero.offsetHeight) * 0.11
    );
  });
  await page.evaluate(
    (value) => window.scrollTo({ top: value, behavior: "instant" }),
    top,
  );
}

async function expectOpposingDrift(page: Page) {
  await expect.poll(() => lineOffset(page, "first")).toBeLessThan(-1);
  await expect.poll(() => lineOffset(page, "second")).toBeGreaterThan(1);
}

async function expectStaticLines(page: Page) {
  await expect
    .poll(async () => Math.abs(await lineOffset(page, "first")))
    .toBeLessThan(0.01);
  await expect
    .poll(async () => Math.abs(await lineOffset(page, "second")))
    .toBeLessThan(0.01);
}

test("hero lines drift in opposite directions without adding scroll pins", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "reduced-motion");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(
    testInfo.project.name === "desktop" ? 2 : 1,
  );
  await expectStaticLines(page);
  await scrollOpening(page);
  await expectOpposingDrift(page);
  await expect(page.locator(".cinema-opening")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("reduced motion keeps hero lines static and explicit opt-in enables the drift", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: 160, behavior: "instant" }));
  await expectStaticLines(page);
  await page.getByRole("button", { name: /Enable scroll animation/ }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(
    (await page.evaluate(() => innerWidth)) >= 900 ? 2 : 1,
  );
  await scrollOpening(page);
  await expectOpposingDrift(page);
  await page.getByRole("button", { name: /Disable scroll animation/ }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expectStaticLines(page);
  for (const line of await page.locator(".hero-line").all()) {
    await expect(line).toHaveCSS("transform", "none");
  }
});

test("hero line motion clears on route change and restarts on return", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "reduced-motion");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(
    testInfo.project.name === "desktop" ? 2 : 1,
  );
  await scrollOpening(page);
  await expectOpposingDrift(page);
  await page
    .locator(".cinema-opening")
    .getByRole("link", { name: "Explore our work" })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-line")).toHaveCount(0);
  await page.getByRole("link", { name: "Domiorum Architects home" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(
    testInfo.project.name === "desktop" ? 2 : 1,
  );
  await expectStaticLines(page);
  await scrollOpening(page);
  await expectOpposingDrift(page);
});
