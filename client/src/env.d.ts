/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_MAP_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
