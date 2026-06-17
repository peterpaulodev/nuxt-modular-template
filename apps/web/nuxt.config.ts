import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
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
  // O Nuxt sobrescreve automaticamente cada chave em runtime
  // com a variável de ambiente correspondente: NUXT_PUBLIC_<CHAVE_EM_UPPER_SNAKE>.
  // Os valores abaixo são apenas os defaults para desenvolvimento local.
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://jsonplaceholder.typicode.com',
      appName: 'Nuxt Modular Monolith',
      appEnv: 'local',
      enableTelemetry: false,
    },
  },
})
