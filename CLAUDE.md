# CLAUDE.md

Nuxt 4 modular monolith template demonstrating domain-driven module architecture.
Reference implementation for presenting the architecture to an engineering team.

## Monorepo structure

```
nuxt-modular-template/
├── apps/web/          # Main Nuxt 4 application
├── packages/
│   └── eslint-config/ # Shared ESLint configuration
├── docs/              # Architecture docs and ADRs
└── scripts/           # Code generators
```

## Commands (run from repo root)

| Command                      | Description                             |
| ---------------------------- | --------------------------------------- |
| `pnpm dev`                   | Start dev server                        |
| `pnpm build`                 | Build for production                    |
| `pnpm test`                  | Run all tests                           |
| `pnpm lint`                  | Run ESLint                              |
| `pnpm lint:fix`              | Auto-fix lint issues                    |
| `pnpm format`                | Format code with Prettier               |
| `pnpm create:feature <name>` | Generate a full module + Nuxt route     |
| `pnpm create:module <name>`  | Generate module structure only          |
| `pnpm create:page <name>`    | Generate a route for an existing module |
| `pnpm create:ui <Name>`      | Generate a shared UI component          |

> Generator naming: `kebab-case` for features/modules, `PascalCase` for UI components.

## Documentation

| File                           | Content                                     |
| ------------------------------ | ------------------------------------------- |
| `docs/architecture.md`         | Architecture overview and principles        |
| `docs/module-guidelines.md`    | Module structure rules and responsibilities |
| `docs/development-workflow.md` | Step-by-step feature workflow               |
| `docs/generators.md`           | What each generator creates                 |
| `docs/adr/`                    | Architecture Decision Records               |

## Technical context

See `apps/web/CLAUDE.md` for the full technical context of the Nuxt app (stack, aliases,
patterns, testing, gotchas).
