import { expect, test, type Page } from "@playwright/test";

async function placeAt(page: Page, selector: string, viewportFraction: number) {
  await page.locator(selector).evaluate((element, fraction) => {
    window.scrollTo({
      top:
        element.getBoundingClientRect().top + scrollY - innerHeight * fraction,
      behavior: "instant",
    });
  }, viewportFraction);
}

async function titleOffset(page: Page) {
  return page
    .locator("#introduction [data-title-line]")
    .first()
    .evaluate(
      (element) => new DOMMatrix(getComputedStyle(element).transform).m42,
    );
}

test("native scrolling reveals titles, opens photo frames and reads the paragraph", async ({
  page,
}, info) => {
  test.skip(info.project.name === "reduced-motion");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(
    info.project.name === "desktop" ? 2 : 1,
  );
  await placeAt(page, "#introduction [data-scroll-title]", 0.97);
  await expect.poll(() => titleOffset(page)).toBeGreaterThan(10);
  await placeAt(page, "#introduction [data-scroll-title]", 0.5);
  await expect
    .poll(async () => Math.abs(await titleOffset(page)))
    .toBeLessThan(0.5);
  await expect(page.locator("#introduction h2")).toHaveText(
    "A home begins with you.",
  );

  const frame = page.locator(".perspective-wide");
  await placeAt(page, ".perspective-wide", 0.97);
  const scale = () =>
    frame
      .locator("img")
      .evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m11,
      );
  await expect.poll(scale).toBeGreaterThan(1.18);
  await expect
    .poll(() => frame.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toBe("inset(0%)");
  await placeAt(page, ".perspective-wide", 0);
  await expect.poll(scale).toBeLessThan(1.18);
  await expect
    .poll(() => frame.evaluate((element) => getComputedStyle(element).clipPath))
    .toBe("inset(0%)");

  const words = page.locator("#introduction [data-scroll-word]");
  await placeAt(page, "#introduction [data-scroll-words]", 0.95);
  await expect(words.last()).toHaveCSS("color", "rgb(88, 99, 108)");
  await placeAt(page, "#introduction [data-scroll-words]", 0.25);
  await expect(words.last()).toHaveCSS("color", "rgb(41, 49, 58)");
  await expect(page.locator("#introduction [data-scroll-words]")).toHaveText(
    "Where you gather, how you work, what you need to store. We begin with the everyday details and build the design around them.",
  );
  expect(errors).toEqual([]);
});

test("live device preferences enable editorial motion and restore readable content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const line of await page.locator("[data-title-line]").all()) {
    await expect(line).toHaveCSS("transform", "none");
  }
  await expect(page.locator(".perspective-wide")).toHaveCSS(
    "clip-path",
    "none",
  );
  await expect(
    page.locator("#introduction [data-scroll-word]").last(),
  ).toHaveCSS("color", "rgb(41, 49, 58)");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".home-experience")).toHaveAttribute(
    "data-motion",
    "on",
  );
  await placeAt(page, "#introduction [data-scroll-title]", 0.97);
  await expect.poll(() => titleOffset(page)).toBeGreaterThan(10);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".perspective-wide")).toHaveCSS(
    "clip-path",
    "none",
  );
  for (const line of await page.locator("[data-title-line]").all()) {
    await expect(line).toHaveCSS("transform", "none");
  }
  await placeAt(page, "#studio h2", 0.4);
  await expect(page.locator("#studio h2")).toHaveText(
    "Let’s make your home your own.",
  );
  await page
    .locator("#studio")
    .getByRole("link", { name: "Discover us" })
    .click();
  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Zarin Nawar" }),
  ).toBeVisible();
});

test("narrow and landscape layouts reveal intact headings without overflow", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 900, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator(".pin-spacer")).toHaveCount(
      viewport.width < 900 ? 1 : 2,
    );
    for (const selector of [
      "#introduction [data-scroll-title]",
      "#studio [data-scroll-title]",
    ]) {
      await placeAt(page, selector, 0.3);
      const lines = page.locator(`${selector} [data-title-line]`);
      for (const line of await lines.all()) {
        await expect
          .poll(() =>
            line.evaluate((element) =>
              Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42),
            ),
          )
          .toBeLessThan(0.5);
        const bounds = await line.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(-1);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
          viewport.width + 1,
        );
      }
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
});
