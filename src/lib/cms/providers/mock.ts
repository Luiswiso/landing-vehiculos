import type { LandingStatsProvider } from "../landing-stats";

export const mockProvider: LandingStatsProvider = {
  cacheTtlSeconds: 0,
  async fetchRaw(): Promise<unknown> {
    // Dynamic import of JSON so Playwright fixture-swap tests can see file changes.
    // Using fs.readFileSync so the file is read fresh on each call (no module cache).
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    const fixturePath = join(
      process.cwd(),
      "src/lib/cms/providers/fixtures/landing-stats.json",
    );
    const raw = readFileSync(fixturePath, "utf-8");
    return JSON.parse(raw) as unknown;
  },
};
