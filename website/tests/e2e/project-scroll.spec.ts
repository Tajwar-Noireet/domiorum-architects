import { expect, test } from "@playwright/test";

test("exterior grid shows all seven views and opens uncropped images", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
  await page.goto("/projects/doctors-residence");
  await expect(page.locator(".project-hero-image img")).toHaveCSS(
    "object-fit",
    "cover",
  );
  const tiles = page
    .getByRole("region", { name: "Exterior views" })
    .getByRole("button", { name: /^Enlarge / });
  await expect(tiles).toHaveCount(7);
  for (const index of [0, 3, 6]) {
    await tiles.nth(index).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
    await expect
      .poll(() =>
        dialog
          .locator("img")
          .evaluate(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await dialog.getByRole("button", { name: "Close image" }).click();
    await expect(dialog).toBeHidden();
  }
});

test("interior photos use the circular gallery and open the current photo", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
  await page.goto("/projects/aftabnagar-interior");
  const gallery = page.locator("#rooms");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator(".project-circular-gallery")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect
    .poll(() =>
      gallery.locator("canvas").evaluate((el) => {
        if (!(el instanceof HTMLCanvasElement) || !el.clientWidth) return 0;
        return el.width / el.clientWidth;
      }),
    )
    .toBeGreaterThanOrEqual(
      await page.evaluate(() => Math.min(devicePixelRatio, 2.5) - 0.01),
    );
  const counter = gallery.locator(".project-carousel-controls span");
  const scrollGallery = (offset: number) =>
    gallery.evaluate(
      (el, offset) =>
        window.scrollTo({
          top: scrollY + el.getBoundingClientRect().top + offset,
          behavior: "instant",
        }),
      offset,
    );
  await scrollGallery(-(await page.evaluate(() => innerHeight)));
  await expect(counter).toHaveText("1 / 10");
  await scrollGallery(1100);
  await expect(counter).toHaveText("10 / 10");
  await scrollGallery(-(await page.evaluate(() => innerHeight)));
  await expect(counter).toHaveText("1 / 10");
  const next = gallery.getByRole("button", { name: "Next view" });

  const current = Number((await counter.textContent())?.split("/")[0]);
  await next.dispatchEvent("click");
  const expected = (current % 10) + 1;
  await expect(counter).toHaveText(`${expected} / 10`);
  await gallery
    .getByRole("button", { name: "Enlarge image", exact: true })
    .dispatchEvent("click");
  await expect(page.getByRole("dialog")).toContainText(`${expected} / 10`);
});
