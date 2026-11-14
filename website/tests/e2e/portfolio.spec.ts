import { expect, test } from "@playwright/test";
import { allProjects } from "../../src/content/projects";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("domiorum-brand-intro-v1", "seen"),
  );
});

for (const route of ["/", "/projects"]) {
  test(`the showcase displays and links every project on ${route}`, async ({
    page,
  }, info) => {
    await page.goto(route);
    const showcase = page.getByRole("list", { name: "Project showcase" });
    const links = showcase.getByRole("link");
    await expect(links).toHaveCount(allProjects.length);
    for (const project of allProjects) {
      const link = showcase.getByRole("link", {
        name: project.title,
        exact: true,
      });
      await expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
      await link.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          link
            .locator("img")
            .evaluate(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
        )
        .toBe(true);
    }
    const positions = await links.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().top)),
    );
    const phone =
      info.project.name === "mobile" || info.project.name === "android";
    expect(new Set(positions).size).toBe(phone ? 3 : 1);
    const first = links.first();
    const destination = await first.getAttribute("href");
    if (phone) {
      await first.scrollIntoViewIfNeeded();
      await expect(first).toBeInViewport();
      await first.getByText(allProjects[0].title, { exact: true }).tap();
    } else {
      await first.focus();
      await expect(first).toBeFocused();
      await page.keyboard.press("Enter");
    }
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.locator(".project-hero-image img")).toBeVisible();
  });
}

test("desktop panels expand when focused or hovered", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/projects");
  const panels = page
    .getByRole("list", { name: "Project showcase" })
    .getByRole("link");
  const first = panels.nth(1);
  await first.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  const width = (await first.boundingBox())!.width;
  await first.focus();
  await expect
    .poll(async () => (await first.boundingBox())!.width)
    .toBeGreaterThan(width * 1.3);
  await first.evaluate((el) => (el as HTMLElement).blur());
  await panels.last().hover();
  await expect
    .poll(async () => (await panels.last().boundingBox())!.width)
    .toBeGreaterThan(width * 1.3);
});

test("project links work without JavaScript", async ({ browser, baseURL }) => {
  const page = await browser.newPage({ javaScriptEnabled: false, baseURL });
  try {
    await page.goto("/projects");
    const links = page
      .getByRole("list", { name: "Project showcase" })
      .getByRole("link");
    await expect(links).toHaveCount(allProjects.length);
    await links.getByText("Doctors Residence", { exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/doctors-residence$/);
  } finally {
    await page.close();
  }
});
