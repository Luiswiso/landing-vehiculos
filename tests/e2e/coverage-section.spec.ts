import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

const FIXTURE_PATH = join(
  process.cwd(),
  "src/lib/cms/providers/fixtures/landing-stats.json",
);

/**
 * coverage-section.spec.ts
 * Covers: FR-LV-08, AC-LV-07 (partial), design §7.3
 * Tests the Coverage section: renders, coberturaKm value visible,
 * aria-labelledby present and pointing to an h2.
 */

test.describe("Coverage section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Coverage section renders and is visible", async ({ page }) => {
    // Coverage section is identified by its aria-labelledby or heading text
    const section = page.locator("section[aria-labelledby='coverage-heading']");
    await expect(section).toBeVisible();
  });

  test("Coverage section has aria-labelledby pointing to an existing h2 (design §7.3)", async ({
    page,
  }) => {
    const section = page.locator("section[aria-labelledby='coverage-heading']");
    await expect(section).toBeVisible();

    const headingId = await section.getAttribute("aria-labelledby");
    expect(headingId).toBe("coverage-heading");

    const heading = page.locator(`#${headingId}`);
    await expect(heading).toBeVisible();

    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("h2");
  });

  test("Coverage section heading text is non-empty", async ({ page }) => {
    const heading = page.locator("#coverage-heading");
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test("coberturaKm value from fixture is visible in the Coverage section (FR-LV-08)", async ({
    page,
  }) => {
    const fixture = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8")) as {
      coberturaKm: number;
    };

    const section = page.locator("section[aria-labelledby='coverage-heading']");
    await expect(section).toBeVisible();

    const text = await section.innerText();
    // The section must display the coberturaKm value
    expect(text).toContain(String(fixture.coberturaKm));
  });

  test("Coverage section includes a visual representation (map image or SVG) (FR-LV-08)", async ({
    page,
  }) => {
    const section = page.locator("section[aria-labelledby='coverage-heading']");
    await expect(section).toBeVisible();

    // Must include an <img> for the coverage map
    const img = section.locator("img");
    const count = await img.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("Coverage map image has a non-empty alt attribute (AC-LV-06)", async ({
    page,
  }) => {
    const section = page.locator("section[aria-labelledby='coverage-heading']");
    const img = section.locator("img").first();
    await expect(img).toBeVisible();

    const alt = await img.getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt!.trim().length).toBeGreaterThan(0);
  });
});
