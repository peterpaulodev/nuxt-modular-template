import { execSync } from 'child_process'

const featureName = process.argv[2]

if (!featureName) {
  console.error(
    '❌ Please provide a feature name.\nExample: pnpm create:feature banking'
  )
  process.exit(1)
}

try {
  console.log(`🚀 Creating feature "${featureName}"...\n`)

  execSync(
    `node scripts/create-module.mjs ${featureName}`,
    { stdio: 'inherit' }
  )

  execSync(
    `node scripts/create-page.mjs ${featureName}`,
    { stdio: 'inherit' }
  )

  console.log(`
✅ Feature "${featureName}" created successfully

Generated:

app/modules/${featureName}
app/pages/${featureName}.vue
`)
} catch (error) {
  console.error(
    '\n❌ Failed to create feature.'
  )
  process.exit(1)
}