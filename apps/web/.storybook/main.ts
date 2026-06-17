import { resolve } from 'node:path'

import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  stories: ['../app/shared/ui/**/*.stories.@(js|ts)'],

  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  async viteFinal(config) {
    config.plugins = [...(config.plugins || []), vue(), tailwindcss()]

    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': resolve(__dirname, '../app/shared'),
      '@core': resolve(__dirname, '../app/core'),
      '@modules': resolve(__dirname, '../app/modules'),
    }

    return config
  },
}

export default config
