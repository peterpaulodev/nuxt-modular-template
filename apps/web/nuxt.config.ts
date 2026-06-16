import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-15',
  alias: {
    '@core': resolve('./app/core'),
    '@shared': resolve('./app/shared'),
    '@modules': resolve('./app/modules'),
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,

      appName: process.env.NUXT_PUBLIC_APP_NAME,

      appEnv: process.env.NUXT_PUBLIC_APP_ENV,

      enableTelemetry:
        process.env.NUXT_PUBLIC_ENABLE_TELEMETRY === 'true',
    },
  },
})