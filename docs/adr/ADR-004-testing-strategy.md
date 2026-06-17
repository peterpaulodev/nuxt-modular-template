# ADR-004 — Testing Strategy

| Campo     | Valor            |
| --------- | ---------------- |
| Status    | Proposta         |
| Autor     | Peterson Almeida |
| Data      | 17/06/2026       |
| Revisores | A definir        |

## 1. Contexto

O projeto precisa definir uma estratégia de testes que equilibre:

- Cobertura das regras de negócio
- Velocidade de execução no CI
- Custo de manutenção dos testes
- Compatibilidade com o ambiente Nuxt (que expõe composables e plugins globais não disponíveis fora do runtime)

A principal restrição técnica é que **dependências do runtime Nuxt** (`useRuntimeConfig`,
`useRoute`, plugins globais) e **ofetch** não estão disponíveis no ambiente Vitest por padrão.
Qualquer teste que toque código que importe essas dependências falhará a menos que sejam
explicitamente mockadas.

---

## 2. Alternativas Avaliadas

### Opção 1 — Testes E2E com Playwright ou Cypress

Testes que simulam a navegação completa do usuário no browser.

**✅ Benefícios:** alta confiança, testa o sistema como um todo.

**❌ Problemas:**

- Requerem servidor Nuxt rodando durante o teste
- Lentos (segundos por teste vs milissegundos)
- Frágeis a mudanças de UI
- Alto custo de manutenção
- Pouco ROI para validar lógica de negócio em composables

---

### Opção 2 — Testes de componente (Vue Test Utils, montagem completa)

Montar componentes Vue completos e interagir com o DOM renderizado.

**✅ Benefícios:** valida a integração entre template e lógica.

**❌ Problemas:**

- Testa detalhes de implementação (seletores CSS, estrutura de DOM)
- Alto custo de manutenção quando o template muda
- Baixo ROI para páginas que são thin wrappers de composables

---

### Opção 3 — Testes unitários de composables e stores ✅

Testar diretamente as funções de composables e o estado dos stores, mockando dependências externas.

**✅ Benefícios:**

- A lógica de negócio (composables, stores) é a camada de maior valor para testar
- Execução em milissegundos (jsdom, sem browser real)
- Fácil de manter: testa comportamento, não implementação visual
- Compatível com o ambiente Vitest sem necessidade de Nuxt rodando

---

## 3. Decisão

Adotar **testes unitários com Vitest** como estratégia principal.

**Stack:**

- **Vitest 4** — runner de testes
- **`@vue/test-utils` 2** — utilitários para testes de componente Vue
- **jsdom** — ambiente de DOM simulado
- Configuração em `apps/web/vitest.config.ts` (espelha aliases de `nuxt.config.ts`)

**Camadas a testar:**

| Camada                        | Prioridade | O que testar                                                |
| ----------------------------- | ---------- | ----------------------------------------------------------- |
| Composables                   | **Alta**   | fluxo de loading, sucesso, erros tipados, estado resultante |
| Stores                        | **Alta**   | estado inicial, mutações, compartilhamento entre instâncias |
| Componentes UI (`shared/ui/`) | Média      | renderização de props, slots, eventos                       |
| Páginas de módulo             | Baixa      | thin wrappers — baixo ROI                                   |

**Referência canônica:** `modules/dashboard/tests/` contém os exemplos completos de ambas as camadas.

---

## 4. Regras técnicas

### 4.1 Sempre mockar `@core/api/http-client`

`ofetch` e `useRuntimeConfig` são dependências do runtime Nuxt. Qualquer arquivo que os importe
(mesmo transitivamente via `@core/api`) falhará no Vitest.

```ts
// No topo do arquivo de teste — antes de qualquer import do módulo
vi.mock("@core/api/http-client", () => ({
  createHttpClient: vi.fn(),
}));
```

### 4.2 Usar `vi.hoisted()` para mocks compartilhados

`vi.mock` é **hoistado** para o topo do arquivo pelo Vitest. Variáveis declaradas no corpo
do teste são `undefined` no momento em que `vi.mock` é processado.

```ts
// ✅ Correto — vi.hoisted garante que a variável existe quando vi.mock é executado
const mockGetMetrics = vi.hoisted(() => vi.fn());

vi.mock("../api/dashboard.repository", () => ({
  DashboardRepository: vi.fn().mockImplementation(function () {
    return { getMetrics: mockGetMetrics };
  }),
}));
```

```ts
// ❌ Errado — mockGetMetrics será undefined quando vi.mock for processado
const mockGetMetrics = vi.fn();

vi.mock("../api/dashboard.repository", () => ({
  DashboardRepository: vi.fn().mockImplementation(() => ({
    getMetrics: mockGetMetrics, // undefined aqui
  })),
}));
```

### 4.3 Usar `vi.clearAllMocks()`, nunca `vi.resetAllMocks()`

`vi.resetAllMocks()` remove a implementação definida via `.mockImplementation()`, fazendo com
que o mock de classe retorne `undefined` em vez do objeto com os métodos esperados.

`vi.clearAllMocks()` limpa o histórico de chamadas mas **preserva a implementação**.

```ts
beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks(); // ✅ preserva mockImplementation
  // vi.resetAllMocks() ← ❌ destrói a implementação do mock de classe
});
```

### 4.4 Mock de classe: usar `function()`, não arrow function

Arrow functions não podem ser usadas como construtores (`new`). O Vitest lança erro silencioso
se uma arrow function for passada para `.mockImplementation()` de uma classe.

```ts
// ✅ Correto
vi.fn().mockImplementation(function () {
  return { getMetrics: mockGetMetrics };
});

// ❌ Errado — arrow function não é construtor
vi.fn().mockImplementation(() => ({
  getMetrics: mockGetMetrics,
}));
```

### 4.5 Inicializar Pinia em cada teste

```ts
beforeEach(() => {
  setActivePinia(createPinia()); // obrigatório para stores funcionarem fora do Nuxt
});
```

---

## 5. Consequências

- Ao criar um novo módulo, os testes vão em `modules/<name>/tests/`
- Testes de composable são **obrigatórios** para composables com lógica de negócio
- Testes de componente de domínio são opcionais; foco nos composables
- E2E será adicionado em uma etapa futura quando a aplicação tiver fluxos estabilizados
- O arquivo `vitest.config.ts` deve sempre espelhar os aliases definidos em `nuxt.config.ts`
