# 🛠️ Generators

Este projeto fornece geradores para acelerar o desenvolvimento e garantir consistência arquitetural.

O objetivo dos generators é reduzir trabalho repetitivo, padronizar estruturas e reforçar as regras definidas pela arquitetura Modular Monolith.

---

# 🎯 Filosofia

Os generators existem para:

* Reduzir código boilerplate
* Padronizar a estrutura dos módulos
* Facilitar onboarding
* Evitar divergências arquiteturais
* Melhorar Developer Experience

Sempre que possível, prefira utilizar os generators em vez de criar estruturas manualmente.

---

# 📦 Comandos Disponíveis

| Comando                      | Descrição                        |
| ---------------------------- | -------------------------------- |
| `pnpm create:feature <name>` | Cria uma feature completa        |
| `pnpm create:module <name>`  | Cria um módulo                   |
| `pnpm create:page <name>`    | Cria uma rota Nuxt               |
| `pnpm create:ui <name>`      | Cria um componente compartilhado |

---

# 🚀 create:feature

Comando recomendado para criação de novas funcionalidades.

```bash
pnpm create:feature banking
```

Estrutura gerada:

```text
modules/banking

├── api/
├── components/
├── composables/
├── pages/
├── types/
└── tests/

app/pages/banking.vue
```

Este comando combina:

```bash
create:module
create:page
```

em uma única operação.

---

## Quando utilizar

✅ Novos domínios de negócio

✅ Novas áreas da plataforma

✅ Novas funcionalidades independentes

Exemplos:

```bash
pnpm create:feature banking
pnpm create:feature customers
pnpm create:feature antifraud
pnpm create:feature reports
```

---

# 📦 create:module

Cria apenas a estrutura de um módulo.

```bash
pnpm create:module banking
```

Estrutura gerada:

```text
modules/banking

├── api/
├── components/
├── composables/
├── pages/
├── types/
└── tests/
```

---

## Quando utilizar

✅ Criação incremental de módulos

✅ Refatorações

✅ Domínios sem rota própria

Exemplo:

```bash
pnpm create:module notifications
```

---

# 🛣️ create:page

Cria uma rota Nuxt conectada a um módulo existente.

```bash
pnpm create:page banking
```

Arquivo gerado:

```text
app/pages/banking.vue
```

Conteúdo:

```vue
<script setup lang="ts">
import BankingPage from '@modules/banking/pages/BankingPage.vue'
</script>

<template>
  <BankingPage />
</template>
```

---

## Quando utilizar

✅ Adicionar novas rotas

✅ Expor módulos existentes

✅ Criar páginas adicionais

Exemplos:

```bash
pnpm create:page banking
pnpm create:page reports
pnpm create:page customers
```

---

# 🎨 create:ui

Cria um componente compartilhado dentro de Shared UI.

```bash
pnpm create:ui Button
```

Estrutura gerada:

```text
shared/ui/Button

├── Button.vue
├── Button.spec.ts
├── Button.stories.ts
└── index.ts
```

Além disso:

* Atualiza automaticamente o barrel local
* Atualiza automaticamente o barrel global
* Cria estrutura pronta para testes
* Cria estrutura pronta para Storybook

---

## Quando utilizar

✅ Componentes reutilizáveis

✅ Componentes de Design System

✅ Componentes utilizados por múltiplos módulos

Exemplos:

```bash
pnpm create:ui Button
pnpm create:ui DataTable
pnpm create:ui Modal
pnpm create:ui PageHeader
```

---

# 📏 Convenções

## Feature e Module

Utilizar sempre:

```text
kebab-case
```

Exemplos:

```bash
pnpm create:feature customer-management
pnpm create:module antifraud
pnpm create:page audit-log
```

---

## Componentes

Utilizar sempre:

```text
PascalCase
```

Exemplos:

```bash
pnpm create:ui Button
pnpm create:ui DataTable
pnpm create:ui UserAvatar
```

---

# 🔒 Regras Arquiteturais

Os generators foram projetados para reforçar as regras da arquitetura.

Ao criar uma feature:

```text
Route
 ↓
Module Page
 ↓
Composable
 ↓
Repository
 ↓
Core HTTP Client
```

Evite:

```text
Page → HTTP Client
Component → Repository
Component → Backend
```

Toda comunicação externa deve ser encapsulada através de repositories e composables.

---

# 🗺️ Roadmap

Generators planejados para futuras versões:

```text
create:store
create:repository
create:composable
create:test
create:layout
create:middleware
create:plugin
```

Esses generators serão adicionados conforme a arquitetura evoluir e necessidades reais surgirem.

---

# 💡 Recomendação

Para novas funcionalidades, utilize sempre:

```bash
pnpm create:feature <name>
```

Esse é o fluxo padrão e recomendado pelo template.

Os demais generators devem ser utilizados em cenários específicos ou durante evoluções incrementais da aplicação.
