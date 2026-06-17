# ADR-006 — State Management Scope (Pinia vs ref local)

| Campo     | Valor            |
| --------- | ---------------- |
| Status    | Proposta         |
| Autor     | Peterson Almeida |
| Data      | 17/06/2026       |
| Revisores | A definir        |

## 1. Contexto

Pinia é poderoso o suficiente para armazenar qualquer tipo de estado — desde dados carregados
da API até o estado de visibilidade de um modal. Sem uma regra clara, o estado de tela acaba
no store global, criando:

- Dependências implícitas entre componentes
- Estado "fantasma" que não reseta quando o usuário navega
- Stores com responsabilidades misturadas (dados de domínio + estado de tela)
- Testes mais complexos (precisam limpar estado global entre casos)

A questão central é: **o que vai no Pinia store vs o que fica em `ref()` local no composable?**

---

## 2. Alternativas Avaliadas

### Opção 1 — Store para tudo

Todo estado vive em stores Pinia: dados carregados, loading, erros, estado de formulário, visibilidade de modais.

**❌ Problemas:**

- `isLoading` e `error` no store global criam conflitos quando a mesma feature é usada em múltiplos contextos simultaneamente
- Estado de UI acumula entre navegações sem reset automático
- Stores ficam grandes e difíceis de rastrear

---

### Opção 2 — `ref()` local para tudo (sem stores)

Todo estado fica em `ref()` dentro dos composables. Nenhum store Pinia.

**❌ Problemas:**

- Dados carregados da API são perdidos a cada navegação, forçando re-fetch desnecessário
- Compartilhar dados entre componentes irmãos exige prop drilling ou provide/inject
- Sem persistência de sessão para dados já buscados

---

### Opção 3 — Regra por responsabilidade ✅

Separar claramente os dois tipos de estado com uma regra baseada em responsabilidade e ciclo de vida.

---

## 3. Decisão

Adotar uma **regra de dois níveis** baseada no ciclo de vida do estado:

| Tipo de estado                                                                 | Onde                      | Exemplos                                                  |
| ------------------------------------------------------------------------------ | ------------------------- | --------------------------------------------------------- |
| Sobrevive à navegação **ou** é compartilhado entre componentes do mesmo módulo | **Pinia store**           | `metrics`, `accounts`, `orders`, `currentUser`            |
| Transiente — pertence a um único render ou interação de tela                   | **`ref()` no composable** | `isLoading`, `error`, `isModalOpen`, campos de formulário |

### Regra mental

> **"Se o estado deve resetar quando o usuário navegar para outra página → `ref()` no composable.
> Se deve sobreviver → store."**

### Exemplo canônico (`modules/dashboard/`)

```ts
// dashboard.store.ts — armazena dados de domínio que sobrevivem à navegação
export const useDashboardStore = defineStore("dashboard", () => {
  const metrics = ref<DashboardMetrics | null>(null); // ← dado de domínio: vai no store
  return { metrics };
});
```

```ts
// useDashboard.ts — estado de tela fica local no composable
export const useDashboard = () => {
  const store = useDashboardStore();
  const { metrics } = storeToRefs(store); // ← dado de domínio: vem do store

  const isLoading = ref(false); // ← estado de tela: ref local
  const error = ref<string | null>(null); // ← estado de tela: ref local

  const loadMetrics = async () => {
    isLoading.value = true;
    try {
      store.metrics = await repository.getMetrics(); // ← composable popula o store
    } finally {
      isLoading.value = false;
    }
  };

  return { metrics, isLoading, error, loadMetrics };
};
```

---

## 4. Regras

- **Store = substantivos** (entidades de dados carregados): `metrics`, `accounts`, `orders`
- **`ref()` no composable = adjetivos/estados de tela**: `isLoading`, `error`, `isModalOpen`, `formValues`
- O composable **chama o repository** e **escreve no store** — é o orquestrador
- O store **NUNCA** chama um repository diretamente
- Use `storeToRefs()` para destruturar estado do store mantendo reatividade
- Um módulo **pode não ter store** se todos os dados são fetch-on-demand sem necessidade de cache entre navegações
- `isLoading` e `error` **sempre** em `ref()` local — nunca em store

---

## 5. Consequências

- Ao adicionar estado a um módulo, a primeira pergunta é: "isso precisa sobreviver à navegação ou ser compartilhado entre componentes?"
- O estado de formulário, loading e erros ficam **sempre** no composable — jamais no store
- Stores ficam enxutos e focados em dados de domínio, facilitando Debug e DevTools do Pinia
- Testes de composable são mais simples: `ref()` local não precisa de `setActivePinia`
- A nomenclatura `use<Domain>Store` deixa claro que o store pertence a um módulo específico
