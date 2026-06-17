# ADR-007 — Error Hierarchy

| Campo     | Valor            |
| --------- | ---------------- |
| Status    | Proposta         |
| Autor     | Peterson Almeida |
| Data      | 17/06/2026       |
| Revisores | A definir        |

## 1. Contexto

Aplicações frontend lidam com múltiplos tipos de erro com origens e significados distintos:

- Falhas de comunicação com a API (ex: 401, 404, 500)
- Violações de regras de negócio (ex: saldo insuficiente, operação não permitida)
- Erros de validação de input (ex: campo obrigatório, formato inválido)
- Erros inesperados de runtime

Cada tipo de erro requer uma **resposta de UX diferente**:

- 401 → redirecionar para login
- 404 → página "não encontrado"
- 500 → mensagem genérica + alerta de telemetria
- BusinessError → toast com mensagem amigável já existente no erro
- ValidationError → erro em campo específico do formulário

Sem uma hierarquia tipada, o tratamento de erros tende a ser feito por comparação de strings
ou códigos numéricos — frágil, difícil de manter e sem suporte do TypeScript.

---

## 2. Alternativas Avaliadas

### Opção 1 — Strings de erro

Representar erros como mensagens de texto simples.

```ts
throw "Saldo insuficiente";
// ou
throw new Error("API_ERROR_404");
```

**❌ Problemas:**

- Sem tipagem — TypeScript não ajuda a garantir tratamento correto
- Comparação por string é frágil a typos e mudanças de mensagem
- Não carrega metadados estruturados (ex: status HTTP, campo com erro)

---

### Opção 2 — Códigos de erro (enum ou constantes)

```ts
throw { code: "INSUFFICIENT_BALANCE", message: "..." };
```

**❌ Problemas:**

- Requer tabela de lookup para entender o significado de cada código
- `code` como string não é verificado pelo TypeScript em catch
- Não carrega metadados tipados naturalmente

---

### Opção 3 — Hierarquia de classes tipadas ✅

```ts
throw new BusinessError("Saldo insuficiente");
throw new ApiError("Unauthorized", 401);
```

**✅ Benefícios:**

- `instanceof` é verificado pelo TypeScript e pelo runtime
- Cada classe carrega os metadados relevantes para seu tipo
- Autodocumentado: o nome da classe comunica a intenção
- Extensível: novos tipos de erro estendem a classe base sem quebrar código existente
- Integra naturalmente com sistemas de observabilidade (Sentry, Datadog)

---

## 3. Decisão

Adotar uma **hierarquia de classes** com `AppError` como classe base.

```
AppError  (base: message, code?, status?)
├── ApiError         → erros HTTP retornados pela API
├── BusinessError    → violações de regras de negócio do domínio
└── ValidationError  → erros de validação de input do usuário
```

> ⚠️ **Localização importante:** `ApiError` vive em `core/api/` (não em `core/errors/`)
> porque é lançado diretamente pelo HTTP client (`createHttpClient`). As demais classes
> vivem em `core/errors/`.

### Implementação atual

```ts
// core/errors/app-error.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// core/api/api-error.ts
export class ApiError extends AppError {
  constructor(message: string, status?: number) {
    super(message, "API_ERROR", status);
    this.name = "ApiError";
  }
}

// core/errors/business-error.ts
export class BusinessError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "BusinessError";
  }
}

// core/errors/validation-error.ts
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

---

## 4. Regras

### Captura de erros — ordem de verificação

Sempre verificar o tipo mais específico primeiro:

```ts
try {
  await repository.doSomething();
} catch (e) {
  if (e instanceof ApiError) {
    // trata erro HTTP — e.status disponível
  } else if (e instanceof BusinessError) {
    // trata violação de regra — e.message já é user-facing
  } else if (e instanceof ValidationError) {
    // trata erro de validação — exibir no campo correspondente
  } else {
    // fallback genérico — erro inesperado de runtime
  }
}
```

### Respostas de UX por tipo

| Tipo               | Status | Resposta recomendada                                           |
| ------------------ | ------ | -------------------------------------------------------------- |
| `ApiError`         | 401    | Redirecionar para login                                        |
| `ApiError`         | 403    | Mensagem "sem permissão"                                       |
| `ApiError`         | 404    | Página ou estado "não encontrado"                              |
| `ApiError`         | 5xx    | Mensagem genérica + `telemetry.trackError()`                   |
| `BusinessError`    | —      | Toast com `error.message` (já é user-facing)                   |
| `ValidationError`  | —      | Erro inline no campo correspondente                            |
| `Error` (genérico) | —      | "Erro inesperado. Tente novamente." + `telemetry.trackError()` |

### Ao criar novos erros de domínio

```ts
// ✅ Correto — estender a hierarquia
throw new BusinessError("Limite de transferência excedido");
throw new ValidationError("CPF inválido");

// ❌ Evitar no domínio — perde tipagem e hierarquia
throw new Error("Algo deu errado");
throw "Erro genérico";
```

`throw new Error()` é aceitável apenas em utilitários de infraestrutura (core). No domínio
de negócio, sempre use a subclasse mais específica.

---

## 5. Consequências

- Ao adicionar um novo tipo de erro de domínio, criar uma subclasse de `BusinessError` ou `ValidationError` (não de `AppError` diretamente)
- O `TelemetryService.trackError()` recebe qualquer `AppError` ou `Error` e pode usar `instanceof` para enriquecer o contexto enviado ao provedor (Sentry, Datadog)
- A integração futura com sistemas de observabilidade se beneficia dos metadados tipados (`status`, `code`, `name`)
- Erros de API sempre passam pelo `createHttpClient` — nunca lançar `ApiError` manualmente em módulos
