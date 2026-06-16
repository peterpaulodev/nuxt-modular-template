import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-15',
  alias: {
    '@core': resolve('./app/core'),
    '@shared': resolve('./app/shared'),
    '@modules': resolve('./app/modules'),
  },
})