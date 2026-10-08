import { expect, test } from "@playwright/test";

test("homeowner questions open and close using the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".brand-reveal")).toBeHidden();
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
  await expect(page.locator(".brand-reveal")).toBeHidden();
  if (testInfo.project.name === "desktop") {
    await page.locator(".showcase-index a").first().click();
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
