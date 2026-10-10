import { expect, test } from "@playwright/test";

const key = "domiorum-brand-intro-v1";

test("the supplied reveal plays, releases the page and does not replay in the session", async ({
  page,
}, info) => {
  const errors: string[] = [];
  let reloading = false;
  page.on("pageerror", (error) => {
    // WebKit can report a successful RSC prefetch as an access-control error
    // when this test reloads and destroys the document consuming that response.
    const cancelledReloadPrefetch =
      reloading &&
      page.context().browser()?.browserType().name() === "webkit" &&
      /\?_rsc=.*due to access control checks\.$/.test(error.message);
    if (!cancelledReloadPrefetch) errors.push(error.message);
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", {
    name: "Welcome to Domiorum Architects",
  });
  await expect(intro).toBeVisible();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", true);
  const video = page.locator(".brand-reveal-video");
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("playsInline", true);
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0.2);
  // Dismissing the film must not start a second invisible-text waiting period.
  const heroLines = page.locator(".hero-line");
  await expect(heroLines).toHaveCount(2);
  for (const line of await heroLines.all()) {
    await expect(line).toHaveCSS("opacity", "1");
  }
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(2.6);
  await video.evaluate((v) => (v as HTMLVideoElement).pause());
  await page.screenshot({
    path: `../output/website-review/brand-reveal-${info.project.name}.png`,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const bounds = await page
    .getByRole("button", { name: "Skip intro" })
    .boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  await video.evaluate((v) => (v as HTMLVideoElement).play());
  await expect(intro).toBeHidden({ timeout: 6000 });
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
  await expect(page.locator("main h1")).toBeVisible();
  expect(await page.evaluate((k) => sessionStorage.getItem(k), key)).toBe(
    "seen",
  );
  await page
    .getByRole("link", { name: "Explore our work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(intro).toBeHidden();
  await page.waitForLoadState("networkidle");
  reloading = true;
  await page.reload();
  reloading = false;
  await expect(page.locator("main h1")).toBeVisible();
  await expect(intro).toBeHidden();
  await expect(video).not.toHaveAttribute("src");
  expect(errors).toEqual([]);
});

test("Skip intro and Escape release keyboard focus and scrolling", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
  await page.evaluate((k) => sessionStorage.removeItem(k), key);
  await page.reload();
  await expect(page.getByRole("button", { name: "Skip intro" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 250));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
});

test("a video error never traps the page", async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      const playback = play.call(this);
      this.dispatchEvent(new Event("error"));
      return playback;
    };
  });
  await page.goto("/projects");
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
  await page.locator(".showcase-index a").first().click();
  await expect(page.locator(".showcase-cover img").first()).toBeVisible();
});

test("blocked autoplay and unavailable session storage have working fallbacks", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage unavailable", "SecurityError");
    };
  });
  await page.goto("/discover");
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
});

test("the brand reveal follows the client full-motion choice on every device setting", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".brand-reveal")).toBeVisible();
  await expect(page.locator(".brand-reveal-video")).toHaveAttribute(
    "src",
    "/brand/brand-reveal.mp4",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
  await page.reload();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator(".brand-reveal-video")).not.toHaveAttribute("src");
});

test("the website remains usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await page
    .getByRole("link", { name: "Explore our work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await context.close();
});

test("a stalled video startup opens the website within its fallback deadline", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => new Promise<void>(() => {});
  });
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible({ timeout: 4500 });
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
});

test("failed hydration cannot leave the server-rendered site covered", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible({ timeout: 11000 });
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator("#site-shell")).toHaveJSProperty("inert", false);
  await expect(page.locator(".brand-reveal-video")).not.toHaveAttribute("src");
});
