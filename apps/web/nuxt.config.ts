import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  alias: {
    '@core': resolve('./app/core'),
    '@shared': resolve('./app/shared'),
    '@modules': resolve('./app/modules'),
  },
  css: ['~/app.css'],
  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
  },
  // Declara as chaves de configuração pública da aplicação.
  // Os valores são injetados em runtime via variáveis de ambiente: NUXT_PUBLIC_<CHAVE_EM_UPPER_SNAKE>.
  // Configure o ambiente copiando .env.example para .env.
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      appName: '',
      appEnv: '',
      enableTelemetry: false,
    },
  },
})
