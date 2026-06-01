import { test, expect } from "@playwright/test";

/**
 * hero.spec.ts
 * Covers: AC-LV-02, AC-LV-05, AC-LV-06, AC-LV-09
 * Tests the Hero section constraints.
 */

test.describe("Hero section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero section is visible with data-testid", async ({ page }) => {
    await expect(page.locator('[data-testid="hero"]')).toBeVisible();
  });

  test("exactly one <h1> on the page (AC-LV-05)", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("hero subtitle word count is <= 30 words (AC-LV-02)", async ({
    page,
  }) => {
    const subtitle = page.locator('[data-testid="hero-subtitle"]');
    await expect(subtitle).toBeVisible();

    const text = await subtitle.innerText();
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    expect(wordCount).toBeLessThanOrEqual(30);
  });

  test("primary CTA is visible and href is not empty or # (AC-LV-09)", async ({
    page,
  }) => {
    const cta = page.locator('[data-testid="cta-primary"]');
    await expect(cta).toBeVisible();

    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toBe("#");
    expect(href).not.toBe("");
  });

  test("hero image has non-empty alt attribute (AC-LV-06)", async ({
    page,
  }) => {
    const heroImg = page.locator('[data-testid="hero"] img');
    const count = await heroImg.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await heroImg.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt).not.toBe("");
    }
  });
});
