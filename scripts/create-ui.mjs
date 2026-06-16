import fs from 'fs'
import path from 'path'

const componentName = process.argv[2]

if (!componentName) {
console.error(
'❌ Please provide a component name.\nExample: pnpm create:ui Button'
)
process.exit(1)
}

const uiRoot = path.join(
process.cwd(),
'apps/web/app/shared/ui'
)

const componentPath = path.join(
uiRoot,
componentName
)

if (fs.existsSync(componentPath)) {
console.error(
`❌ Component "${componentName}" already exists.`
)
process.exit(1)
}

fs.mkdirSync(componentPath, {
recursive: true,
})

/**

* Vue Component
  */
  const vueComponent = `<script setup lang="ts">

defineOptions({
name: '${componentName}',
})

</script>

<template>
  <div>
    <slot />
  </div>
</template>
`

fs.writeFileSync(
path.join(componentPath, `${componentName}.vue`),
vueComponent
)

/**

* Local Barrel
  */
  const localBarrel = `export { default as ${componentName} } from './${componentName}.vue'
  `

fs.writeFileSync(
path.join(componentPath, 'index.ts'),
localBarrel
)

/**

* Storybook
  */
  const storyFile = `import type { Meta, StoryObj } from '@storybook/vue3'
  import { ${componentName} } from './index'

const meta: Meta<typeof ${componentName}> = {
title: 'Shared/${componentName}',
component: ${componentName},
}

export default meta

type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
render: () => ({
components: {
${componentName},
},
template: `
<${componentName}>
Example Content
</${componentName}>
`,
}),
}
`

fs.writeFileSync(
path.join(
componentPath,
`${componentName}.stories.ts`
),
storyFile
)

/**

* Vitest
  */
  const testFile = `import { describe, expect, it } from 'vitest'

describe('${componentName}', () => {
it('should be defined', () => {
expect(true).toBe(true)
})
})
`

fs.writeFileSync(
path.join(
componentPath,
`${componentName}.spec.ts`
),
testFile
)

/**

* Root Barrel
  */
  const rootBarrelPath = path.join(
  uiRoot,
  'index.ts'
  )

if (!fs.existsSync(rootBarrelPath)) {
fs.writeFileSync(rootBarrelPath, '')
}

const exportLine = `export * from './${componentName}'\n`

const currentContent = fs.readFileSync(
rootBarrelPath,
'utf8'
)

if (!currentContent.includes(exportLine)) {
fs.appendFileSync(
rootBarrelPath,
exportLine
)
}

console.log(`
✅ UI Component created successfully

${componentName}

Generated:

shared/ui/${componentName}

├── ${componentName}.vue
├── ${componentName}.stories.ts
├── ${componentName}.spec.ts
└── index.ts
`)
