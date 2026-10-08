import { expect, test } from "@playwright/test";

test("key layouts fit portrait, landscape and PC sizes", async ({
  page,
}, info) => {
  test.skip(info.project.name === "reduced-motion");
  const phone = ["mobile", "android"].includes(info.project.name);
  const sizes = phone
    ? [
        { width: 320, height: 740 },
        {
          width: phone && info.project.name === "android" ? 412 : 390,
          height: 844,
        },
        { width: 844, height: 390 },
      ]
    : [
        { width: 1280, height: 720 },
        { width: 1920, height: 1080 },
      ];
  for (const size of sizes) {
    await page.setViewportSize(size);
    for (const route of [
      "/",
      "/projects",
      "/projects/mirpur-dohs-interior",
      "/discover",
      "/contact",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main h1")).toBeVisible();
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          {
            message: `${info.project.name} ${size.width}x${size.height} ${route} overflow`,
          },
        )
        .toBe(true);
      if (phone && route === "/projects") {
        await expect(page.locator(".project-showcase")).toHaveAttribute(
          "data-stack",
          "false",
        );
        await page.locator(".showcase-index a").first().click();
        const image = page.locator(".showcase-cover img").first();
        await expect
          .poll(() =>
            image.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      if (route === "/projects")
        await page.screenshot({
          path: `../output/website-review/release-${info.project.name}-${size.width}.png`,
        });
    }
  }
});
