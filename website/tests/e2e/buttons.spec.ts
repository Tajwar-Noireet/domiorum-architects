import { expect, test } from "@playwright/test";

test("button hover animates and resets with automatic scroll motion", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  const button = page.getByRole("link", {
    name: "Explore our work",
    exact: true,
  });
  await button.hover();
  await expect
    .poll(() =>
      button.evaluate(
        (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeLessThan(-2.9);
  expect(
    await button.evaluate(
      (el) => getComputedStyle(el, "::before").transitionDuration,
    ),
  ).not.toBe("0s");
  await expect
    .poll(() =>
      button
        .locator(".flow-arrow-in")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
  await page.screenshot({ path: "../output/website-review/button-hover.png" });
  await page.mouse.move(5, 5);
  await expect
    .poll(() =>
      button.evaluate((el) =>
        Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42),
      ),
    )
    .toBeLessThan(0.1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await button.hover();
  expect(
    await button.evaluate((el) =>
      parseFloat(getComputedStyle(el).transitionDuration),
    ),
  ).toBeLessThanOrEqual(0.00001);
  expect(await button.evaluate((el) => getComputedStyle(el).transform)).toBe(
    "none",
  );
});
