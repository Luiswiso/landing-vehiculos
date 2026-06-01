import { test, expect } from "@playwright/test";

/**
 * cta.spec.ts
 * Covers: FR-LV-10, AC-LV-08, AC-LV-09, T-055
 * Tests the Hero CTA, Services section card count, and Final CTA.
 */

test.describe("CTA and services", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Hero CTA is visible and has a valid href (AC-LV-09)", async ({
    page,
  }) => {
    const cta = page.locator('[data-testid="cta-primary"]');
    await expect(cta).toBeVisible();

    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toBe("#");
    expect(href).not.toBe("");
  });

  test("Hero CTA href resolves to a mailto: or https: URL", async ({
    page,
  }) => {
    const cta = page.locator('[data-testid="cta-primary"]');
    const href = await cta.getAttribute("href");
    expect(href).toMatch(/^(https?:|mailto:)/);
  });

  test("Hero CTA link text is descriptive (not 'click here')", async ({
    page,
  }) => {
    const cta = page.locator('[data-testid="cta-primary"]');
    const text = await cta.innerText();
    expect(text.trim().toLowerCase()).not.toBe("click here");
    expect(text.trim().toLowerCase()).not.toBe("más info");
    expect(text.trim().length).toBeGreaterThan(3);
  });

  test("Hero CTA is focusable via keyboard", async ({ page }) => {
    const cta = page.locator('[data-testid="cta-primary"]');
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  test("Services section is visible with correct data-testid (AC-LV-08)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();
  });

  test("Services section contains at least 3 service cards (AC-LV-08, FR-LV-07)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();

    // Cards identified by data-testid prefix
    const cards = services.locator('[data-testid^="service-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("Services section includes Mantenimiento Preventivo, Diagnóstico, and Reparación Mayor (FR-LV-07)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();

    const text = await services.innerText();
    expect(text).toContain("Mantenimiento");
    expect(text).toContain("Diagnóstico");
    expect(text).toContain("Reparación");
  });

  test("Final CTA section is visible (FR-LV-10)", async ({ page }) => {
    const finalCta = page.locator('[data-testid="cta-final"]');
    await expect(finalCta).toBeVisible();
  });

  test("Final CTA href is not empty and not '#' (FR-LV-10, AC-LV-09)", async ({
    page,
  }) => {
    const finalCta = page.locator('[data-testid="cta-final"]');
    await expect(finalCta).toBeVisible();

    const href = await finalCta.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toBe("#");
    expect(href).not.toBe("");
  });

  test("Final CTA link text is descriptive (not 'click here' or empty) (FR-LV-10)", async ({
    page,
  }) => {
    const finalCta = page.locator('[data-testid="cta-final"]');
    const text = await finalCta.innerText();

    expect(text.trim().length).toBeGreaterThan(3);
    expect(text.trim().toLowerCase()).not.toBe("click here");
    expect(text.trim().toLowerCase()).not.toBe("clic aquí");
    expect(text.trim().toLowerCase()).not.toBe("más info");
  });

  test("Final CTA href resolves to a mailto: or https: URL", async ({
    page,
  }) => {
    const finalCta = page.locator('[data-testid="cta-final"]');
    const href = await finalCta.getAttribute("href");
    expect(href).toMatch(/^(https?:|mailto:)/);
  });
});
