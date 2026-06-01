import { test, expect } from "@playwright/test";

/**
 * nav.spec.ts
 * Covers: AC-LV-01, AC-LV-03, AC-LV-11, FR-LV-03, FR-LV-04, FR-LV-05
 * Tests the Nav component in isolation: structure, active link, mobile toggle,
 * and keyboard navigation.
 */

test.describe("Nav component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Nav renders as a <nav> element with semantic list structure (FR-LV-03)", async ({
    page,
  }) => {
    // Must be a <nav> element
    await expect(page.locator("nav")).toBeVisible();

    // Must have <ul> / <li> structure
    const navList = page.locator("nav ul");
    await expect(navList).toBeVisible();

    const listItems = page.locator("nav ul li");
    const count = await listItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("Nav contains at least one navigation link (AC-LV-01)", async ({
    page,
  }) => {
    const navLinks = page.locator("nav a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("exactly one anchor has aria-current='page' on / route (AC-LV-01, AC-LV-03)", async ({
    page,
  }) => {
    const activeLinks = page.locator('a[aria-current="page"]');
    await expect(activeLinks).toHaveCount(1);
  });

  test("active nav link aria-current='page' value is literally 'page' not true/false (FR-LV-04)", async ({
    page,
  }) => {
    const activeLink = page.locator('a[aria-current="page"]').first();
    await expect(activeLink).toBeVisible();
    const ariaCurrent = await activeLink.getAttribute("aria-current");
    expect(ariaCurrent).toBe("page");
  });

  test("non-active nav links do NOT have aria-current attribute (AC-LV-03, FR-LV-04)", async ({
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

  test("Nav is sticky to viewport top (FR-LV-03)", async ({ page }) => {
    // The sticky container (header or nav) must have position sticky
    const header = page.locator("header").first();
    const position = await header.evaluate(
      (el) => window.getComputedStyle(el).position,
    );
    expect(position).toBe("sticky");
  });

  test("MobileToggle renders with data-testid and initial aria-expanded=false (AC-LV-11, FR-LV-05)", async ({
    page,
  }) => {
    // Use mobile viewport to ensure toggle is visible
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    await expect(toggle).toBeVisible();

    // Initial state must be closed
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("MobileToggle toggles aria-expanded from false to true on click (AC-LV-11)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    await expect(toggle).toBeVisible();

    // Click to open
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  test("MobileToggle toggles back to false on second click (AC-LV-11)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Second click — must close
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("MobileToggle is keyboard-accessible via Enter key (FR-LV-05)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    await toggle.focus();

    // Enter key must activate the toggle
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  test("MobileToggle has descriptive aria-label (FR-LV-05)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const toggle = page.locator('[data-testid="nav-mobile-toggle"]');
    const ariaLabel = await toggle.getAttribute("aria-label");
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel!.trim().length).toBeGreaterThan(0);
  });
});
