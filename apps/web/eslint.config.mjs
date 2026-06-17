import simpleImportSort from 'eslint-plugin-simple-import-sort'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'prefer-const': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/shared/ui/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
