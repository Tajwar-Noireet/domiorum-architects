import { expect, test } from "@playwright/test";

test("compact project buttons keep their label clear of both arrows", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop" && info.project.name !== "reduced-motion");
  await page.setViewportSize({ width: 1366, height: 650 });
  await page.addInitScript(() => sessionStorage.setItem("domiorum-brand-intro-v1", "seen"));
  await page.goto("/projects");
  const showcase = page.locator(".project-showcase");
  await expect(showcase).toHaveAttribute("data-stack", "true");
  await showcase.locator(".showcase-index a").nth(1).click();
  const button = showcase.locator(".showcase-project").nth(1).getByRole("link", { name: "View project", exact: true });
  await expect(button).toBeInViewport();
  await page.mouse.move(5, 5);
  const label = button.locator(".flow-label");
  const outgoing = button.locator(".flow-arrow-out");
  await expect(outgoing).toHaveCSS("opacity", "1");
  await expect.poll(async () => {
    const text = (await label.boundingBox())!;
    return (await outgoing.boundingBox())!.x - text.x - text.width;
  }).toBeGreaterThan(6);
  await button.hover();
  const incoming = button.locator(".flow-arrow-in");
  await expect(incoming).toHaveCSS("opacity", "1");
  await expect.poll(async () => {
    const arrow = (await incoming.boundingBox())!;
    return (await label.boundingBox())!.x - arrow.x - arrow.width;
  }).toBeGreaterThan(6);
  if (info.project.name === "desktop")
    await page.screenshot({ path: "../output/website-review/project-button-spacing.png" });
  await button.focus();
  await page.mouse.move(5, 5);
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await expect(incoming).toHaveCSS("opacity", "1");
  const destination = await button.getAttribute("href");
  await button.click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
});

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
  await expect.poll(() => button.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(-2.9);
});
