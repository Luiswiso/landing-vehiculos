import { test, expect } from "@playwright/test";

/**
 * landing-shell.spec.ts
 * Covers: AC-LV-01, AC-LV-03, AC-LV-04, AC-LV-05, AC-LV-06
 * Tests the static shell: Nav, Hero, and overall structural constraints.
 */

test.describe("Landing shell — structural constraints", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("GET / returns HTTP 200", async ({ page }) => {
    const response = await page.request.get("/");
    expect(response.status()).toBe(200);
  });

  test("page contains exactly one <h1> (AC-LV-05)", async ({ page }) => {
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("Nav renders as a <nav> element", async ({ page }) => {
    await expect(page.locator("nav")).toBeVisible();
  });

  test("exactly one anchor has aria-current='page' (AC-LV-01, AC-LV-03)", async ({
    page,
  }) => {
    const activeLinks = page.locator('a[aria-current="page"]');
    await expect(activeLinks).toHaveCount(1);
  });

  test("non-active nav links do NOT have aria-current (AC-LV-03)", async ({
    page,
  }) => {
    const allNavLinks = page.locator("nav a");
    const count = await allNavLinks.count();
    let nonActiveWithAriaCurrent = 0;
    for (let i = 0; i < count; i++) {
      const ariaCurrent = await allNavLinks.nth(i).getAttribute("aria-current");
      if (ariaCurrent !== null && ariaCurrent !== "page") {
        nonActiveWithAriaCurrent++;
      }
    }
    expect(nonActiveWithAriaCurrent).toBe(0);
  });

  test("all images have non-empty alt attribute (AC-LV-06)", async ({
    page,
  }) => {
    // Images with no alt attribute
    const imgsWithoutAlt = await page.locator("img:not([alt])").count();
    expect(imgsWithoutAlt).toBe(0);

    // Images with empty alt attribute (only acceptable for decorative images,
    // but we disallow all empty alts per spec)
    const imgsWithEmptyAlt = await page.locator('img[alt=""]').count();
    expect(imgsWithEmptyAlt).toBe(0);
  });

  test("mobile toggle starts with aria-expanded=false and toggles to true (AC-LV-11)", async ({
    page,
  }) => {
    // Mobile viewport — the toggle is hidden on md+ screens via md:hidden
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    await expect(toggle).toBeVisible();

    // Initial state: closed
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    // Click to open
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
