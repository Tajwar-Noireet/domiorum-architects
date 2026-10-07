import { test, expect } from "@playwright/test";

test("drafting cursors apply to desktop browsing and links with native form cursors", async ({
  page,
}) => {
  await page.goto("/");
  const fine = await page.evaluate(
    () => matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const bodyCursor = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).cursor);
  const link = page.getByRole("link", {
    name: "Explore our services",
    exact: true,
  });
  const linkCursor = await link.evaluate((el) => getComputedStyle(el).cursor);
  if (fine) {
    expect(bodyCursor).toContain("/cursors/brass-compass.svg");
    expect(linkCursor).toContain("/cursors/brass-hand.svg");
    expect(
      await page
        .getByRole("button", { name: "Interior spaces", exact: true })
        .evaluate((el) => getComputedStyle(el).cursor),
    ).toContain("/cursors/brass-hand.svg");
    await page.emulateMedia({ forcedColors: "active" });
    expect(await link.evaluate((el) => getComputedStyle(el).cursor)).toBe(
      "pointer",
    );
    await page.emulateMedia({ forcedColors: "none" });
  } else {
    expect(bodyCursor).not.toContain("/cursors/");
    expect(linkCursor).not.toContain("/cursors/");
  }
  for (const file of ["brass-compass", "brass-hand"]) {
    const response = await page.request.get(`/cursors/${file}.svg`);
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('width="35.2" height="35.2"');
  }
  await page.goto("/contact");
  const input = page.getByRole("textbox").first();
  await expect(input).toBeVisible();
  expect(await input.evaluate((el) => getComputedStyle(el).cursor)).toBe(
    "text",
  );
});
