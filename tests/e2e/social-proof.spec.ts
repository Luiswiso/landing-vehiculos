import { test, expect } from "@playwright/test";

/**
 * social-proof.spec.ts
 * Covers: FR-LV-09, design §7.3
 * Tests the SocialProof section: renders, at least one testimonial visible,
 * aria-labelledby present.
 */

test.describe("SocialProof section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("SocialProof section renders and is visible", async ({ page }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    await expect(section).toBeVisible();
  });

  test("SocialProof section has aria-labelledby attribute (design §7.3)", async ({
    page,
  }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    const labelledBy = await section.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("socialproof-heading");
  });

  test("aria-labelledby on SocialProof points to an existing h2 element (design §7.3)", async ({
    page,
  }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    await expect(section).toBeVisible();

    const heading = page.locator("#socialproof-heading");
    await expect(heading).toBeVisible();

    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe("h2");
  });

  test("SocialProof heading has non-empty text", async ({ page }) => {
    const heading = page.locator("#socialproof-heading");
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test("SocialProof section contains at least one testimonial (FR-LV-09)", async ({
    page,
  }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    await expect(section).toBeVisible();

    // Testimonials are rendered as <figure> or <blockquote> elements
    // Either structure is valid — check for blockquote (testimonial content)
    const testimonials = section.locator("figure, blockquote");
    const count = await testimonials.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("SocialProof testimonials have author information", async ({ page }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    await expect(section).toBeVisible();

    // Each testimonial figure should contain a figcaption with author details
    const figures = section.locator("figure");
    const count = await figures.count();

    if (count > 0) {
      const firstFigure = figures.first();
      const figcaption = firstFigure.locator("figcaption");
      const captionCount = await figcaption.count();
      expect(captionCount).toBeGreaterThanOrEqual(1);

      const captionText = await figcaption.first().innerText();
      expect(captionText.trim().length).toBeGreaterThan(0);
    }
  });

  test("SocialProof testimonial quotes are non-empty", async ({ page }) => {
    const section = page.locator(
      "section[aria-labelledby='socialproof-heading']",
    );
    await expect(section).toBeVisible();

    const quotes = section.locator("blockquote");
    const count = await quotes.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstQuote = await quotes.first().innerText();
    expect(firstQuote.trim().length).toBeGreaterThan(0);
  });
});
