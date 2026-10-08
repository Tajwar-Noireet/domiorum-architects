import { expect, test, type Page } from "@playwright/test";
import portfolio from "../../src/content/portfolio.json";

const mirpur = portfolio.find(
  (project) => project.slug === "mirpur-dohs-interior",
)!;
const lastScene = Math.ceil(mirpur.images.length / 2) - 1;

async function expectToolbarClearance(page: Page) {
  await expect
    .poll(() =>
      page.locator("#rooms").evaluate((element) => {
        const toolbar = element
          .querySelector(".project-gallery-toolbar")!
          .getBoundingClientRect();
        const scene = element
          .querySelector('[data-scene="0"]')!
          .getBoundingClientRect();
        const title = element
          .querySelector('[data-scene="0"] h2')!
          .getBoundingClientRect();
        return Math.min(scene.top, title.top) - toolbar.bottom;
      }),
    )
    .toBeGreaterThanOrEqual(10);

  expect(
    await page
      .locator(".project-gallery-controls button")
      .evaluateAll((buttons) =>
        buttons.every((button) => {
          const bounds = button.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= innerWidth;
        }),
      ),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

test("gallery toolbar fits narrow phones and outgoing layers clear the final space", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects/mirpur-dohs-interior");
  await page.evaluate(() => document.fonts.ready);
  const gallery = page.locator("#rooms");
  await expect(gallery).toHaveAttribute("data-animated", "true");
  const controls = gallery.locator(".project-gallery-controls button");
  await controls.first().click();
  await expect(controls.first()).toHaveAttribute("aria-pressed", "true");
  await expectToolbarClearance(page);

  await controls.last().click();
  await expect(controls.last()).toHaveAttribute("aria-pressed", "true");
  const finalScene = gallery.locator(`[data-scene="${lastScene}"]`);
  await expect(finalScene).toHaveClass(/project-gallery-scene-single/);
  await expect(finalScene.getByRole("heading")).toHaveText(
    mirpur.images.at(-1)!.caption,
  );
  await expect(finalScene.getByRole("heading")).toBeInViewport();
  await expect
    .poll(() =>
      gallery
        .locator(
          `.project-gallery-scene:not([data-scene="${lastScene}"]) figure`,
        )
        .evaluateAll((figures) =>
          Math.max(
            ...figures.map((figure) =>
              Number(getComputedStyle(figure).opacity),
            ),
          ),
        ),
    )
    .toBeLessThan(0.001);

  await page.setViewportSize({ width: 900, height: 390 });
  await gallery.evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY,
      behavior: "instant",
    }),
  );
  await controls.first().click();
  await expect(controls.first()).toHaveAttribute("aria-pressed", "true");
  await expectToolbarClearance(page);
  await expect(
    gallery.locator('[data-scene="0"]').getByRole("heading"),
  ).toBeInViewport();
});
