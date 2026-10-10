import { expect, test } from "@playwright/test";
import path from "node:path";

test("Discover and open dropdowns expose accessible controls", async ({
  page,
}) => {
  for (const route of ["/discover", "/contact", "/projects"]) {
    await page.goto(route);
    await expect(page.locator(".brand-reveal")).toBeHidden();
    if (route === "/contact") {
      await page.getByRole("combobox", { name: "I’m interested in" }).click();
      await expect(page.getByRole("listbox")).toHaveCSS("opacity", "1");
    }
    await page.addScriptTag({
      path: path.join(process.cwd(), "node_modules/axe-core/axe.min.js"),
    });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: {
            run: (
              options: unknown,
            ) => Promise<{ violations: { id: string; description: string }[] }>;
          };
        }
      ).axe;
      return (
        await axe.run({
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        })
      ).violations.map(({ id, description }) => ({ id, description }));
    });
    expect(violations, route).toEqual([]);
  }
});

test("short mobile screens can scroll to every menu link", async ({
  page,
}, info) => {
  test.skip(!["mobile", "android"].includes(info.project.name));
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/discover");
  await page.locator(".menu-trigger").click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Let’s talk/ })
    .click();
  await expect(page).toHaveURL(/\/book-consultation$/);
});

test("founder lives on Discover with separate studio and previous project credits", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main img[src*='zarin-nawar']")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("Founder & CEO");
  await page.goto("/discover");
  await expect(
    page.getByRole("heading", { name: "Zarin Nawar" }),
  ).toBeVisible();
  const studio = page.getByRole("region", { name: "Current studio projects" });
  const previous = page.getByRole("region", {
    name: "Previous projects",
  });
  await expect(studio.locator(".project-card")).toHaveCount(5);
  await expect(studio).not.toContainText("Selim Residence");
  await expect(previous.locator(".project-card")).toHaveCount(1);
  await expect(previous).toContainText(
    "Previous professional work of Zarin Nawar. Project Architect: Ar Sanjida Shams.",
  );
  await expect(page.locator("main")).not.toContainText("Innova");
  await previous.getByRole("link", { name: /Selim Residence/ }).click();
  await expect(page).toHaveURL(/\/projects\/selim-residence$/);
  await expect(page.locator("main")).not.toContainText("Innova");
  await expect(page.locator(".project-facts")).toContainText(
    "Ar Sanjida Shams",
  );
});

test("animated service dropdown supports keyboard selection, dismissal and form values", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  const select = page.getByRole("combobox", { name: "I’m interested in" });
  await expect(select).toHaveAttribute("aria-expanded", "false");
  await select.focus();
  await select.press("ArrowDown");
  await expect(select).toHaveAttribute("aria-expanded", "true");
  await select.press("ArrowDown");
  await select.press("Enter");
  await expect(select).toHaveText("Residential architecture");
  await expect(page.locator("input[name=service]")).toHaveValue(
    "Residential architecture",
  );
  await select.press("Space");
  await select.press("End");
  await select.press("Escape");
  await expect(select).toBeFocused();
  await expect(select).toHaveText("Residential architecture");
  await expect(page.getByRole("listbox")).toBeHidden();
  await select.press("Space");
  await select.press("Tab");
  await expect(select).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByLabel("Approximate area")).toBeFocused();
  await select.focus();
  await select.press("i");
  await expect(select).toHaveText("Interior design");
  await select.click();
  await page
    .getByRole("option", { name: "Technical & delivery support" })
    .click();
  await expect(select).toHaveText("Technical & delivery support");
  await select.click();
  await page
    .getByRole("heading", { name: "Tell us about your project" })
    .click();
  await expect(select).toHaveAttribute("aria-expanded", "false");
});

test("mobile menu morphs, opens, traps focus and reaches Discover", async ({
  page,
}, info) => {
  test.skip(!["mobile", "android"].includes(info.project.name));
  await page.goto("/contact");
  const trigger = page.locator(".menu-trigger");
  await trigger.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      trigger
        .locator("path")
        .first()
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .toBe("matrix(0.707107, -0.707107, 0.707107, 0.707107, 0, 0)");
  await trigger.press("Shift+Tab");
  await expect(
    page
      .locator("#mobile-navigation")
      .getByRole("link", { name: "+880 1796 589389", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Discover us/ })
    .click();
  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.locator("#mobile-navigation")).toBeHidden();
});

test("links and CTA glow animate and reset under every device preference", async ({ page }, info) => {
  test.skip(["mobile", "android"].includes(info.project.name));
  await page.goto("/discover");
  await expect(page.locator(".brand-reveal")).toBeHidden();
  const link = page.locator(".desktop-nav").getByRole("link", { name: "Discover us" });
  const button = page.getByRole("link", { name: "Talk to the studio" });
  await link.hover();
  await expect(link).toHaveCSS("translate", "0px -2px");
  await button.hover();
  await expect.poll(() => button.evaluate(el => Number(getComputedStyle(el, "::after").opacity))).toBe(1);
  await expect.poll(() => button.evaluate(el => el.style.getPropertyValue("--flame-x"))).not.toBe("");
  await page.mouse.move(5, 5);
  await expect.poll(() => button.evaluate(el => Number(getComputedStyle(el, "::after").opacity))).toBe(0);
});

test("contact dropdown remains usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: test.info().project.use.baseURL,
  });
  const page = await context.newPage();
  await page.goto("/contact");
  await page
    .getByLabel("I’m interested in")
    .selectOption("Renovation or extension");
  await expect(page.getByLabel("I’m interested in")).toHaveValue(
    "Renovation or extension",
  );
  await context.close();
});
