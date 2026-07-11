/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_BUILD_VERSION?: string;
  readonly PUBLIC_BUILD_COMMIT?: string;
  readonly PUBLIC_BUILD_TIME?: string;
  readonly PUBLIC_BUILD_BRANCH?: string;
  readonly PUBLIC_CATALOG_REVISION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
