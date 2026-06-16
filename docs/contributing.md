# Contributing

Este repositório é uma implementação de referência para aplicações frontend construídas com **Nuxt 4**, **Vue 3** e **TypeScript**, utilizando uma arquitetura de **Modular Monolith**.

Antes de iniciar qualquer desenvolvimento, leia os documentos:

* `docs/architecture.md`
* `docs/module-guidelines.md`

---

# Pré-requisitos

Certifique-se de possuir instalado:

* Node.js >= 22
* PNPM >= 10

Verifique as versões:

```bash
node -v
pnpm -v
```

---

# Instalação

Clone o repositório:

```bash
git clone <repository-url>
```

Instale as dependências:

```bash
pnpm install
```

---

# Executando o Projeto

A partir da raiz do monorepo:

```bash
pnpm dev
```

ou

```bash
pnpm --filter web dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

# Estrutura do Projeto

```text
apps/
└── web/
    └── app/

        core/
        shared/
        modules/

        pages/
        layouts/
        middleware/
        plugins/
```

---

# Convenções Arquiteturais

## Core

Infraestrutura da aplicação.

Exemplos:

* API Client
* Authentication
* Authorization
* Telemetry
* Configuração

---

## Shared

Código reutilizável e independente de domínio.

Exemplos:

* Componentes visuais
* Helpers
* Types
* Composables genéricos

---

## Modules

Representam domínios de negócio.

Exemplos:

* Banking
* Acquiring
* Dashboard
* Customers

---

# Criando um Novo Módulo

Todos os módulos devem seguir a estrutura padrão:

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
modules/customers
```

---

# Componentes Compartilhados

Componentes reutilizáveis devem ser criados em:

```text
app/shared/ui
```

Exemplo:

```text
shared/ui/Button
shared/ui/Card
shared/ui/Modal
```

---

# Componentes Específicos de Domínio

Componentes utilizados apenas por um módulo devem permanecer dentro do módulo.

Exemplo:

```text
modules/banking/components/AccountCard.vue
```

---

# Repositories

Toda comunicação com APIs externas deve ser encapsulada em repositories.

### Correto

```ts
await accountsRepository.getAccounts()
```

### Evitar

```ts
await $fetch('/accounts')
```

diretamente em componentes ou páginas.

---

# Imports

Sempre utilize aliases.

### Correto

```ts
import { telemetry } from '@core/telemetry'
```

### Evitar

```ts
import { telemetry } from '../../../../core/telemetry'
```

---

# Commits

Este projeto utiliza Commitlint para validação das mensagens de commit.

Padrões aceitos:

```text
feat: add customer module
fix: resolve login issue
refactor: improve repository structure
docs: update architecture documentation
test: add dashboard tests
chore: update dependencies
```

---

# Verificações Antes do Commit

Execute:

```bash
pnpm lint
```

Caso existam testes:

```bash
pnpm test
```

---

# Pull Requests

Antes de abrir um Pull Request:

* Verifique se a arquitetura foi respeitada
* Garanta que não existem dependências entre módulos
* Execute lint localmente
* Adicione testes quando aplicável
* Atualize a documentação caso necessário

---

# Checklist de Revisão

* [ ] Estrutura do módulo segue o padrão definido
* [ ] Não existem imports entre módulos
* [ ] APIs estão encapsuladas em repositories
* [ ] Componentes compartilháveis foram movidos para Shared
* [ ] Tipagem adequada foi aplicada
* [ ] Testes foram adicionados quando necessário
* [ ] Documentação foi atualizada

---

# Documentação

Documentos importantes:

```text
docs/

architecture.md
module-guidelines.md
adr/
```

Em caso de dúvida, priorize sempre as decisões documentadas nos ADRs.
