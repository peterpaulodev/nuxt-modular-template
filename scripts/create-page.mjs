import fs from 'fs'
import path from 'path'

const pageName = process.argv[2]

if (!pageName) {
console.error(
'❌ Please provide a page name.\nExample: pnpm create:page customers'
)
process.exit(1)
}

const pagesPath = path.join(
process.cwd(),
'apps/web/app/pages'
)

const modulePath = path.join(
process.cwd(),
'apps/web/app/modules',
pageName
)

if (!fs.existsSync(modulePath)) {
console.error(`
❌ Module "${pageName}" not found.

Create the module first:

pnpm create:module ${pageName}
`)
process.exit(1)
}

const pascalCase =
pageName.charAt(0).toUpperCase() +
pageName.slice(1)

const pageFile = `<script setup lang="ts">
import ${pascalCase}Page from '@modules/${pageName}/pages/${pascalCase}Page.vue' </script>

<template>
  <${pascalCase}Page />
</template>
`

fs.mkdirSync(pagesPath, {
recursive: true,
})

const pagePath = path.join(
pagesPath,
`${pageName}.vue`
)

if (fs.existsSync(pagePath)) {
console.error(
`❌ Page "${pageName}" already exists.`
)
process.exit(1)
}

fs.writeFileSync(
pagePath,
pageFile
)

console.log(`
✅ Route created successfully

Route:
/${pageName}

File:
app/pages/${pageName}.vue

Connected Module:
app/modules/${pageName}/pages/${pascalCase}Page.vue
`)
