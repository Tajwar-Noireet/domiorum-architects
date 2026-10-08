import { expect, test } from "@playwright/test";

test("text hover resets and follows live motion preferences", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/services");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  const title = page.locator("h1 .hover-text");
  const offset = () =>
    title.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await title.hover();
  await expect.poll(offset).toBeLessThan(-2);
  await page.mouse.move(5, 5);
  await expect.poll(async () => Math.abs(await offset())).toBeLessThan(0.1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await title.hover();
  await expect.poll(offset).toBeLessThan(-2);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(5, 5);
  await title.hover();
  await expect.poll(offset).toBeLessThan(-2);
});

const routes = [
  "/",
  "/projects",
  "/projects/selim-residence",
  "/projects/aftabnagar-interior",
  "/projects/doctors-residence",
  "/projects/edison-interior",
  "/projects/mirpur-dohs-interior",
  "/projects/ruap-interior",
  "/services",
  "/discover",
  "/contact",
  "/book-consultation",
  "/careers",
  "/privacy",
];

test("all pages load with usable images and no overflow or runtime errors", async ({
  context,
  request,
}) => {
  // Each fresh tab can play the first-visit reveal before its route checks.
  test.setTimeout(180_000);
  const errors: string[] = [];
  const checkedAssets = new Set<string>();
  for (const route of routes) {
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`${route}: ${error.message}`));
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    const images = page.locator("main img");
    for (const image of await images.all()) {
      if (await image.isVisible()) {
        const source = new URL((await image.getAttribute("src"))!, page.url());
        const asset = source.searchParams.get("url") ?? source.pathname;
        expect(asset).not.toMatch(
          /\/projects\/(abed|doctors)\/|living-entry\.webp/,
        );
        if (!checkedAssets.has(asset)) {
          const assetResponse = await request.get(asset);
          expect(assetResponse.status(), asset).toBe(200);
          checkedAssets.add(asset);
        }
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBe(true);
    page.removeAllListeners("pageerror");
    await page.close();
  }
  expect(errors).toEqual([]);
});

test("interior portfolio and project navigation work without removed imagery", async ({
  page,
  request,
}) => {
  await page.goto("/projects");
  await expect(page.locator(".showcase-index a")).toHaveCount(5);
  await expect(page.locator(".project-filters")).toHaveCount(0);
  await page
    .getByRole("link", { name: "View project", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/aftabnagar-interior$/);
  await expect(page.locator(".project-facts")).toContainText(
    "Design visualizations",
  );
  await page.getByRole("link", { name: /All projects/ }).click();
  await expect(page).toHaveURL("/projects");
  await expect(page.locator(".showcase-index a")).toHaveCount(5);
  for (const slug of ["abed-residence"]) {
    expect((await request.get(`/projects/${slug}`)).status()).toBe(404);
  }
  expect(
    (await request.get("/images/projects/selim/living-entry.webp")).status(),
  ).toBe(404);
});

test("enquiry validation and email draft preserve the supplied details", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare my enquiry" }).click();
  await expect(page.locator(".email-draft")).toHaveCount(0);
  await page.getByLabel("Your name").fill("Test client");
  await page.getByLabel("Email address").fill("client@example.com");
  await page.getByLabel("Project location").fill("Dhaka");
  await page.getByLabel("Approximate area").fill("1,800 sq ft");
  await page.getByLabel("Preferred timing").fill("Early 2027");
  await page.getByRole("combobox", { name: "I’m interested in" }).click();
  await page.getByRole("option", { name: "Renovation or extension" }).click();
  await page
    .getByLabel("A little about your project")
    .fill("A family apartment with more storage & natural light.");
  await page.getByRole("button", { name: "Prepare my enquiry" }).click();
  const draft = page.getByLabel("Prepared enquiry text");
  await expect(draft).toHaveValue(
    /Test client[\s\S]*client@example.com[\s\S]*Renovation or extension[\s\S]*more storage & natural light/,
  );
  const mail = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(decodeURIComponent(mail!)).toContain(
    "A family apartment with more storage & natural light.",
  );
  expect(decodeURIComponent(mail!)).toContain("Approximate area: 1,800 sq ft");
  expect(decodeURIComponent(mail!)).toContain("Preferred timing: Early 2027");
  await expect(page.locator(".email-draft")).toContainText(
    "Please send the email",
  );
});

test("consultation request makes its booking status clear", async ({
  page,
}) => {
  await page.goto("/book-consultation");
  await expect(page.locator(".consultation-note")).toContainText(
    "Consultations are paid",
  );
  await expect(
    page.getByRole("combobox", { name: "I’m interested in" }),
  ).toHaveText("Initial consultation");
  await expect(page.locator(".consultation-note")).toContainText(
    "does not confirm a booking",
  );
});

test("mobile menu works with keyboard dismissal and route navigation", async ({
  page,
}, testInfo) => {
  test.skip(!["mobile", "android"].includes(testInfo.project.name));
  await page.goto("/");
  const trigger = page.locator("button[aria-controls='mobile-navigation']");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Projects/ })
    .click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator("#mobile-navigation")).toBeHidden();
});

test("scroll scenes expand, change, release and survive route navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(
    ["desktop", "reduced-motion"].includes(testInfo.project.name) ? 2 : 1,
  );
  const travel = await page.evaluate(
    () => window.innerHeight * (window.innerWidth >= 900 ? 2.2 : 1.5),
  );
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: "instant" }),
    travel * 0.55,
  );
  await expect
    .poll(() =>
      page
        .locator(".cinema-scene-1")
        .evaluate((el) => getComputedStyle(el).clipPath),
    )
    .toBe("inset(0%)");
  await expect
    .poll(() =>
      page
        .locator(".cinema-frame")
        .evaluate((el) => getComputedStyle(el).clipPath),
    )
    .toBe("inset(0%)");
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: "instant" }),
    travel * 0.91,
  );
  await expect
    .poll(() =>
      page
        .locator(".cinema-scene-2")
        .evaluate((el) => getComputedStyle(el).clipPath),
    )
    .toBe("inset(0%)");
  await page.evaluate(
    (top) =>
      window.scrollTo({ top: top + innerHeight * 0.65, behavior: "instant" }),
    travel,
  );
  await expect(page.locator("#introduction")).toBeInViewport();
  await page.getByRole("link", { name: "The portfolio" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("link", { name: "Domiorum Architects home" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(
    ["desktop", "reduced-motion"].includes(testInfo.project.name) ? 2 : 1,
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
});

test("full motion remains active without a site toggle", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await page.goto("/");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await expect(page.getByRole("button", { name: /Enable motion|Motion on/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.getByRole("link", { name: "Scroll to explore" }).click();
  await expect(page.locator("#introduction")).toBeInViewport();
});

test("gallery buttons reach each room with and without animation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /03.*Kitchens & storage/ }).click();
  await expect
    .poll(() =>
      page
        .locator(".interior-room")
        .nth(2)
        .evaluate((el) => {
          const bounds = el.getBoundingClientRect();
          return (
            bounds.left >= -1 &&
            bounds.left < window.innerWidth * 0.4 &&
            bounds.right <= window.innerWidth + 1
          );
        }),
    )
    .toBe(true);
  await page.getByRole("button", { name: /01.*Living & dining/ }).click();
  await expect
    .poll(() =>
      page
        .locator(".interior-room")
        .nth(0)
        .evaluate((el) => el.getBoundingClientRect().left >= -1),
    )
    .toBe(true);
  if (testInfo.project.name === "desktop") {
    await page.getByRole("button", { name: /03.*Kitchens & storage/ }).click();
    await page.screenshot({
      path: "../output/website-review/interior-gallery.png",
    });
  }
});

test("unknown project has a recoverable 404", async ({ page }) => {
  const response = await page.goto("/projects/unknown-project");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Back to the homepage" }).click();
  await expect(page).toHaveURL("/");
});

test("narrow phones keep page headings and forms inside the viewport", async ({
  page,
}, testInfo) => {
  test.skip(!["mobile", "android"].includes(testInfo.project.name));
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of [
    "/",
    "/services",
    "/discover",
    "/contact",
    "/book-consultation",
    "/careers",
    "/projects/selim-residence",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
});
