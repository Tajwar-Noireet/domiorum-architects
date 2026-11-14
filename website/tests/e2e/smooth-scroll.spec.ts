import { expect, test } from "@playwright/test";

test("wheel over interior photos moves the pinned gallery in both directions", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop" && info.project.name !== "reduced-motion");
  await page.addInitScript(() => sessionStorage.setItem("domiorum-brand-intro-v1", "seen"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  const gallery = page.locator(".interior-pin");
  await gallery.locator(".interior-controls button").first().click();
  const track = gallery.locator(".interior-track");
  const initialY = await page.evaluate(() => scrollY);
  const initialX = await track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  const photo = (await gallery.locator(".interior-room-image").first().boundingBox())!;
  await page.mouse.move(Math.min(photo.x + photo.width / 2, 700), photo.y + photo.height / 2);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialY + 450);
  await expect.poll(() => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(initialX - 450);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(initialY + 250);
  await expect.poll(() => track.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeGreaterThan(initialX - 250);
  await gallery.locator(".interior-controls button").last().click();
  const endY = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(endY + 500);
});

test("wheel scroll eases into GSAP scenes and stops before navigating", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
  await page.goto("/projects");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(page.locator("html")).toHaveClass(/lenis-smooth/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(590);
  await page
    .getByRole("link", { name: "Discover us", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.locator("h1")).toBeInViewport();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.goBack();
  const project = page.locator(".showcase-panel").nth(2);
  await project.click();
  await expect(page).toHaveURL(/\/projects\/edison-interior$/);
});

test("intro locks scrolling and releases the page when playback ends", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".brand-reveal")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  if (page.context().browser()?.browserType().name() === "webkit")
    await page.keyboard.press("PageDown");
  else await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.locator(".cinema-opening h1").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-line").first()).toHaveCSS("opacity", "1");
});
