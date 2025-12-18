# CypressTestBlog

Este Projeto é destinado para Testes Automatizados de E2E e API com Cypress em projeto test Cypress End-to-End Tests for the Blog.

## Linguagem de Programação

- Typescript

## Framework de Teste

- Cypress

## Extras

- Eslint
- Prettier
- Docker
- Workflow github
- Husky
- Code Coverage

# INSTALAÇÃO

## Pré-requisitos

- Instalar nvm (node version manager)
- Instalar node v20.x.x
- For Linux ou Mac (Dependências de sistema para cypress) -> [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)

## Instalando Cypress

### 01 - Utilizando npm

- Após clone do repositório de testes CypressTestBlog
- Rode `npm i --legacy-peer-deps` para instalar todas as dependencias

### 02 - Inserção do arquivo ENV

- Crie um arquivo env com a seguinte nome: `.env`
- Adicione as informações no env criado conforme o exemplo `.envExample`, substituindo os dados necessários.

### 03 - Rodar Cypress

Para rodar os testes do cypress, podemos utilizar duas formas:

- Rodar cypress local
- Pipeline github actions
- Docker compose

### Rodar Testes com Cypress Localmente

Valide se instalou todas os recursos necessários, lembre-se para máquinas mac e linux é preciso instalar dependencias de sistema conforme link [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)

<b>Após as instalações necessárias, podemos seguir com os seguintes steps de testes:</b>

- Rodar testes em modo CLI (Visualização Gráfica) `npm run cypress:open`
- Todos os testes E2E em modo headless `npm run cypress:e2e-all`

Obs: modo headless ocorre que os testes são executados no terminal sem a visualização gráfica do cypress

### Rodar Testes com Pipeline Github Actions

- Para rodar os testes em pipeline do github basta acessar [Github Actions](https://github.com/WarnnerSinotti/cypressTestBlog/actions) e clicar em Testes E2E Cypress e após `Run workflow`

### Rodar Testes com Docker

- Testes E2E Rode no terminal `docker compose -f docker-compose-e2e.yml up`

# EXTRAS

## Script de Mapeamento de testes E2E e API

Este script desenvolvido para gerar total de testes E2E e API, incluindo a quantidade e descritivo
Para gerar o relatório apenas rodar o comando a seguir

- `npm run reporter:tests`

Após rodar, acessar o arquivo mapeamento-testes [Mapeamento de Testes](documentacao/mapeamentoTestes/mapeamento-testes.md)

## Code Coverage

Caso aplicação web/app estiver configurado para fornecer informação para code coverage do cypress, basta rodar os testes e após os testes rodar o seguinte comando:

- `npm run coverage:open`

Após rodar, acessar o arquivo index.html para validar o percentual de cobertura

Caso, gostaria de conhecer mais sobre o code coverage, só acessar este link oficial [Cypress](https://docs.cypress.io/app/tooling/code-coverage)

Obs: Em fase experimental de estudos e testes

## Prefixos de Commit

| Prefixo  | Significado                                      |
| -------- | ------------------------------------------------ |
| feat     | Nova funcionalidade de teste                     |
| fix      | Correção de quebra de id ou test-id              |
| docs     | Alterações em documentação                       |
| config   | Alterações na configuração do Cypress ou plugins |
| refactor | Refatoração de código, sem nova funcionalidade   |

## Política de privacidade

Todo o documento/arquivos deste repositório é exclusivamente da CypressTestBlog, não podendo expor, compartilhar, divulgar qualquer dados ou arquivos deste, com pessoas ou orgãos não autoriadas.
Seu uso é único para colaboradores da CypressTestBlog do setor de tecnologia e sua aplicação de testes deve ser apenas utilizadas para testes E2E e API em sua própria aplicação CypressTestBlog seja ela frontEnd ou BackEnd.
