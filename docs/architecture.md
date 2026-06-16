# Architecture

## Visão Geral

Este projeto é uma implementação de referência para aplicações frontend construídas com **Nuxt 4**, **Vue 3** e **TypeScript**, utilizando uma arquitetura de **Modular Monolith** orientada a domínios de negócio.

O objetivo desta arquitetura é permitir que a aplicação cresça de forma sustentável, mantendo:

* Alta coesão entre funcionalidades relacionadas
* Baixo acoplamento entre domínios
* Reutilização controlada de código
* Facilidade de manutenção
* Evolução futura para múltiplas aplicações ou microfrontends, caso necessário

``` Mermaid
flowchart LR

UsersPage
--> useUsers

useUsers
--> UsersRepository

UsersRepository
--> HttpClient

HttpClient
--> API
```

---

# Princípios Arquiteturais

## 1. Organização por Domínio

A aplicação é organizada por domínios de negócio (features), e não por tipo técnico.

### Correto

```text
modules/
├── banking/
├── acquiring/
├── antifraud/
└── dashboard/
```

### Evitar

```text
components/
pages/
stores/
services/
utils/
```

Estruturas orientadas exclusivamente por tecnologia tendem a espalhar responsabilidades e dificultar a manutenção conforme o sistema cresce.

---

## 2. Modular Monolith

Toda a aplicação é entregue como um único frontend.

Entretanto, cada domínio é isolado em seu próprio módulo.

Cada módulo deve ser capaz de evoluir de forma independente sem impactar outros domínios.

---

## 3. Dependências Unidirecionais

As dependências devem seguir a seguinte direção:

```text
Modules
   ↓
Shared
   ↓
Core
```

### Permitido

```text
Dashboard → Shared
Dashboard → Core
```

### Não permitido

```text
Dashboard → Banking
Banking → Acquiring
Shared → Dashboard
Core → Dashboard
```

---

## 4. Core como Infraestrutura

O diretório `core` contém apenas infraestrutura da aplicação.

Exemplos:

* API Client
* Authentication
* Authorization
* Telemetry
* Configuration

O Core não deve conter regras de negócio.

---

## 5. Shared como Biblioteca Interna

O diretório `shared` contém recursos reutilizáveis e independentes de domínio.

Exemplos:

* Componentes visuais
* Helpers
* Types genéricos
* Utilitários

O Shared não deve conhecer módulos específicos.

---

# Estrutura do Projeto

```text
app/

├── core/
├── shared/
├── modules/

├── pages/
├── layouts/
├── middleware/
└── plugins/
```

---

# Core

Responsável pela infraestrutura da aplicação.

```text
core/

├── api/
├── auth/
├── permissions/
├── telemetry/
└── config/
```

## api

Centraliza comunicação HTTP.

Responsabilidades:

* Configuração de clientes HTTP
* Interceptors
* Tratamento de erros
* Configuração de headers

---

## auth

Responsável por autenticação.

Exemplos:

* Login
* Logout
* Refresh Token
* Sessão

---

## permissions

Responsável por autorização.

Exemplo:

```ts
can('banking:view')
```

---

## telemetry

Responsável por observabilidade.

Exemplos:

* Logs
* Traces
* Métricas
* Eventos

---

## config

Configurações globais da aplicação.

---

# Shared

Biblioteca interna reutilizável.

```text
shared/

├── ui/
├── utils/
├── types/
├── constants/
└── composables/
```

---

## ui

Componentes reutilizáveis.

Exemplos:

```text
Button
Card
Table
Modal
PageHeader
```

---

## utils

Funções utilitárias.

Exemplos:

```text
formatCurrency
formatDate
parseDocument
```

---

## types

Tipos compartilhados.

---

## constants

Constantes globais.

---

## composables

Composables genéricos e reutilizáveis.

---

# Modules

Representam domínios de negócio.

Cada módulo deve encapsular tudo o que pertence à sua feature.

Exemplo:

```text
modules/dashboard

├── api/
├── components/
├── composables/
├── pages/
├── types/
└── tests/
```

---

## api

Camada de acesso a dados.

Implementa repositories.

Exemplo:

```text
DashboardRepository
```

---

## components

Componentes específicos do módulo.

---

## composables

Orquestração da feature.

Responsável por:

* Chamadas de repositories
* Regras de apresentação
* Estado local da feature

---

## pages

Componentes de tela pertencentes ao domínio.

Exemplo:

```text
DashboardPage.vue
```

---

## types

Tipos específicos do domínio.

---

## tests

Testes da feature.

---

# Rotas

As rotas Nuxt ficam em:

```text
app/pages
```

Essas páginas devem atuar apenas como adaptadores de rota.

Exemplo:

```vue
<script setup lang="ts">
import DashboardPage from '@modules/dashboard/pages/DashboardPage.vue'
</script>

<template>
  <DashboardPage />
</template>
```

Toda a lógica da feature deve permanecer dentro do módulo.

---

# Fluxo de Dados

O fluxo recomendado é:

```text
Route
 ↓
Module Page
 ↓
Composable
 ↓
Repository
 ↓
HTTP Client
 ↓
Backend
```

Exemplo:

```text
/dashboard
 ↓
DashboardPage
 ↓
useDashboard
 ↓
DashboardRepository
 ↓
httpClient
 ↓
API
```

---

# Repositories

Nenhum componente deve realizar chamadas HTTP diretamente.

### Evitar

```ts
await $fetch('/accounts')
```

### Preferir

```ts
await bankingRepository.getAccounts()
```

Todos os acessos externos devem ser encapsulados por repositories.

---

# Convenções

## Barrel Files

Permitido em:

```text
shared/ui
```

Exemplo:

```ts
import { Button, Card } from '@shared/ui'
```

Evitar barrel files globais para utilitários e helpers.

---

## Imports

Sempre preferir aliases.

### Correto

```ts
import { can } from '@core/permissions'
```

### Evitar

```ts
import { can } from '../../../../core/permissions'
```

---

# Evolução Futura

Esta arquitetura foi projetada para permitir:

* Crescimento do monólito modular
* Extração futura de módulos
* Compartilhamento de código entre aplicações
* Criação de Design System
* Evolução para monorepo multi-app

Sem necessidade de reestruturações significativas.
