# ADR-001 — Arquitetura da Plataforma (Modular Monolith)

Acesso em: [Clique aqui para ler a documentação completa!](https://four-check-a80.notion.site/ADR-Arquitetura-Frontend-da-Plataforma-37c59f5a611180f98017d145478ca533?pvs=74)

| Campo     | Valor            |
| --------- | ---------------- |
| Status    | Proposta         |
| Autor     | Peterson Almeida |
| Data      | 12/06/2026       |
| Revisores | A definir        |

## 1. Contexto

Estamos iniciando o desenvolvimento de uma nova plataforma frontend utilizando Vue 3 e Nuxt 4.

Durante as discussões iniciais de arquitetura, surgiu a necessidade de definir qual estratégia arquitetural será adotada para a organização da aplicação frontend, considerando principalmente duas alternativas:

1. Monólito Modular
2. Microfrontends

**A decisão impactará diretamente aspectos como:**

- Estrutura do código-fonte
- Organização dos domínios de negócio
- Processo de desenvolvimento
- Estratégia de deploy
- Escalabilidade organizacional
- Custos operacionais e de manutenção

O objetivo deste ADR é registrar a análise realizada e propor uma arquitetura inicial adequada ao contexto atual do projeto.

---

# 2. Premissas Atuais

No momento da elaboração deste documento, observamos as seguintes características:

- Existe uma única plataforma frontend.
- Os domínios da aplicação fazem parte do mesmo produto.
- Não existe necessidade conhecida de deploy independente por domínio.
- Não existe requisito para utilização de múltiplos frameworks frontend (será somente Vue + Nuxt).
- O time frontend opera de forma centralizada.
- A prioridade atual é velocidade de desenvolvimento, simplicidade operacional e facilidade de manutenção.
- Não existem evidências de gargalos organizacionais que justifiquem o desacoplamento físico da aplicação.

---

# 3. Alternativas Avaliadas

## Opção 1 — Arquitetura baseada em Microfrontends

### Descrição

A aplicação é dividida em múltiplas aplicações frontend independentes, normalmente organizadas por domínio de negócio.

Exemplo:

- Dashboard
- Usuários
- Relatórios
- Financeiro
- Configurações

Cada domínio pode possuir seu próprio pipeline de build e deploy.

### ✅ Benefícios

1. Deploy independente por domínio.
2. Maior autonomia entre equipes.
3. Escalabilidade organizacional.
4. Possibilidade de evolução tecnológica independente.
5. Ownership mais claro por domínio.

### ❌ Desvantagens

1. Aumento significativo da complexidade arquitetural.
2. Necessidade de orquestração entre aplicações.
3. Maior esforço de observabilidade e monitoramento.
4. Complexidade adicional para autenticação, autorização e roteamento.
5. Possibilidade de duplicação de dependências.
6. Maior esforço para manter consistência visual e de experiência.
7. Maior custo operacional.

### Quando esta abordagem costuma ser indicada

- Múltiplas squads independentes.
- Necessidade frequente de deploy desacoplado.
- Produtos muito grandes ou compostos por múltiplos subprodutos.
- Escala organizacional elevada.

---

## Opção 2 — Monólito Modular

### Descrição

A aplicação é mantida como um único frontend, porém organizada internamente em módulos independentes e orientados ao domínio.

Exemplo:

```markdown
app/

├── dashboard/
├── users/
├── reports/
├── payments/
├── settings/
├── shared/
└── core/
```

Cada domínio possui suas próprias responsabilidades, componentes, serviços, composables e regras de negócio.

### ✅ Benefícios

1. Menor complexidade arquitetural.
2. Menor custo operacional.
3. Pipeline único de build e deploy.
4. Melhor experiência de desenvolvimento.
5. Refatorações mais simples.
6. Maior consistência visual.
7. Menor esforço de governança.
8. Curva de aprendizado reduzida para novos desenvolvedores.
9. Estratégia de observabilidade centralizada.

### ❌ Desvantagens

1. Deploy compartilhado.
2. Necessidade de disciplina arquitetural para evitar acoplamento.
3. Possível aumento do tempo de build conforme a aplicação cresce.
4. Dependência entre equipes em cenários de grande expansão organizacional.

### Quando esta abordagem costuma ser indicada

- Produtos únicos.
- Equipes centralizadas.
- Fase inicial ou intermediária de crescimento.
- Organizações que priorizam simplicidade operacional.

---

# 4. Comparativo

| Critério                              | Monólito Modular | Microfrontends |
| ------------------------------------- | ---------------- | -------------- |
| Complexidade Arquitetural             | Baixa            | Alta           |
| Complexidade Operacional              | Baixa            | Alta           |
| Velocidade Inicial de Desenvolvimento | Alta             | Média          |
| Facilidade de Refatoração             | Alta             | Média          |
| Consistência de UX/UI                 | Alta             | Média          |
| Deploy Independente                   | Não              | Sim            |
| Escalabilidade Organizacional         | Média            | Alta           |
| Custo de Manutenção                   | Menor            | Maior          |
| Curva de Aprendizado                  | Menor            | Maior          |

---

# 5. Arquitetura Recomendada

Recomenda-se a adoção de uma arquitetura baseada em **Monólito Modular** utilizando Vue 3 e Nuxt 4.

A organização da aplicação deverá seguir uma abordagem orientada a domínios de negócio (Feature-Based Architecture), mantendo fronteiras claras entre os módulos.

# 6. Riscos da Decisão

## Crescimento excessivo da aplicação

Com o aumento do número de módulos e funcionalidades, a aplicação pode tornar-se mais complexa de manter.

### Mitigação

- Organização por domínio.
- Revisões arquiteturais periódicas.
- Definição clara de fronteiras entre módulos.
- Uso disciplinado de componentes compartilhados.

---

## Crescimento do time

Caso a organização evolua para múltiplas squads independentes, o modelo atual poderá tornar-se um limitador.

### Mitigação

A arquitetura proposta deverá preservar a separação lógica entre domínios, permitindo a futura extração gradual de módulos para uma arquitetura baseada em Microfrontends, caso essa necessidade seja comprovada.

---

# 7. Decisão recomendada

### 👉 Monólito Modular

Considerando o contexto atual do projeto, recomenda-se iniciar o desenvolvimento da plataforma utilizando uma arquitetura de Monólito Modular baseada em Vue 3 e Nuxt 4.

A decisão é fundamentada na busca por:

- ✅ Menor complexidade arquitetural.
- ✅ Menor custo operacional.
- ✅ Maior velocidade de entrega.
- ✅ Melhor experiência de desenvolvimento.
- ✅ Facilidade de manutenção.
- ✅ Evolução incremental da arquitetura.

> _A adoção de Microfrontends deverá ser reavaliada futuramente caso surjam necessidades concretas relacionadas à autonomia de equipes, deploy independente por domínio ou escalabilidade organizacional._

### ⚙️ Tecnologias/Stack

#### Framework & Runtime

- Nuxt 4
- Vue 3

#### Linguagem

- TypeScript

#### Build & Ferramentas

- Build tool: Vite

#### Qualidade de código

- ESLint 9 (Flat Config)
- Prettier

#### Arquitetura

- Monólito Modular
- Feature-Based Architecture

#### Estado

- Pinia (apenas para estado compartilhado)

#### Integração com APIs

- Camada Repository para APIs

#### Design

- Design System interno

#### Monorepo

- pnpm workspaces

#### Testes

- Vitest

---

### EXTRA

Arquitetura Fintech.pdf

A arquitetura da solução acima já apresenta um elevado nível de distribuição e desacoplamento na camada backend, através de BFFs especializados, cores independentes, mensageria e integrações externas.

Considerando que o Backoffice representa uma única plataforma operacional consumindo esses domínios, recomenda-se a adoção inicial de um **Monólito Modular** organizado por contexto de negócio.

Essa decisão permite concentrar os esforços arquiteturais nos requisitos críticos da solução (segurança, auditoria, observabilidade e integração com fornecedores) sem introduzir complexidade adicional na camada frontend antes da existência de uma necessidade organizacional clara para Microfrontends.

Vale citar que, caso se julgue necessário com o andar do projeto e crescimento da equipe, modularizar facilita a futuras alterações para microfrontends sem grandes complicações.
