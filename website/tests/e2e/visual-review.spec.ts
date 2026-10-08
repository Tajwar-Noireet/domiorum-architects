import { expect, test } from "@playwright/test";
import path from "node:path";

test("gallery stays visible throughout its reserved scroll space", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  await page.goto("/");

  for (const phase of ["initial", "reload", "resize", "reenable"]) {
    if (phase === "reload") await page.reload();
    if (phase === "resize") {
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.locator(".pin-spacer")).toHaveCount(1);
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    if (phase === "reenable") {
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      await page.emulateMedia({ reducedMotion: "no-preference" });
    }
    await expect(page.locator(".pin-spacer")).toHaveCount(2);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const space = await page.locator(".interior-pin").evaluate((el) => {
      const spacer = el.closest(".interior-scroll") as HTMLElement;
      return {
        start: spacer.getBoundingClientRect().top + scrollY,
        travel: spacer.offsetHeight - (el as HTMLElement).offsetHeight,
      };
    });
    for (const progress of [0.15, 0.5, 0.85]) {
      await page.evaluate(
        (top) => window.scrollTo({ top, behavior: "instant" }),
        space.start + space.travel * progress,
      );
      if (phase === "initial" && progress === 0.5) {
        await page.screenshot({
          path: "../output/website-review/homepage-gallery-gap-check.png",
        });
      }
      await expect
        .poll(
          () =>
            page.locator(".interior-pin").evaluate((el) => {
              const rect = el.getBoundingClientRect();
              return Math.abs(rect.top) < 2 && rect.bottom > innerHeight * 0.75;
            }),
          {
            message: `${phase}: gallery must fill its pin space at ${progress}`,
          },
        )
        .toBe(true);
    }
  }
});

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
        .locator("h1 .hero-line-second")
        .evaluate((el) => getComputedStyle(el).color),
    ).toBe("rgb(225, 191, 119)");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const previewBounds = await page.locator(".cinema-preview").boundingBox();
    expect(previewBounds!.y).toBeGreaterThanOrEqual(0);
    await page.screenshot({
      path: `../output/website-review/homepage-${size.name}.png`,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto("/projects");
  await expect(page.locator(".showcase-index a")).toHaveCount(5);
  await expect
    .poll(() =>
      page
        .locator(".showcase-cover img")
        .first()
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.locator(".showcase-project").first().screenshot({
    path: "../output/website-review/interior-project-preview.png",
  });
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
