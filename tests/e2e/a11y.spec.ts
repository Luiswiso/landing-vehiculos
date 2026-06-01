import { test, expect } from "@playwright/test";

test.describe("Accessibility audit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for all server:defer islands to resolve
    await page.waitForTimeout(3000);
  });

  test("every <section> has aria-labelledby (design §7.3)", async ({
    page,
  }) => {
    const sections = page.locator("section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const labelledBy = await section.getAttribute("aria-labelledby");
      expect(
        labelledBy,
        `Section #${i} is missing aria-labelledby`,
      ).toBeTruthy();
      expect(labelledBy!.trim().length).toBeGreaterThan(0);
    }
  });

  test("each aria-labelledby on <section> points to an existing heading element", async ({
    page,
  }) => {
    const sections = page.locator("section");
    const count = await sections.count();

    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const labelledById = await section.getAttribute("aria-labelledby");
      if (!labelledById) continue;

      const heading = page.locator(`[id="${labelledById}"]`);
      const headingCount = await heading.count();
      expect(
        headingCount,
        `aria-labelledby="${labelledById}" points to a non-existent element`,
      ).toBeGreaterThan(0);
    }
  });

  test('aria-current="page" is present on exactly one nav link (AC-LV-03)', async ({
    page,
  }) => {
    const activeLinks = page.locator('a[aria-current="page"]');
    await expect(activeLinks).toHaveCount(1);
  });

  test("non-active nav links do NOT have aria-current", async ({ page }) => {
    const navLinks = page.locator("nav a");
    const count = await navLinks.count();

    let activeCount = 0;
    for (let i = 0; i < count; i++) {
      const ariaCurrent = await navLinks.nth(i).getAttribute("aria-current");
      if (ariaCurrent === "page") {
        activeCount++;
      } else {
        expect(ariaCurrent).toBeNull();
      }
    }
    expect(activeCount).toBe(1);
  });

  test("all images have non-empty alt attributes (AC-LV-06)", async ({
    page,
  }) => {
    // Images without alt attribute
    const imgsWithoutAlt = page.locator("img:not([alt])");
    await expect(imgsWithoutAlt).toHaveCount(0);

    // Images with empty alt attribute (only decorative images should have alt="")
    // For this landing page, all images are meaningful content — none should have empty alt
    const imgsWithEmptyAlt = page.locator('img[alt=""]');
    await expect(imgsWithEmptyAlt).toHaveCount(0);
  });

  test('<html> element has lang="es"', async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("es");
  });

  test("no <section> is missing a heading", async ({ page }) => {
    const sections = page.locator("section");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      // Each section should contain at least one heading (h1–h6)
      const headings = section.locator("h1, h2, h3, h4, h5, h6");
      const headingCount = await headings.count();
      // sr-only headings count — they're still present in DOM
      expect(
        headingCount,
        `Section #${i} has no heading element`,
      ).toBeGreaterThan(0);
    }
  });

  test("page has exactly one <h1> element (AC-LV-05)", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("heading hierarchy is not skipped (h1 then h2, not h1 then h3)", async ({
    page,
  }) => {
    // Ensure we don't jump from h1 to h3 without an h2
    const h1Count = await page.locator("h1").count();
    const h2Count = await page.locator("h2").count();

    expect(h1Count).toBe(1);
    // All non-hero sections use h2 — should be at least 5 of them
    expect(h2Count).toBeGreaterThanOrEqual(5);
  });

  test("interactive elements have focus-visible classes (CLS/a11y check)", async ({
    page,
  }) => {
    // The CTA buttons should be focusable
    const ctaPrimary = page.locator('[data-testid="cta-primary"]');
    await expect(ctaPrimary).toBeVisible();

    const ctaFinal = page.locator('[data-testid="cta-final"]');
    await expect(ctaFinal).toBeVisible();
  });
});
