import fs from 'fs'
import path from 'path'

const moduleName = process.argv[2]

if (!moduleName) {
  console.error('Please provide a module name')
  process.exit(1)
}

const modulePath = path.join(
  process.cwd(),
  'apps/web/app/modules',
  moduleName
)

const pascalCase =
  moduleName.charAt(0).toUpperCase() +
  moduleName.slice(1)

const folders = [
  'api',
  'components',
  'composables',
  'pages',
  'stores',
  'types',
  'tests',
]

folders.forEach((folder) => {
  fs.mkdirSync(
    path.join(modulePath, folder),
    { recursive: true }
  )
})

fs.writeFileSync(
  path.join(
    modulePath,
    'api',
    `${moduleName}.repository.ts`
  ),
  `export class ${pascalCase}Repository {

}
`
)

fs.writeFileSync(
  path.join(
    modulePath,
    'composables',
    `use${pascalCase}.ts`
  ),
  `export const use${pascalCase} = () => {

}
`
)

fs.writeFileSync(
  path.join(
    modulePath,
    'pages',
    `${pascalCase}Page.vue`
  ),
  `<template>
  <div>
    ${pascalCase} Page
  </div>
</template>
`
)

fs.writeFileSync(
  path.join(
    modulePath,
    'stores',
    `${moduleName}.store.ts`
  ),
  `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const use${pascalCase}Store = defineStore('${moduleName}', () => {
  // Estado persistente do módulo ${pascalCase}.
  // Popule via composable — o store apenas armazena.

  return {}
})
`
)

console.log(
  `Module "${moduleName}" created successfully.`
)