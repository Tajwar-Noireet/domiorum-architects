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
  await expect(page.locator(".project-showcase")).toHaveAttribute(
    "data-stack",
    "true",
  );
  await page.locator(".showcase-index a").nth(2).click();
  await expect(page.locator(".showcase-project").nth(2)).not.toHaveAttribute(
    "inert",
    "",
  );
});

test("short laptop windows retain large animated project covers", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.setViewportSize({ width: 1366, height: 650 });
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
  await page.goto("/projects");
  const showcase = page.locator(".project-showcase");
  await expect(showcase).toHaveAttribute("data-stack", "true");
  await showcase.locator(".showcase-index a").nth(1).click();
  const card = showcase.locator(".showcase-project").nth(1);
  await expect(card).not.toHaveAttribute("inert", "");
  const cover = card.locator(".showcase-cover");
  await expect
    .poll(async () => (await cover.boundingBox())!.width)
    .toBeGreaterThan(650);
  const bounds = (await card.boundingBox())!;
  expect(bounds.y).toBeGreaterThan(100);
  expect(bounds.y + bounds.height).toBeLessThan(650);
  await expect(
    card.getByRole("link", { name: "View project", exact: true }),
  ).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(showcase).toHaveAttribute("data-stack", "true");
  await expect(card).not.toHaveAttribute("inert", "");
});

test("intro locks scrolling and releases the page on dismissal", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".brand-reveal")).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  if (page.context().browser()?.browserType().name() === "webkit")
    await page.keyboard.press("PageDown");
  else await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.locator(".cinema-opening h1").scrollIntoViewIfNeeded();
  await expect(page.locator(".hero-line").first()).toHaveCSS("opacity", "1");
});
