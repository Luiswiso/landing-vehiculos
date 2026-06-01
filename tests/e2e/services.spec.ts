import { test, expect } from "@playwright/test";

/**
 * services.spec.ts
 * Covers: FR-LV-07, AC-LV-08, design §7.3
 * Tests the Services section: renders, at least 3 service cards,
 * aria-labelledby present, heading hierarchy correct.
 */

test.describe("Services section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Services section is visible with data-testid (AC-LV-08)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();
  });

  test("Services section has aria-labelledby attribute (design §7.3)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    const labelledBy = await services.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("services-heading");
  });

  test("aria-labelledby on Services section points to an existing h2 (design §7.3)", async ({
    page,
  }) => {
    const heading = page.locator("#services-heading");
    await expect(heading).toBeVisible();

    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("h2");
  });

  test("Services section heading has non-empty text", async ({ page }) => {
    const heading = page.locator("#services-heading");
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test("Services section contains at least 3 service cards (AC-LV-08, FR-LV-07)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();

    const cards = services.locator('[data-testid^="service-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("Service cards use h3 headings under the section h2 (NFR-LV-07 — heading hierarchy)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();

    // Cards should use h3 (under section h2 — correct hierarchy)
    const cardHeadings = services.locator("h3");
    const count = await cardHeadings.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("each service card has a non-empty heading and description (FR-LV-07)", async ({
    page,
  }) => {
    const cards = page.locator('[data-testid^="service-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const heading = card.locator("h3");
      const headingText = await heading.innerText();
      expect(headingText.trim().length).toBeGreaterThan(0);

      // Card should have visible text content (the description)
      const cardText = await card.innerText();
      expect(cardText.trim().length).toBeGreaterThan(0);
    }
  });

  test("Services section includes Mantenimiento Preventivo card (FR-LV-07)", async ({
    page,
  }) => {
    const card = page.locator('[data-testid="service-card-mantenimiento"]');
    await expect(card).toBeVisible();
    const text = await card.innerText();
    expect(text).toContain("Mantenimiento");
  });

  test("Services section includes Diagnóstico card (FR-LV-07)", async ({
    page,
  }) => {
    const card = page.locator('[data-testid="service-card-diagnostico"]');
    await expect(card).toBeVisible();
    const text = await card.innerText();
    expect(text).toContain("Diagnóstico");
  });

  test("Services section includes Reparación Mayor card (FR-LV-07)", async ({
    page,
  }) => {
    const card = page.locator('[data-testid="service-card-reparacion"]');
    await expect(card).toBeVisible();
    const text = await card.innerText();
    expect(text).toContain("Reparación");
  });

  test("Services section uses <article> elements for cards (semantic HTML)", async ({
    page,
  }) => {
    const services = page.locator('[data-testid="services-section"]');
    await expect(services).toBeVisible();

    const articles = services.locator("article");
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
