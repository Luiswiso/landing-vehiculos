import { test, expect } from "@playwright/test";

test.describe("SEO baseline", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page has non-empty <title> (AC-LV-07)", async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('<meta name="description"> is non-empty (AC-LV-07)', async ({
    page,
  }) => {
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
    expect(description!.trim().length).toBeGreaterThan(0);
  });

  test("og:title meta tag is present and non-empty", async ({ page }) => {
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();
    expect(ogTitle!.trim().length).toBeGreaterThan(0);
  });

  test("og:description meta tag is present and non-empty", async ({ page }) => {
    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogDescription).toBeTruthy();
    expect(ogDescription!.trim().length).toBeGreaterThan(0);
  });

  test("og:image meta tag is present and non-empty", async ({ page }) => {
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBeTruthy();
    expect(ogImage!.trim().length).toBeGreaterThan(0);
  });

  test("og:type is set to 'website'", async ({ page }) => {
    const ogType = await page
      .locator('meta[property="og:type"]')
      .getAttribute("content");
    expect(ogType).toBe("website");
  });

  test('<link rel="canonical"> is present with an absolute URL', async ({
    page,
  }) => {
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBeTruthy();
    // Must be an absolute URL (starts with http)
    expect(canonical).toMatch(/^https?:\/\//);
  });

  test('<html> element has lang="es"', async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("es");
  });

  test("JSON-LD script tag is present and parseable", async ({ page }) => {
    // Wait for the island to resolve so JSON-LD is injected
    await page.waitForTimeout(2000);

    const jsonldContent = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(jsonldContent).toBeTruthy();

    // Must parse as valid JSON — never ships broken structured data
    expect(() => {
      JSON.parse(jsonldContent!);
    }).not.toThrow();

    // Must be AutoRepair type per design §7.2
    const parsedData = JSON.parse(jsonldContent!) as Record<string, unknown>;
    expect(parsedData["@type"]).toBe("AutoRepair");
    expect(parsedData["@context"]).toBe("https://schema.org");
  });

  test("JSON-LD contains areaServed with geoRadius", async ({ page }) => {
    await page.waitForTimeout(2000);

    const jsonldContent = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(jsonldContent).toBeTruthy();

    const data = JSON.parse(jsonldContent!) as Record<string, unknown>;
    const areaServed = data["areaServed"] as Record<string, unknown>;
    expect(areaServed).toBeDefined();
    expect(areaServed["@type"]).toBe("GeoCircle");
    expect(typeof areaServed["geoRadius"]).toBe("number");
    expect(areaServed["geoRadius"] as number).toBeGreaterThan(0);
  });

  test("title contains 'Servicio de Flota Pesada'", async ({ page }) => {
    const title = await page.title();
    expect(title).toContain("Servicio de Flota Pesada");
  });

  test("title is 60 chars or fewer", async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
  });
});
