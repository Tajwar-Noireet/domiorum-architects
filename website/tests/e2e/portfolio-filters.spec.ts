import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
});

for (const route of ["/", "/projects"]) {
  test(`portfolio filters keep project links and scrolling intact on ${route}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator(".cinema-frame-note")).toHaveCount(0);
    const filters = page.getByRole("group", { name: "Filter projects" });
    const cards = page.locator(".showcase-project");
    await expect(cards).toHaveCount(6);
    await filters
      .getByRole("button", { name: "Interiors", exact: true })
      .click();
    await expect(cards).toHaveCount(5);
    await expect(page.locator(".showcase-index")).not.toContainText(
      "Doctors Residence",
    );
    await filters
      .getByRole("button", { name: "Exteriors", exact: true })
      .click();
    await expect(cards).toHaveCount(1);
    await expect(cards).toContainText("Doctors Residence");
    await expect(page.locator(".project-showcase")).toHaveAttribute(
      "data-stack",
      "false",
    );
    await page
      .getByRole("link", { name: "Open Doctors Residence", exact: true })
      .click();
    await expect(page).toHaveURL(/\/projects\/doctors-residence$/);
    await expect(page.locator(".project-heading .eyebrow")).toContainText(
      "Exteriors",
    );
    await page.goBack();
    await filters.getByRole("button", { name: "All", exact: true }).click();
    await expect(cards).toHaveCount(6);
    const desktop = ["desktop", "reduced-motion"].includes(info.project.name);
    if (desktop) {
      await expect(page.locator(".project-showcase")).toHaveAttribute(
        "data-stack",
        "true",
      );
      await page
        .locator(".showcase-index a")
        .filter({ hasText: "RUAP" })
        .click();
      await expect(
        page.locator(".showcase-index a").filter({ hasText: "RUAP" }),
      ).toHaveAttribute("aria-current", "true");
      await expect(page.locator("#selected-ruap-interior")).not.toHaveAttribute(
        "aria-hidden",
        "true",
      );
      await page
        .locator(".showcase-index a")
        .filter({ hasText: "Aftabnagar" })
        .click();
      await expect(
        page.locator(".showcase-index a").filter({ hasText: "Aftabnagar" }),
      ).toHaveAttribute("aria-current", "true");
      await expect(
        page.locator("#selected-aftabnagar-interior"),
      ).not.toHaveAttribute("aria-hidden", "true");
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("Discover shows only the smaller co-founder profile", async ({
  page,
}, info) => {
  await page.goto("/discover");
  await expect(page.locator(".discover-bio .eyebrow")).toHaveText(
    "Co-founder & Principal Architect",
  );
  const portrait = page.locator(".discover-portrait");
  const portraitWidth = await portrait.evaluate(
    (el) => el.getBoundingClientRect().width,
  );
  expect(portraitWidth).toBeLessThanOrEqual(
    info.project.name === "mobile" || info.project.name === "android"
      ? 260
      : 360,
  );
  await expect(
    page.getByRole("group", { name: "Filter projects" }),
  ).toHaveCount(0);
  await expect(
    page.locator(
      "main .project-collection, main .project-card, main .discover-work",
    ),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  if (info.project.name === "desktop") {
    await portrait.scrollIntoViewIfNeeded();
    await expect(page.locator(".discover-bio")).toHaveCSS("transform", "none");
    await page.screenshot({
      path: "../output/website-review/co-founder-profile-desktop.png",
    });
  }
});

test("Mirpur DOHS pictures lead the homepage hero sequence", async ({
  page,
}, info) => {
  await page.goto("/");
  const preview = page.locator(".cinema-preview img");
  await expect(preview).toHaveAttribute("src", /mirpur-dohs-interior/);
  const scenes = page.locator(".cinema-scene img");
  await expect(scenes).toHaveCount(3);
  for (const image of await scenes.all()) {
    await expect(image).toHaveAttribute("src", /mirpur-dohs-interior/);
    await expect(image).toHaveAttribute("alt", /Mirpur DOHS/);
  }
  await expect
    .poll(() =>
      preview.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  if (info.project.name === "desktop") {
    await expect(page.locator(".hero-line-first")).toHaveCSS("opacity", "1");
    await page.screenshot({
      path: "../output/website-review/mirpur-hero-desktop.png",
    });
  }
});

test("Let’s talk replaces Contact and preserves existing enquiry links", async ({
  page,
  request,
}) => {
  const redirect = await request.get("/contact", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/book-consultation");
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/book-consultation$/);
  await expect(page.locator(".enquiry-form")).toBeVisible();
  await expect(page.locator("a[href='/contact']")).toHaveCount(0);
  await expect(
    page.locator(".consultation-contact a[href^='mailto:']"),
  ).toHaveAttribute("href", "mailto:nawar.zarin.29@gmail.com");
  await page.goto("/");
  const invitation = page.getByRole("link", {
    name: "Tell us about your project",
  });
  await invitation.click();
  await expect(page).toHaveURL(/\/book-consultation$/);
});
