# Module Guidelines

## Objetivo

Este documento descreve como criar, organizar e evoluir módulos dentro da arquitetura Modular Monolith adotada neste projeto.

Todos os novos domínios de negócio devem seguir estas diretrizes.

---

# O que é um módulo?

Um módulo representa um domínio ou capacidade de negócio da plataforma.

Exemplos:

```text
Dashboard
Banking
Acquiring
Antifraud
Operations
Customers
```

Cada módulo deve ser responsável por encapsular:

* Componentes
* Regras de apresentação
* Comunicação com APIs
* Tipos
* Testes

relacionados ao seu domínio.

---

# Estrutura Padrão

Todo módulo deve seguir a seguinte estrutura:

```text
modules/<module-name>

├── api/
├── components/
├── composables/
├── pages/
├── types/
└── tests/
```

Exemplo:

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

# Responsabilidade de Cada Diretório

## api

Contém a camada de acesso a dados.

Responsável por:

* Repositories
* DTOs
* Mappers

Exemplo:

```text
api/

banking.repository.ts

dto/
mappers/
```

---

## components

Componentes visuais específicos do domínio.

Exemplos:

```text
AccountCard.vue
TransactionTable.vue
TransferModal.vue
```

Esses componentes não devem ser reutilizados por outros módulos.

Caso exista necessidade de reutilização, mova o componente para:

```text
shared/ui
```

---

## composables

Contém a lógica de orquestração da feature.

Responsabilidades:

* Chamar repositories
* Gerenciar estado local
* Coordenar fluxos da tela

Exemplo:

```text
useAccounts.ts
useTransfers.ts
```

---

## pages

Contém componentes de página pertencentes ao domínio.

Exemplo:

```text
BankingDashboardPage.vue
AccountDetailsPage.vue
```

Essas páginas serão utilizadas pelas rotas do Nuxt.

---

## types

Tipos específicos do domínio.

Exemplos:

```text
Account.ts
Transaction.ts
Transfer.ts
```

---

## tests

Testes relacionados ao módulo.

Exemplos:

```text
account.repository.spec.ts
useAccounts.spec.ts
```

---

# Fluxo Recomendado

A comunicação deve seguir o fluxo abaixo:

```text
Route
 ↓
Module Page
 ↓
Composable
 ↓
Repository
 ↓
API
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
Backend
```

---

# Repositories

Toda comunicação externa deve passar por repositories.

## Correto

```ts
await bankingRepository.getAccounts()
```

## Evitar

```ts
await $fetch('/accounts')
```

diretamente em componentes ou páginas.

---

# Dependências Permitidas

## Módulo → Core

Permitido.

```ts
import { telemetry } from '@core/telemetry'
```

---

## Módulo → Shared

Permitido.

```ts
import { Button } from '@shared/ui'
```

---

# Dependências Não Permitidas

## Módulo → Outro Módulo

Não permitido.

### Evitar

```ts
import { useCustomers } from '@modules/customers'
```

---

Se dois módulos precisam compartilhar algo:

Mover para:

```text
shared/
```

ou

```text
core/
```

dependendo da responsabilidade.

---

# Componentes

Antes de criar um componente novo, pergunte:

### Este componente pertence apenas ao domínio?

Se sim:

```text
modules/<module>/components
```

---

### Este componente será utilizado por outros módulos?

Se sim:

```text
shared/ui
```

---

# Estado

Utilize estado local sempre que possível.

Prefira:

```ts
ref()
computed()
```

e composables.

---

Utilize Pinia apenas para:

* Sessão
* Usuário autenticado
* Permissões
* Contextos compartilhados

---

# Tipagem

Todo contrato externo deve possuir tipagem explícita.

Exemplo:

```ts
export interface Account {
  id: string
  balance: number
}
```

Evitar:

```ts
any
```

---

# Testes

Todo módulo deve possuir cobertura mínima para:

* Composables
* Repositories
* Fluxos críticos

---

# Criando um Novo Módulo

## Estrutura

```text
modules/payments

├── api/
├── components/
├── composables/
├── pages/
├── types/
└── tests/
```

---

## Repository

```ts
export class PaymentsRepository {
  async getPayments() {}
}
```

---

## Composable

```ts
export const usePayments = () => {}
```

---

## Página

```vue
<template>
  <PaymentsPage />
</template>
```

---

# Checklist

Antes de abrir um Pull Request:

* [ ] O módulo segue a estrutura padrão
* [ ] Não existe dependência para outros módulos
* [ ] APIs estão encapsuladas em repositories
* [ ] Componentes compartilháveis foram movidos para Shared
* [ ] Tipagens foram definidas
* [ ] Testes foram adicionados
* [ ] Imports utilizam aliases

```
```
