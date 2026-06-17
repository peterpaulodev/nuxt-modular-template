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
├── stores/
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

## 4. Implementar o Store do Módulo

Para estado que deve sobreviver à navegação ou ser compartilhado entre múltiplos componentes do módulo, utilize um Pinia store.

Exemplo:

```text
modules/banking/stores/
```

```ts
export const useBankingStore = defineStore('banking', () => {
  const accounts = ref<Account[]>([])

  return { accounts }
})
```

O store apenas armazena — o composable é o responsável por populá-lo.

---

## 5. Implementar os Composables

Os composables devem concentrar a lógica da feature e orquestrar a comunicação com repositories e o store.

Exemplo:

```text
modules/banking/composables/
```

```ts
export const useBanking = () => {
  const store = useBankingStore()
  const { accounts } = storeToRefs(store)
  const repository = new BankingRepository()

  const loadAccounts = async () => {
    store.accounts = await repository.getAccounts()
  }

  return { accounts, loadAccounts }
}
```

---

## 6. Implementar Componentes do Domínio

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

## 7. Implementar a Página da Feature

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

## 8. Adicionar Testes

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

## 9. Executar Validações Locais

Antes de abrir um Pull Request execute:

```bash
pnpm lint
pnpm test
```

Garanta que não existam erros de lint ou falhas de testes.

---

## 10. Abrir Pull Request

Antes de solicitar revisão confirme:

* Estrutura do módulo segue o padrão definido
* Não existem dependências entre módulos
* APIs estão encapsuladas em repositories
* Estado persistente utiliza Pinia store quando necessário
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
Implement Store
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
