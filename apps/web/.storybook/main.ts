import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../app/shared/ui/**/*.stories.@(js|ts)'],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  viteFinal(config) {
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
