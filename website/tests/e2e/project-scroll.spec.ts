import { expect, test, type Locator } from "@playwright/test";

async function positionCanvas(canvas: Locator) {
  await canvas.evaluate(async (element) => {
    const rect = element.getBoundingClientRect();
    window.scrollTo({
      top: scrollY + rect.top + (rect.height - innerHeight) / 2,
      behavior: "instant",
    });
    // Let ScrollTrigger observe the new position before reading the counter.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

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

  await positionCanvas(gallery.locator("canvas"));
  const current = Number((await counter.textContent())?.split("/")[0]);
  await next.click();
  const expected = (current % 10) + 1;
  await expect(counter).toHaveText(`${expected} / 10`);
  const enlarge = gallery.getByRole("button", {
    name: "Enlarge image",
    exact: true,
  });
  await enlarge.focus();
  await enlarge.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".project-viewer-count")).toHaveText(
    `${expected} / 10`,
  );
  await page.keyboard.press("Escape");
  await expect(enlarge).toBeFocused();
});

test("tapping or clicking the canvas opens the photo and dragging browses", async ({
  page,
  hasTouch,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
  await page.goto("/projects/aftabnagar-interior");
  const gallery = page.locator("#rooms");
  const canvas = gallery.locator("canvas");
  const counter = gallery.locator(".project-carousel-controls span");
  const dialog = page.getByRole("dialog");
  await expect(canvas).toBeVisible();
  await positionCanvas(canvas);
  if (hasTouch) await canvas.tap();
  else await canvas.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".project-viewer-count")).toHaveText(/\d+ \/ 10/);
  await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
  const previousPhoto = await dialog.locator("img").getAttribute("alt");
  await dialog.getByRole("button", { name: "Next image" }).click();
  await expect(dialog.locator("img")).not.toHaveAttribute(
    "alt",
    previousPhoto ?? "",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator("img")).toHaveAttribute(
    "alt",
    previousPhoto ?? "",
  );
  await dialog.getByRole("button", { name: "Close image" }).click();
  await expect(dialog).toBeHidden();

  if (!hasTouch) {
    const bounds = (await canvas.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    const beforeDrag = await counter.textContent();
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 90, y, { steps: 5 });
    await page.mouse.up();
    await expect(counter).not.toHaveText(beforeDrag ?? "");
    await expect(dialog).toBeHidden();
  }
});
