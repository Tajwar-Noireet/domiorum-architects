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
  await gallery.getByRole("button", { name: "Next view" }).click();
  await expect(gallery.locator(".project-carousel-controls")).toContainText(
    "2 /",
  );
  await gallery
    .getByRole("button", { name: "Enlarge image", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("2 /");
});
