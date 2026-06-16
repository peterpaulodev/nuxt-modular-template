import fs from 'fs'
import path from 'path'

const componentName = process.argv[2]

if (!componentName) {
  console.error(
    '❌ Please provide a component name.\nExample: pnpm create:ui Button'
  )
  process.exit(1)
}

const uiRoot = path.join(process.cwd(), 'apps/web/app/shared/ui')
const componentPath = path.join(uiRoot, componentName)

if (fs.existsSync(componentPath)) {
  console.error(`❌ Component "${componentName}" already exists.`)
  process.exit(1)
}

fs.mkdirSync(componentPath, { recursive: true })

/**
 * Vue Component
 */
const vueComponent = [
  '<script setup lang="ts">',
  '',
  'defineProps<{',
  '  // Add props here',
  '}>',
  '',
  '</script>',
  '',
  '<template>',
  '  <div>',
  '    <slot />',
  '  </div>',
  '</template>',
  '',
].join('\n')

fs.writeFileSync(path.join(componentPath, `${componentName}.vue`), vueComponent)

/**
 * Local Barrel
 */
const localBarrel = `export { default as ${componentName} } from './${componentName}.vue'\n`

fs.writeFileSync(path.join(componentPath, 'index.ts'), localBarrel)

/**
 * Storybook
 */
const storyLines = [
  `import type { Meta, StoryObj } from '@storybook/vue3'`,
  `import ${componentName} from './${componentName}.vue'`,
  ``,
  `const meta: Meta<typeof ${componentName}> = {`,
  `  title: 'Shared/${componentName}',`,
  `  component: ${componentName},`,
  `  tags: ['autodocs'],`,
  `}`,
  ``,
  `export default meta`,
  ``,
  `type Story = StoryObj<typeof ${componentName}>`,
  ``,
  `export const Default: Story = {`,
  `  render: (args) => ({`,
  `    components: { ${componentName} },`,
  `    setup() { return { args } },`,
  `    template: '<${componentName} v-bind="args">Example Content</${componentName}>',`,
  `  }),`,
  `}`,
  ``,
]

fs.writeFileSync(
  path.join(componentPath, `${componentName}.stories.ts`),
  storyLines.join('\n')
)

/**
 * Vitest
 */
const testLines = [
  `import { describe, expect, it } from 'vitest'`,
  ``,
  `describe('${componentName}', () => {`,
  `  it('should be defined', () => {`,
  `    expect(true).toBe(true)`,
  `  })`,
  `})`,
  ``,
]

fs.writeFileSync(
  path.join(componentPath, `${componentName}.spec.ts`),
  testLines.join('\n')
)

/**
 * Root Barrel
 */
const rootBarrelPath = path.join(uiRoot, 'index.ts')

if (!fs.existsSync(rootBarrelPath)) {
  fs.writeFileSync(rootBarrelPath, '')
}

const exportLine = `export * from './${componentName}'\n`
const currentContent = fs.readFileSync(rootBarrelPath, 'utf8')

if (!currentContent.includes(exportLine)) {
  fs.appendFileSync(rootBarrelPath, exportLine)
}

console.log(`
✅ UI Component created successfully

  ${componentName}/
  ├── ${componentName}.vue
  ├── ${componentName}.stories.ts
  ├── ${componentName}.spec.ts
  └── index.ts
`)
