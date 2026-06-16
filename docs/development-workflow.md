# 👨‍💻 Fluxo de Desenvolvimento

O fluxo abaixo representa o processo recomendado para implementação de novas funcionalidades dentro da arquitetura Modular Monolith.

Seguir esta sequência ajuda a manter consistência entre os módulos, reduzir acoplamento e facilitar manutenção futura.

---

## 1. Criar uma Nova Feature

Utilize o gerador de features para criar a estrutura inicial do domínio.

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

---

## 2. Definir os Contratos e Tipagens

Antes de implementar regras de negócio, defina os modelos necessários.

Exemplo:

```text
modules/banking/types/
```

```ts
export interface Account {
  id: string
  balance: number
}
```

---

## 3. Implementar os Repositories

Toda comunicação com APIs externas deve ser encapsulada em repositories.

Exemplo:

```text
modules/banking/api/
```

```ts
export class BankingRepository {
  async getAccounts() {
    return httpClient.get('/accounts')
  }
}
```

Evite chamadas HTTP diretamente em componentes ou páginas.

---

## 4. Implementar os Composables

Os composables devem concentrar a lógica da feature e orquestrar a comunicação com repositories.

Exemplo:

```text
modules/banking/composables/
```

```ts
export const useBanking = () => {
  const accounts = ref([])

  const loadAccounts = async () => {
    accounts.value = await repository.getAccounts()
  }

  return {
    accounts,
    loadAccounts,
  }
}
```

---

## 5. Implementar Componentes do Domínio

Crie componentes específicos da funcionalidade dentro do próprio módulo.

Exemplo:

```text
modules/banking/components/
```

```text
AccountCard.vue
TransactionTable.vue
BalanceSummary.vue
```

Caso o componente seja reutilizável por outros módulos, mova-o para:

```text
shared/ui/
```

---

## 6. Implementar a Página da Feature

A página do módulo deve ser responsável apenas por compor componentes e utilizar composables.

Exemplo:

```text
modules/banking/pages/BankingPage.vue
```

Fluxo esperado:

```text
Page
 ↓
Composable
 ↓
Repository
 ↓
Backend
```

---

## 7. Adicionar Testes

Adicione testes para comportamentos relevantes da funcionalidade.

Locais recomendados:

```text
modules/banking/tests/
```

ou

```text
modules/banking/**/*.spec.ts
```

---

## 8. Executar Validações Locais

Antes de abrir um Pull Request execute:

```bash
pnpm lint
pnpm test
```

Garanta que não existam erros de lint ou falhas de testes.

---

## 9. Abrir Pull Request

Antes de solicitar revisão confirme:

* Estrutura do módulo segue o padrão definido
* Não existem dependências entre módulos
* APIs estão encapsuladas em repositories
* Componentes compartilháveis foram movidos para Shared
* Tipagem adequada foi aplicada
* Testes foram adicionados quando necessário
* Documentação foi atualizada quando aplicável

---

## Resumo

```text
Create Feature
      ↓
Define Types
      ↓
Implement Repository
      ↓
Implement Composable
      ↓
Implement Components
      ↓
Implement Page
      ↓
Add Tests
      ↓
Lint & Test
      ↓
Open Pull Request
```
