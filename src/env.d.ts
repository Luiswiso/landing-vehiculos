/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly LANDING_PROVIDER: "mock" | "cms";
  readonly CMS_LANDING_URL: string;
  readonly CMS_TOKEN: string;
  readonly CMS_FETCH_TIMEOUT_MS: string;
  readonly PARTNERS_CACHE_TTL_SECONDS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
