import { test, expect } from "@playwright/test";
test("exploded house layers respond to service focus and touch controls", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Interior spaces", exact: true })
    .click();
  await expect(page.locator('[data-house-layer="0"]')).toHaveAttribute(
    "data-active",
    "true",
  );
  for (let i = 0; i < 4; i++) {
    const service = page.locator(`[data-house-service="${i}"]`);
    await service.focus();
    await expect(page.locator(`[data-house-layer="${i}"]`)).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(service).toHaveAttribute("href", `/services#service-${i + 1}`);
  }
  await page
    .getByRole("button", { name: "Adaptable additions", exact: true })
    .click();
  await expect(page.locator('[data-house-layer="2"]')).toHaveAttribute(
    "data-active",
    "true",
  );
  await expect(
    page.getByRole("img", { name: "Exploded axonometric house" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
