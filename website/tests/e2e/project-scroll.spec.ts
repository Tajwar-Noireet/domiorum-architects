import { expect, test, type Locator, type Page } from "@playwright/test";
import portfolio from "../../src/content/portfolio.json";

const mirpur = portfolio.find(
  (project) => project.slug === "mirpur-dohs-interior",
)!;
const sceneCount = Math.ceil(mirpur.images.length / 2);

async function scrollTo(page: Page, top: number) {
  await page.evaluate(
    (value) => window.scrollTo({ top: value, behavior: "instant" }),
    top,
  );
}

async function expectImagesLoaded(images: Locator) {
  await expect
    .poll(
      () =>
        images.evaluateAll((elements) =>
          elements.every((element) => {
            const image = element as HTMLImageElement;
            return image.complete && image.naturalWidth > 0;
          }),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
}

async function galleryTravel(page: Page) {
  return page.locator("#rooms").evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    travel: (element as HTMLElement).offsetHeight - innerHeight,
    viewportHeight: innerHeight,
  }));
}

async function expectNaturalGallery(page: Page) {
  const gallery = page.locator("#rooms");
  await expect(gallery).toHaveAttribute("data-animated", "false");
  await expect(gallery.locator(".project-gallery-viewport")).toHaveCSS(
    "position",
    "static",
  );
  await expect(gallery.locator(".project-gallery-controls")).toHaveCount(0);
  for (const scene of await gallery.locator(".project-gallery-scene").all()) {
    await expect(scene).toHaveCSS("position", "relative");
    await expect(scene).not.toHaveAttribute("aria-hidden", "true");
    expect(
      await scene.evaluate((element) => (element as HTMLElement).inert),
    ).toBe(false);
  }
  for (const figure of await gallery.locator("figure").all()) {
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toBeInViewport();
    await expectImagesLoaded(figure.locator("img"));
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("project spaces reveal on scroll, accept keyboard selection and release the viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/projects/mirpur-dohs-interior");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toHaveText(mirpur.title);
  const gallery = page.locator("#rooms");
  await expect(gallery.locator("figure")).toHaveCount(11);
  await expect(gallery.locator(".project-gallery-scene")).toHaveCount(
    sceneCount,
  );

  await expect(gallery).toHaveAttribute("data-animated", "true");
  const space = await galleryTravel(page);
  await scrollTo(page, space.top);
  const viewport = gallery.locator(".project-gallery-viewport");
  await expect(viewport).toHaveCSS("position", "sticky");
  await expect
    .poll(() =>
      viewport.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().top),
      ),
    )
    .toBeLessThan(2);
  const first = gallery.locator('[data-scene="0"]');
  await expect(first).not.toHaveAttribute("aria-hidden", "true");
  await expect(
    first.getByRole("heading", { name: mirpur.images[0].caption }),
  ).toBeVisible();
  await expectImagesLoaded(first.locator("img"));

  const second = gallery.locator('[data-scene="1"]');
  const secondPrimary = second.locator(".project-gallery-primary");
  const reveal = () =>
    secondPrimary.evaluate((element) =>
      parseFloat(getComputedStyle(element).getPropertyValue("--scene-reveal")),
    );
  await expect.poll(reveal).toBeLessThan(0.1);
  const initialMask = await secondPrimary.evaluate(
    (element) => getComputedStyle(element).maskImage,
  );
  expect(initialMask).toContain("repeating-linear-gradient");
  if (testInfo.project.name === "desktop") {
    await page.screenshot({
      path: "../output/website-review/elyse-scroll-first.png",
    });
  }

  await scrollTo(page, space.top + (space.travel * 0.55) / (sceneCount - 1));
  await expect.poll(reveal).toBeGreaterThan(40);
  await expect.poll(reveal).toBeLessThan(48);
  await expectImagesLoaded(second.locator("img"));
  if (testInfo.project.name === "desktop") {
    await page.screenshot({
      path: "../output/website-review/elyse-scroll-transition.png",
    });
  }

  await scrollTo(page, space.top + space.travel / (sceneCount - 1));
  await expect(
    gallery.locator(".project-gallery-controls button").nth(1),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(second).not.toHaveAttribute("aria-hidden", "true");
  await expect(first).toHaveAttribute("aria-hidden", "true");
  await expect.poll(reveal).toBeGreaterThan(99.9);
  expect(
    await secondPrimary.evaluate(
      (element) => getComputedStyle(element).maskImage,
    ),
  ).not.toBe(initialMask);
  await expect(
    second.getByRole("heading", { name: mirpur.images[2].caption }),
  ).toBeVisible();
  await expectImagesLoaded(second.locator("img"));
  if (testInfo.project.name === "desktop") {
    await page.screenshot({
      path: "../output/website-review/elyse-scroll-second.png",
    });
  }

  const nextSpace = gallery.locator(".project-gallery-controls button").nth(2);
  await nextSpace.press("Enter");
  await expect(nextSpace).toHaveAttribute("aria-pressed", "true");
  const third = gallery.locator('[data-scene="2"]');
  await expect(third).not.toHaveAttribute("aria-hidden", "true");
  await expect
    .poll(() =>
      third
        .locator(".project-gallery-primary")
        .evaluate((element) =>
          parseFloat(
            getComputedStyle(element).getPropertyValue("--scene-reveal"),
          ),
        ),
    )
    .toBeGreaterThan(99.9);

  await scrollTo(page, space.top + space.travel + space.viewportHeight * 0.6);
  await expect
    .poll(() =>
      viewport.evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(-2);
  await expect(page.locator(".next-project")).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("project photographs remain accessible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/projects/mirpur-dohs-interior`);
  await expectNaturalGallery(page);
  await context.close();
});

test("client-selected full motion survives live device preference changes", async ({
  page,
}) => {
  await page.goto("/projects/mirpur-dohs-interior");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  const gallery = page.locator("#rooms");
  const space = await galleryTravel(page);
  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    await page.emulateMedia({ reducedMotion });
    await expect(gallery).toHaveAttribute("data-animated", "true");
    await scrollTo(page, space.top + space.travel / (sceneCount - 1));
    await expect(
      gallery.locator(".project-gallery-controls button").nth(1),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.locator('[data-scene="1"] h2')).toBeInViewport();
    await scrollTo(page, 0);
  }
});

test("project cover opens and zooms with scroll regardless of device preference", async ({
  page,
}) => {
  await page.goto("/projects/mirpur-dohs-interior");
  await page.evaluate(() => document.fonts.ready);
  const cover = page.locator(".project-scroll-hero");
  const aperture = cover.locator(".project-hero-aperture");
  const photo = cover.locator(".project-hero-photo");
  const space = await cover.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    height: (element as HTMLElement).offsetHeight,
    viewportHeight: innerHeight,
  }));
  await expectImagesLoaded(cover.locator("img"));
  await scrollTo(page, Math.max(0, space.top - space.viewportHeight * 0.9));

  await expect(cover).toHaveAttribute("data-animated", "true");
  const inset = () =>
    aperture.evaluate((element) =>
      parseFloat(getComputedStyle(element).clipPath.replace("inset(", "")),
    );
  await expect.poll(inset).toBeGreaterThan(0.5);
  const initialScale = await photo.evaluate(
    (element) => new DOMMatrix(getComputedStyle(element).transform).a,
  );
  await scrollTo(page, space.top + space.height * 0.2);
  await expect.poll(inset).toBeLessThan(0.01);
  await expect
    .poll(() =>
      photo.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).a,
      ),
    )
    .toBeLessThan(initialScale - 0.03);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cover).toHaveAttribute("data-animated", "true");
});

test("full project motion ignores device preferences and retired session choices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    sessionStorage.setItem("domiorum-motion", "off");
    sessionStorage.setItem("domiorum-project-motion", "off");
  });
  await page.goto("/projects/mirpur-dohs-interior");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  await expect(page.locator(".project-motion-toggle")).toHaveCount(0);
  for (const selector of ["#rooms", ".project-scroll-hero"]) {
    await expect(page.locator(selector)).toHaveAttribute(
      "data-animated",
      "true",
    );
  }
  await page.locator(".next-project").click();
  await expect(page).toHaveURL(/\/projects\/ruap-interior$/);
  await expect(page.locator("h1")).toHaveText("RUAP");
  await expect(page.locator("#rooms")).toHaveAttribute("data-animated", "true");
  await page.reload();
  await expect(page.locator("#rooms")).toHaveAttribute("data-animated", "true");
});

test("Doctors Residence retains its exterior cover without an interior gallery", async ({
  page,
}) => {
  await page.goto("/projects/doctors-residence");
  await expect(page.locator("h1")).toHaveText("Doctors Residence");
  await expect(page.locator("#rooms")).toHaveCount(0);
  await expect(page.locator(".project-scroll-hero")).toHaveCount(0);
  const image = page.locator(".project-hero-image img");
  await expect(image).toHaveCount(1);
  await expect(image).toHaveAttribute(
    "alt",
    "Exterior cover design visualization for Doctors Residence",
  );
  const source = new URL((await image.getAttribute("src"))!, page.url());
  expect(source.searchParams.get("url") ?? source.pathname).toBe(
    "/images/projects/doctors-residence/01.webp",
  );
  await expectImagesLoaded(image);
  await expect(
    page.locator(".project-hero-image .project-image-note"),
  ).toHaveText("Design visualization");
});
