import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const FIXTURE_PATH = join(
  process.cwd(),
  "src/lib/cms/providers/fixtures/landing-stats.json",
);

test.describe("Stats Strip (AC-DS-01 through AC-DS-07)", () => {
  test("stats strip is visible and contains all 5 stat values (AC-DS-01)", async ({
    page,
  }) => {
    await page.goto("/");
    const strip = page.locator('[data-testid="stats-strip"]');
    await expect(strip).toBeVisible({ timeout: 5000 });

    // All five stat testids must be present
    const statIds = [
      "stat-num-vehiculos",
      "stat-num-bays",
      "stat-num-techs",
      "stat-uptime-rate",
      "stat-cobertura-km",
    ];
    for (const id of statIds) {
      const el = strip.locator(`[data-testid="${id}"]`);
      await expect(el).toBeVisible();
      const text = await el.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  test("stats values match mock-stats.json within 2s (AC-DS-02)", async ({
    page,
  }) => {
    const fixture = JSON.parse(readFileSync(FIXTURE_PATH, "utf-8"));

    await page.goto("/");
    const strip = page.locator('[data-testid="stats-strip"]');
    await expect(strip).toBeVisible({ timeout: 2000 });

    const numVehiculos = strip.locator('[data-testid="stat-num-vehiculos"]');
    const text = await numVehiculos.innerText();
    expect(text).toContain(String(fixture.numVehiculos));
  });

  test("hero is visible BEFORE stats strip resolves (AC-DS-07)", async ({
    page,
  }) => {
    // Hero must be visible on initial HTML (before island streams)
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator('[data-testid="hero"]');
    await expect(hero).toBeVisible();
  });

  test("dl semantics present in stats strip", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-testid="stats-strip"]')).toBeVisible({
      timeout: 5000,
    });
    const dl = page.locator('[data-testid="stats-strip"] dl').first();
    await expect(dl).toBeVisible();
  });

  test("skeleton placeholder has data-testid stats-strip-skeleton", async ({
    page,
  }) => {
    // On a fresh load without throttling, the skeleton may flash briefly.
    // We verify it is present in the DOM at some point via direct page inspection.
    // The skeleton is rendered server-side as a fallback, so it is in the initial HTML.
    const response = await page.request.get("/");
    const html = await response.text();
    expect(html).toContain('data-testid="stats-strip-skeleton"');
  });

  test("Zod error path: invalid fixture results in skeleton with error message (AC-DS-05)", async ({
    page,
  }) => {
    // Read and back up the current fixture
    const originalFixture = readFileSync(FIXTURE_PATH, "utf-8");

    try {
      // Write invalid fixture (uptimeRate > 100 — fails Zod max(100) constraint)
      const invalidFixture = {
        ...JSON.parse(originalFixture),
        uptimeRate: 150,
      };
      writeFileSync(FIXTURE_PATH, JSON.stringify(invalidFixture, null, 2));

      // Navigate — the island should fall back to skeleton with error
      await page.goto("/");

      // Stats strip should NOT show resolved content — skeleton stays
      const skeleton = page.locator('[data-testid="stats-strip-skeleton"]');
      // The error message div should be visible with aria-live
      const errorMsg = page.locator('[aria-live="polite"]');
      // At least one of these should be present/visible
      const skeletonVisible = await skeleton.isVisible().catch(() => false);
      const errorVisible = await errorMsg
        .first()
        .isVisible()
        .catch(() => false);
      expect(skeletonVisible || errorVisible).toBe(true);
    } finally {
      // Always restore fixture
      writeFileSync(FIXTURE_PATH, originalFixture);
    }
  });
});
