import type { LandingStatsProvider } from "../landing-stats";

export const cmsProvider: LandingStatsProvider = {
  cacheTtlSeconds: 60,
  async fetchRaw(): Promise<unknown> {
    const endpoint = import.meta.env.CMS_LANDING_URL;

    if (!endpoint) {
      throw new Error(
        "CMS not configured: CMS_LANDING_URL environment variable is required when LANDING_PROVIDER=cms. " +
          "Set it in your .env file or deployment environment.",
      );
    }

    const timeoutMs = Number(import.meta.env.CMS_FETCH_TIMEOUT_MS ?? "5000");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: import.meta.env.CMS_TOKEN
          ? { Authorization: `Bearer ${import.meta.env.CMS_TOKEN}` }
          : {},
      });

      if (!res.ok) {
        throw new Error(
          `CMS fetch failed with status ${res.status}: ${res.statusText}`,
        );
      }

      return (await res.json()) as unknown;
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(
          `CMS fetch timed out after ${timeoutMs}ms. Check CMS_FETCH_TIMEOUT_MS and CMS_LANDING_URL.`,
          { cause: err },
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
