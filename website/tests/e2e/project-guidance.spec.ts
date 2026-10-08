import { expect, test } from "@playwright/test";

test("homeowner questions open and close using the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const questions = page.locator(".questions-list");
  const first = questions.locator("details").first();
  const trigger = first.locator("summary");
  await trigger.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator("p")).toBeVisible();
  await expect(first.locator("p")).toContainText("floor plan");
  await trigger.press("Space");
  await expect(first).not.toHaveAttribute("open");
  await expect(first.locator("p")).toBeHidden();
  expect(
    await trigger.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe("none");
});

test("featured project links reach the project gallery", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "reduced-motion") {
    await page.setViewportSize({ width: 1440, height: 1600 });
    for (const image of await page.locator(".project-showcase img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.locator(".showcase-project").first().screenshot({
      path: "../output/website-review/portfolio-desktop.png",
    });
  }
  await page
    .getByRole("link", { name: "View project", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/aftabnagar-interior$/);
  await expect(page.locator("#rooms figure")).toHaveCount(10);
});
