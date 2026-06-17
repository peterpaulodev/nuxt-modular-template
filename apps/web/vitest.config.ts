import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],

  test: {
    environment: 'jsdom',
  },

  // Espelha os aliases definidos em nuxt.config.ts para que os imports funcionem nos testes
  resolve: {
    alias: {
      '@core': resolve('./app/core'),
      '@shared': resolve('./app/shared'),
      '@modules': resolve('./app/modules'),
    },
  },
})
