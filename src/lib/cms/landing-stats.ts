import {
  LandingStatsSchema,
  LandingStatsValidationError,
  type LandingStats,
} from "./schema";

export interface LandingStatsProvider {
  fetchRaw(): Promise<unknown>;
  readonly cacheTtlSeconds: number;
}

// Request-scoped memoization: one fetch per process lifetime in SSR
// (Astro server islands each call getLandingStats() independently —
// this cache deduplicates the underlying fetchRaw() within the same
// Node.js module instance, which maps to a single request in Astro's
// per-request server rendering model.)
let _cachedStats: LandingStats | null = null;
let _cacheTimestamp = 0;

export async function getLandingStats(): Promise<LandingStats> {
  // Lazy import to avoid circular deps and to enable env var reading at call time
  const { mockProvider } = await import("./providers/mock");
  const { cmsProvider } = await import("./providers/cms");

  const provider: LandingStatsProvider =
    import.meta.env.LANDING_PROVIDER === "cms" ? cmsProvider : mockProvider;

  const now = Date.now();
  const ttlMs = provider.cacheTtlSeconds * 1000;

  if (_cachedStats !== null && ttlMs > 0 && now - _cacheTimestamp < ttlMs) {
    return _cachedStats;
  }

  const raw = await provider.fetchRaw();
  const parsed = LandingStatsSchema.safeParse(raw);

  if (!parsed.success) {
    throw new LandingStatsValidationError(parsed.error.issues);
  }

  if (ttlMs > 0) {
    _cachedStats = parsed.data;
    _cacheTimestamp = now;
  }

  return parsed.data;
}
