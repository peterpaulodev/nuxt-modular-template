# CLAUDE.md — apps/web

## Stack

- **Nuxt 4** (`compatibilityDate: '2026-06-15'`) — app directory at `app/`
- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** (strict)
- **Pinia** (`@pinia/nuxt`) — state management
- **Vitest 4** + `@vue/test-utils 2` + jsdom — unit tests
- **TailwindCSS 4** (`@tailwindcss/vite`) — via Vite plugin
- **ofetch** — HTTP client (`$fetch.create`)

## Path aliases

Defined in both `nuxt.config.ts` and `vitest.config.ts`:

```
@core    → app/core/
@shared  → app/shared/
@modules → app/modules/
```

```ts
import { ApiError } from '@core/api'
import { Button } from '@shared/ui'
import { useDashboard } from '@modules/dashboard/composables/useDashboard'
```

## Architecture layers

```
Core      ← infrastructure (api, auth, config, errors, permissions, telemetry)
  ↑
Shared    ← internal library (ui components, utils, shared types)
  ↑
Modules   ← business domains (dashboard, banking, etc.)
```

**Hard rule**: modules never import from other modules. If two modules need to share
something, move it to `shared/` or `core/`.

## Core layer (`app/core/`)

| Directory      | Purpose                  | Key export                                                 |
| -------------- | ------------------------ | ---------------------------------------------------------- |
| `api/`         | HTTP client + error type | `createHttpClient()`, `ApiError`                           |
| `auth/`        | Auth service stub        | `AuthService.isAuthenticated()`, `.getToken()`             |
| `config/`      | Runtime config wrapper   | `useAppConfig()`                                           |
| `errors/`      | Error hierarchy          | `AppError`, `ApiError`, `BusinessError`, `ValidationError` |
| `permissions/` | Permissions stub         | `PermissionsService.can(permission)`                       |
| `telemetry/`   | Telemetry stub           | `TelemetryService.trackEvent()`, `.trackError()`           |

```ts
// Reading runtime config
import { useAppConfig } from '@core/config'
const { apiBaseUrl, appName, appEnv, enableTelemetry } = useAppConfig()

// Making HTTP requests
import { createHttpClient } from '@core/api'
const http = createHttpClient()
const data = await http<User[]>('/users')

// Typed error handling
import { ApiError } from '@core/api'
if (e instanceof ApiError) {
  console.error(e.status, e.message)
}
```

## Module structure

Every business domain lives in `app/modules/<name>/`:

```
modules/<name>/
├── api/            # Repositories, DTOs, mappers — all HTTP calls go here
├── components/     # Domain-specific Vue components (not reused outside module)
├── composables/    # Orchestration: calls repository, delegates state to store
├── pages/          # Page components consumed by Nuxt routes
├── stores/         # Pinia stores — persistent state for this domain
├── types/          # Domain types (DTOs stay inside api/, domain types go here)
└── tests/          # Unit tests
```

**Reference implementation**: `modules/dashboard/` is the canonical example — read it
before adding a new module.

## Creating a feature

```bash
pnpm create:feature banking   # module + Nuxt route (most common)
pnpm create:module banking    # module structure only
pnpm create:page banking      # route wrapper for an existing module
pnpm create:ui AccountCard    # shared UI component in shared/ui/ (PascalCase)
```

`create:feature banking` generates:

```
modules/banking/
├── api/banking.repository.ts
├── components/
├── composables/useBanking.ts
├── pages/BankingPage.vue
├── stores/banking.store.ts
├── types/
└── tests/

app/pages/banking.vue     ← Nuxt route; wraps BankingPage with definePageMeta
```

## Typical implementation order

1. Define domain types in `types/`
2. Implement repository in `api/` (DTOs stay local to the repository file)
3. Create Pinia store in `stores/`
4. Create composable in `composables/` — orchestrates repo + store
5. Build domain components in `components/`
6. Assemble in `pages/<Name>Page.vue`
7. Add `definePageMeta` in `app/pages/<name>.vue` (**not** in the module page)
8. Write tests in `tests/`

## Store pattern

```ts
// stores/banking.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Account } from '../types'

export const useBankingStore = defineStore('banking', () => {
  const accounts = ref<Account[]>([])

  return { accounts }
})
```

The store only stores — the composable is responsible for populating it.

## Composable pattern

```ts
// composables/useBanking.ts
import { ApiError } from '@core/api'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { BankingRepository } from '../api/banking.repository'
import { useBankingStore } from '../stores/banking.store'

export const useBanking = () => {
  const store = useBankingStore()
  const { accounts } = storeToRefs(store) // reactive ref, not a copy

  const repository = new BankingRepository()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadAccounts = async () => {
    isLoading.value = true
    error.value = null
    try {
      store.accounts = await repository.getAccounts()
    } catch (e) {
      error.value =
        e instanceof ApiError
          ? `Error ${e.status}: ${e.message}`
          : 'Unexpected error. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return { accounts, isLoading, error, loadAccounts }
}
```

**Import order** (enforced by `simple-import-sort`): `@core/...` → `pinia` → `vue` → relative imports.

## Testing patterns

Tests use Vitest + `@vue/test-utils` + jsdom. See `modules/dashboard/tests/` for canonical examples.

**Mocking a class-based repository:**

```ts
// ⚠️ vi.hoisted ensures the fn is defined before vi.mock is hoisted to the top
const mockGetAccounts = vi.hoisted(() => vi.fn())

// ⚠️ Use function() not an arrow function — arrow functions can't be constructors
vi.mock('../api/banking.repository', () => ({
  BankingRepository: vi.fn().mockImplementation(function () {
    return { getAccounts: mockGetAccounts }
  }),
}))

// ⚠️ Always mock http-client to prevent ofetch/Nuxt runtime deps loading in Vitest
vi.mock('@core/api/http-client', () => ({
  createHttpClient: vi.fn(),
}))
```

**beforeEach setup:**

```ts
beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks() // ⚠️ NOT vi.resetAllMocks() — reset destroys the mock implementation
})
```

## Environment variables

```bash
# File must be at apps/web/.env — Nuxt ignores the repo root .env
cp apps/web/.env.example apps/web/.env
```

All variables use the `NUXT_PUBLIC_` prefix (auto-injected into `runtimeConfig.public`):

```
NUXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
NUXT_PUBLIC_APP_NAME=Nuxt Modular Monolith
NUXT_PUBLIC_APP_ENV=local
NUXT_PUBLIC_ENABLE_TELEMETRY=false
```

`runtimeConfig.public` in `nuxt.config.ts` has **empty string defaults** intentionally —
Nuxt injects values from env at runtime.

## ⚠️ Gotchas

| #   | Issue                                                                               | Rule                                                                                  |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | `definePageMeta` is silently ignored in `modules/*/pages/*.vue`                     | Only works in `app/pages/*.vue` (Nuxt route files)                                    |
| 2   | `.env` at repo root is not loaded by Nuxt                                           | Place `.env` at `apps/web/.env` (next to `nuxt.config.ts`)                            |
| 3   | `vi.resetAllMocks()` destroys `.mockImplementation()` on class mocks                | Use `vi.clearAllMocks()` (clears call history, preserves implementation)              |
| 4   | Variables declared in the test body are `undefined` inside `vi.mock` (it's hoisted) | Declare shared mock functions with `vi.hoisted(() => vi.fn())`                        |
| 5   | `ofetch` and `useRuntimeConfig` are Nuxt runtime deps — they throw in Vitest        | Always mock `@core/api/http-client` in tests that touch modules using the HTTP client |
| 6   | Import order is enforced by `simple-import-sort` (ESLint error on wrong order)      | `@core/...` → `pinia` → `vue` → relative imports                                      |
