import { expect, test } from "@playwright/test";
import path from "node:path";

test("Discover and open dropdowns expose accessible controls", async ({
  page,
}) => {
  for (const route of ["/discover", "/contact"]) {
    await page.goto(route);
    if (route === "/contact")
      await page.getByRole("combobox", { name: "I’m interested in" }).click();
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
  test.skip(info.project.name !== "mobile");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/discover");
  await page.locator(".menu-trigger").click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /Let’s talk/ })
    .click();
  await expect(page).toHaveURL(/\/book-consultation$/);
});

test("founder lives on Discover with separate studio and Innova project credits", async ({
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
    name: "Work at Innova Architects",
  });
  await expect(studio.locator(".project-card")).toHaveCount(5);
  await expect(studio).not.toContainText("Selim Residence");
  await expect(previous.locator(".project-card")).toHaveCount(1);
  await expect(previous).toContainText(
    "Associate Architect at Innova Architects. Project Architect: Ar Sanjida Shams.",
  );
  await previous.getByRole("link", { name: /Selim Residence/ }).click();
  await expect(page).toHaveURL(/\/projects\/selim-residence$/);
});

test("animated service dropdown supports keyboard selection, dismissal and form values", async ({
  page,
}) => {
  await page.goto("/contact");
  const select = page.getByRole("combobox", { name: "I’m interested in" });
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
  test.skip(info.project.name !== "mobile");
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
      .getByRole("link", { name: /Let’s talk/ }),
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

test("links and CTA glow animate, reset, and respect reduced motion", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile");
  await page.goto("/discover");
  const link = page
    .locator(".desktop-nav")
    .getByRole("link", { name: "Discover us" });
  const button = page.getByRole("link", { name: "Talk to the studio" });
  await link.hover();
  if (info.project.name === "reduced-motion") {
    await expect(link).toHaveCSS("translate", "none");
    await button.hover();
    await expect(button).toHaveCSS("transform", "none");
    expect(
      await button.evaluate((el) => getComputedStyle(el, "::after").display),
    ).toBe("none");
  } else {
    await expect(link).toHaveCSS("translate", "0px -2px");
    await button.hover();
    await expect
      .poll(() =>
        button.evaluate((el) =>
          Number(getComputedStyle(el, "::after").opacity),
        ),
      )
      .toBe(1);
    await expect
      .poll(() =>
        button.evaluate((el) => el.style.getPropertyValue("--flame-x")),
      )
      .not.toBe("");
    await page.mouse.move(5, 5);
    await expect
      .poll(() =>
        button.evaluate((el) =>
          Number(getComputedStyle(el, "::after").opacity),
        ),
      )
      .toBe(0);
  }
});

test("contact dropdown remains usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/contact");
  await page
    .getByLabel("I’m interested in")
    .selectOption("Renovation or extension");
  await expect(page.getByLabel("I’m interested in")).toHaveValue(
    "Renovation or extension",
  );
  await context.close();
});
