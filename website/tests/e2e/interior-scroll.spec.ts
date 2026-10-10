import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
});

test("horizontal and diagonal wheel gestures move the pinned room gallery", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop" && info.project.name !== "reduced-motion",
  );
  await page.goto("/");
  const gallery = page.locator(".interior-pin");
  const buttons = gallery.locator(".interior-controls button");
  const track = gallery.locator(".interior-track");
  await buttons.first().click();
  const startY = await page.evaluate(() => scrollY);
  const startX = await track.evaluate(
    (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
  );
  const photo = (await gallery
    .locator(".interior-room-image")
    .first()
    .boundingBox())!;
  await page.mouse.move(photo.x + photo.width / 2, photo.y + photo.height / 2);
  await page.mouse.wheel(500, 0);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(startY + 450);
  await expect
    .poll(() =>
      track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
    )
    .toBeLessThan(startX - 450);
  if (info.project.name === "desktop")
    await page.screenshot({
      path: "../output/website-review/interior-scroll-fixed-desktop.png",
    });
  await page.mouse.wheel(-300, 20);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeLessThan(startY + 250);
  await expect
    .poll(() =>
      track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
    )
    .toBeGreaterThan(startX - 250);
  await buttons.last().click();
  const endY = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(endY + 500);
});

test("room controls fit a laptop screen and wheel routing survives resizing", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const buttons = page.locator(".interior-controls button");
  const viewport = page.locator(".interior-viewport");
  await buttons.first().click();
  const controls = (await page.locator(".interior-controls").boundingBox())!;
  expect(controls.y + controls.height).toBeLessThanOrEqual(720);
  await page.setViewportSize({ width: 800, height: 720 });
  await expect(viewport).not.toHaveAttribute("data-pinned", "true");
  await expect
    .poll(() =>
      page
        .locator(".interior-track")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
    )
    .toBe(0);
  await viewport.scrollIntoViewIfNeeded();
  const bounds = (await viewport.boundingBox())!;
  await page.mouse.move(bounds.x + 300, bounds.y + 200);
  await page.mouse.wheel(600, 0);
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(400);
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(viewport).toHaveAttribute("data-pinned", "true");
  await buttons.first().click();
  const start = await page.evaluate(() => scrollY);
  const photo = (await page
    .locator(".interior-room-image")
    .first()
    .boundingBox())!;
  await page.mouse.move(photo.x + 300, photo.y + 150);
  await page.mouse.wheel(500, 0);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(start + 450);
  await page.setViewportSize({ width: 1280, height: 480 });
  await expect(viewport).not.toHaveAttribute("data-pinned", "true");
  await buttons.last().click();
  await expect(buttons.last()).toHaveAttribute("aria-pressed", "true");
  await page.goto("/services");
  await page.goBack();
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(viewport).toHaveAttribute("data-pinned", "true");
  await buttons.first().click();
  const restoredY = await page.evaluate(() => scrollY);
  const restoredPhoto = (await page
    .locator(".interior-room-image")
    .first()
    .boundingBox())!;
  await page.mouse.move(restoredPhoto.x + 300, restoredPhoto.y + 150);
  await page.mouse.wheel(500, 0);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(restoredY + 450);
});

test("phones keep native horizontal scrolling and chapter controls", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile" && info.project.name !== "android");
  await page.goto("/");
  const viewport = page.locator(".interior-viewport");
  await expect(viewport).not.toHaveAttribute("data-pinned", "true");
  await viewport.scrollIntoViewIfNeeded();
  const bounds = (await viewport.boundingBox())!;
  if (info.project.name === "android") {
    const touch = await page.context().newCDPSession(page);
    const x = bounds.x + bounds.width - 30;
    const y = bounds.y + 200;
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let distance = 20; distance <= 280; distance += 20) {
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - distance, y }],
      });
    }
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touch.detach();
  } else {
    // Playwright cannot send wheel or swipe input to mobile WebKit.
    // Exercise its native scroll container and chapter state via the browser API.
    await viewport.evaluate((el) =>
      el.scrollBy({ left: 600, behavior: "smooth" }),
    );
  }
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(200);
  await page.locator(".interior-controls button").last().click();
  await expect(
    page.locator(".interior-controls button").last(),
  ).toHaveAttribute("aria-pressed", "true");
});
