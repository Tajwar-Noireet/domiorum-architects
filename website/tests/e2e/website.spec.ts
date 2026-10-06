import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/projects",
  "/projects/selim-residence",
  "/projects/abed-residence",
  "/projects/doctors-residence",
  "/services",
  "/contact",
  "/book-consultation",
  "/careers",
  "/privacy",
];

test("all pages load with usable images and no overflow or runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    const images = page.locator("main img");
    for (const image of await images.all()) {
      if (await image.isVisible()) {
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
  }
  expect(errors).toEqual([]);
});

test("project filters and the shared project template work", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByRole("button", { name: /^Interiors/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("link", { name: /Selim Residence/ }).click();
  await expect(page).toHaveURL(/\/projects\/selim-residence$/);
  await expect(page.locator(".project-facts")).toContainText(
    "Innova Architects",
  );
  await page.getByRole("link", { name: /Next project/ }).click();
  await expect(page.locator("h1")).toHaveText("Abed Residence");
  await page.getByRole("link", { name: "All projects" }).click();
  await page.getByRole("button", { name: /^Architecture/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
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
  await page
    .getByLabel("I’m interested in")
    .selectOption("Renovation or extension");
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
  await expect(page.getByLabel("I’m interested in")).toHaveValue(
    "Initial consultation",
  );
  await expect(page.locator(".consultation-note")).toContainText(
    "does not confirm a booking",
  );
});

test("mobile menu works with keyboard dismissal and route navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
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

test("scroll scenes change, release cleanly and survive route navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator(".hero-scene-1")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.95);
  await page.evaluate(() =>
    window.scrollTo({ top: 1450, behavior: "instant" }),
  );
  await expect
    .poll(() =>
      page
        .locator(".hero-scene-2")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.95);
  await page.evaluate(() =>
    window.scrollTo({ top: 2300, behavior: "instant" }),
  );
  await expect(page.locator("#introduction")).toBeInViewport();
  await page.getByRole("link", { name: "View all projects" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("link", { name: "Domiorum Architects home" }).click();
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("small screens and reduced motion keep ordinary scrolling", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "desktop");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("link", { name: "Scroll to explore" }).click();
  await expect(page.locator("#introduction")).toBeInViewport();
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
  test.skip(testInfo.project.name !== "mobile");
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of [
    "/",
    "/services",
    "/contact",
    "/book-consultation",
    "/careers",
    "/projects/doctors-residence",
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
