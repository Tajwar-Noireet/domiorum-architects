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

  if (testInfo.project.name === "reduced-motion") {
    await expectNaturalGallery(page);
    return;
  }

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

test("changing reduced motion live restores all images to normal page flow", async ({
  page,
}) => {
  await page.goto("/projects/mirpur-dohs-interior");
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const gallery = page.locator("#rooms");
  await expect(gallery).toHaveAttribute("data-animated", "true");
  const space = await galleryTravel(page);
  await scrollTo(page, space.top + space.travel / (sceneCount - 1));
  await expect(
    gallery.locator(".project-gallery-controls button").nth(1),
  ).toHaveAttribute("aria-pressed", "true");
  const animatedHeight = await gallery.evaluate(
    (element) => (element as HTMLElement).offsetHeight,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(gallery).toHaveAttribute("data-animated", "false");
  await expect
    .poll(() =>
      gallery.evaluate((element) => (element as HTMLElement).offsetHeight),
    )
    .not.toBe(animatedHeight);
  await expectNaturalGallery(page);
  for (const primary of await gallery
    .locator(".project-gallery-primary")
    .all()) {
    expect(
      await primary.evaluate((element) =>
        parseFloat(
          getComputedStyle(element).getPropertyValue("--scene-reveal"),
        ),
      ),
    ).toBe(100);
  }
});

test("project cover opens and zooms with scroll while reduced motion stays static", async ({
  page,
}, testInfo) => {
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
  if (testInfo.project.name === "reduced-motion") {
    await expect(cover).toHaveAttribute("data-animated", "false");
    await expect(aperture).toHaveCSS("clip-path", "none");
    await expect(photo).toHaveCSS("transform", "none");
    await scrollTo(page, space.top + space.height * 0.2);
    await expect(aperture).toHaveCSS("clip-path", "none");
    await expect(photo).toHaveCSS("transform", "none");
    return;
  }

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
  await expect(cover).toHaveAttribute("data-animated", "false");
  await expect(aperture).toHaveCSS("clip-path", "none");
  await expect(photo).toHaveCSS("transform", "none");
});

test("project motion follows device preferences and ignores retired session choices", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/mirpur-dohs-interior");
  const gallery = page.locator("#rooms");
  const cover = page.locator(".project-scroll-hero");
  await expectNaturalGallery(page);
  await expect(cover).toHaveAttribute("data-animated", "false");

  await expect(page.locator(".project-motion-toggle")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(gallery).toHaveAttribute("data-animated", "true");
  await expect(cover).toHaveAttribute("data-animated", "true");
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(false);
  await scrollTo(page, 0);
  await expect(cover.locator(".project-hero-aperture")).not.toHaveCSS(
    "clip-path",
    "none",
  );
  await expect
    .poll(() =>
      cover
        .locator(".project-hero-photo")
        .evaluate(
          (element) => new DOMMatrix(getComputedStyle(element).transform).a,
        ),
    )
    .toBeGreaterThan(1.01);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cover).toHaveAttribute("data-animated", "false");
  await expectNaturalGallery(page);

  await page.evaluate(() => {
    sessionStorage.setItem("domiorum-motion", "off");
    sessionStorage.setItem("domiorum-project-motion", "off");
  });
  await page.reload();
  await expect(gallery).toHaveAttribute("data-animated", "false");
  await expect(cover).toHaveAttribute("data-animated", "false");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(gallery).toHaveAttribute("data-animated", "true");
  await page.locator(".next-project").click();
  await expect(page).toHaveURL("/projects/ruap-interior");
  await expect(page.locator("h1")).toHaveText("RUAP");
  await expect(gallery).toHaveAttribute("data-animated", "true");
  await expect(cover).toHaveAttribute("data-animated", "true");
  await page.reload();
  await expect(gallery).toHaveAttribute("data-animated", "true");
  await expect(cover).toHaveAttribute("data-animated", "true");
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
