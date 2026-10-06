import { expect, test } from "@playwright/test";
import path from "node:path";

test("brand composition fits phones, tablets and desktop", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  for (const size of [
    { width: 375, height: 812, name: "phone" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1024, height: 768, name: "small-desktop" },
    { width: 1440, height: 900, name: "desktop" },
    { width: 844, height: 390, name: "landscape" },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const image = page.locator(".cinema-preview img");
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(page.locator(".pin-spacer")).toHaveCount(
      size.width >= 900 ? 2 : size.height >= 600 ? 1 : 0,
    );
    expect(
      await page
        .locator(".cinema-hero")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe("rgb(8, 24, 46)");
    expect(
      await page
        .locator("h1 span")
        .evaluate((el) => getComputedStyle(el).color),
    ).toBe("rgb(225, 191, 119)");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const previewBounds = await page.locator(".cinema-preview").boundingBox();
    expect(previewBounds!.y).toBeGreaterThanOrEqual(
      size.width >= 900 ? 100 : 78,
    );
    await page.screenshot({
      path: `../output/website-review/homepage-${size.name}.png`,
    });
  }
});

test("capture the motion sequence and check accessible controls", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  for (const step of [
    { top: 570, name: "expanded-room" },
    { top: 1100, name: "material-detail" },
    { top: 1770, name: "stair-view" },
  ]) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      step.top,
    );
    await expect
      .poll(() =>
        page
          .locator(".cinema-frame")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBeGreaterThan(0.99);
    await page.waitForTimeout(750);
    await page.screenshot({
      path: `../output/website-review/scroll-${step.name}.png`,
    });
  }
  await page.addScriptTag({
    path: path.join(process.cwd(), "node_modules/axe-core/axe.min.js"),
  });
  const result = await page.evaluate(async () => {
    const axe = (
      window as unknown as {
        axe: {
          run: (options: unknown) => Promise<{
            violations: { id: string; impact: string; description: string }[];
          }>;
        };
      }
    ).axe;
    return (
      await axe.run({
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      })
    ).violations.map(({ id, impact, description }) => ({
      id,
      impact,
      description,
    }));
  });
  expect(result).toEqual([]);
});
