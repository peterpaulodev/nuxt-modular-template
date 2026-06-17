# ADR-002 — Routing Pattern (Thin Wrapper)

| Campo     | Valor            |
| --------- | ---------------- |
| Status    | Proposta         |
| Autor     | Peterson Almeida |
| Data      | 17/06/2026       |
| Revisores | A definir        |

## 1. Contexto

Nuxt 4 utiliza roteamento baseado em arquivos: apenas arquivos dentro de `app/pages/` são
reconhecidos como rotas da aplicação.

`definePageMeta` — responsável por configurar middleware de autenticação, layouts e metadados
de rota — **só é processado em arquivos `app/pages/`**. Quando colocado em qualquer outro
arquivo, incluindo componentes de página dentro de módulos (`modules/*/pages/*.vue`), é
**silenciosamente ignorado** pelo Nuxt sem erros ou avisos.

Ao mesmo tempo, a arquitetura modular exige que o código de domínio (componentes, composables,
lógica de tela) viva dentro de seu módulo correspondente em `app/modules/`.

O problema: como conectar o sistema de roteamento do Nuxt à organização por domínio dos módulos,
sem violar nenhum dos dois?

---

## 2. Alternativas Avaliadas

### Opção 1 — Página completa em `app/pages/`

Toda a lógica de UI e composição de componentes fica diretamente em `app/pages/<name>.vue`.

**❌ Problema:** quebra o isolamento de domínio. A página passa a viver fora do módulo,
dificultando a localização de código e violando a separação de responsabilidades.

---

### Opção 2 — `definePageMeta` no componente de página do módulo

```vue
<!-- modules/dashboard/pages/DashboardPage.vue -->
<script setup>
definePageMeta({ middleware: 'auth' }) <!-- ⚠️ ignorado silenciosamente pelo Nuxt -->
</script>
```

**❌ Problema:** Nuxt não processa `definePageMeta` fora de `app/pages/`. O middleware e o
layout simplesmente não são aplicados, sem nenhum aviso de erro em tempo de desenvolvimento.
Esta é a armadilha mais comum ao trabalhar com esta arquitetura.

---

### Opção 3 — Roteamento programático

Definir rotas via `nuxt.config.ts` ou hooks, sem depender do sistema de arquivos.

**❌ Problema:** aumenta complexidade de configuração, perde os benefícios do roteamento
baseado em arquivos (DX, colocação automática de rotas, convenção sobre configuração).

---

### Opção 4 — Padrão Thin Wrapper ✅

Separar em dois arquivos com responsabilidades distintas:

- `app/pages/<name>.vue` → arquivo de rota Nuxt: apenas `definePageMeta` + importa a página do módulo
- `modules/<name>/pages/<Name>Page.vue` → componente de página real com toda a lógica de UI

---

## 3. Decisão

Adotar o **padrão Thin Wrapper** para todas as rotas da aplicação.

```
app/pages/
└── index.vue              ← arquivo de rota Nuxt (wrapper)

app/modules/dashboard/
└── pages/
    └── DashboardPage.vue  ← componente de página real (domínio)
```

### Exemplo: arquivo de rota (`app/pages/index.vue`)

```vue
<script setup lang="ts">
import DashboardPage from "@modules/dashboard/pages/DashboardPage.vue";

definePageMeta({ middleware: "auth" });
</script>

<template>
  <DashboardPage />
</template>
```

### Exemplo: componente de página do módulo (`modules/dashboard/pages/DashboardPage.vue`)

```vue
<script setup lang="ts">
import { onMounted } from "vue";

import { useDashboard } from "../composables/useDashboard";

const { metrics, isLoading, error, loadMetrics } = useDashboard();
onMounted(loadMetrics);
</script>

<template>
  <!-- template da página -->
</template>
```

---

## 4. Regras

- O arquivo de rota (`app/pages/`) **NUNCA** contém lógica de negócio ou markup além do componente importado
- `definePageMeta` **SEMPRE** em `app/pages/`, **NUNCA** em `modules/`
- O componente de página do módulo **NUNCA** usa `definePageMeta`
- O gerador `pnpm create:feature <name>` cria automaticamente os dois arquivos seguindo este padrão
- Para adicionar middleware, layout ou guards a uma rota existente, editar apenas o arquivo em `app/pages/`

---

## 5. Consequências

- Ao criar uma nova rota, **dois arquivos** devem ser criados: o wrapper em `app/pages/` e o componente em `modules/<name>/pages/`
- O gerador `create:feature` é o caminho recomendado para garantir que ambos sejam criados corretamente
- Toda configuração de rota (autenticação, layout, título) fica centralizada em `app/pages/`, facilitando auditoria de segurança
- O código de UI, composables e lógica de domínio permanecem isolados no módulo, sem vazamento para a camada de roteamento
