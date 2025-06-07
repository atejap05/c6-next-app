# Analisador de Faturas de Cartão de Crédito C6

Este é um projeto Next.js para analisar faturas de cartão de crédito, com foco na integração com um banco de dados PostgreSQL (Neon) via Prisma para análise multi-cartão e multi-período.

## Visão Geral

A aplicação permite a análise de despesas de cartão de crédito ao longo de diferentes períodos. Os dados são armazenados e gerenciados em um banco de dados PostgreSQL (Neon) utilizando Prisma como ORM. A interface principal oferece uma visão geral das transações, filtrável por um período selecionado globalmente (mês/ano) através de um `DatePicker` localizado na barra lateral. O objetivo é fornecer uma ferramenta robusta para o acompanhamento financeiro detalhado.

## Tecnologias Utilizadas

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL (hospedado na Neon)
- **Gerenciamento de Estado:** Zustand
- **Estilização:** Tailwind CSS
- **Componentes UI:** shadcn/ui
- **Gráficos:** Recharts (planejado)
- **Linting/Formatting:** ESLint, Prettier

## Objetivos Principais / MVP (Minimum Viable Product)

1.  **Conexão com Banco de Dados:** Estabelecer e validar a conexão estável com o banco de dados Neon utilizando Prisma.
2.  **Schema do Banco de Dados:** Definir e migrar o schema inicial do banco de dados (`Fatura`, `Transacao`, `Cartao`, `Categoria`).
3.  **Seeding Inicial:** Popular o banco de dados com dados históricos a partir dos arquivos CSV localizados em `src/data/`.
4.  **Seleção Global de Período:**
    - Implementar um `DatePicker` na `Sidebar` para seleção de um intervalo de mês/ano.
    - Gerenciar o estado do período selecionado com Zustand (`csvStore.ts`).
    - Restringir a data máxima do `DatePicker` para o mês atual.
    - Restringir a data mínima do `DatePicker` para o mês da fatura mais antiga presente no banco de dados.
5.  **Visualização de Dados na Home Page ("Visão Geral"):**
    - A página `app/page.tsx` deve exibir transações e um resumo financeiro.
    - Os dados exibidos devem ser filtrados de acordo com o `selectedPeriod` do Zustand.
    - Se nenhum período for selecionado, exibir dados a partir da fatura mais antiga disponível.

## Features Atuais

- **Configuração do Prisma e Neon:** `DATABASE_URL` configurada no `.env` e schema inicial (`prisma/schema.prisma`) migrado para o banco de dados Neon.
- **Estrutura da UI:**
  - Layout responsivo com `Sidebar` colapsável.
  - Componente `DatePicker` integrado à `Sidebar` para seleção de período.
  - Página principal "Visão Geral" (`app/page.tsx`) para exibição de dados.
- **Gerenciamento de Estado (Zustand):**
  - `csvStore.ts` configurado para gerenciar `selectedPeriod`, `isLoading`, `error`.
  - Lógica inicial para carregar dados (atualmente de `dummy-data/data.json`) e definir um período padrão com base na fatura mais antiga (mockada).
- **Componente `StoreInitializer`:** Garante que o estado inicial (como `selectedPeriod`) seja configurado corretamente ao carregar a aplicação.

## Setup do Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente:

1.  **Clonar o Repositório:**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd c6-next-app
    ```

2.  **Instalar Dependências:**

    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**

    - Crie um arquivo `.env` na raiz do projeto.
    - Adicione a URL de conexão do seu banco de dados Neon (com `-pooler`):
      ```env
      DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.PROVIDER.neon.tech/DATABASE?sslmode=require"
      ```
      (Você já configurou isso no seu ambiente)

4.  **Aplicar Migrações do Prisma:**
    Se houver novas alterações no `prisma/schema.prisma` ou para configurar um novo ambiente:

    ```bash
    npx prisma migrate dev --name <nome_descritivo_da_migracao>
    ```

    (O schema inicial já foi migrado com `npx prisma migrate dev --name initial-schema`)

5.  **Popular o Banco de Dados (Seeding):**
    Após a criação do script `prisma/seed.ts`:

    ```bash
    npx prisma db seed
    ```

    (Será necessário configurar `"prisma": { "seed": "ts-node --compiler-options {\\\\\"module\\\\\":\\\\\"CommonJS\\\\\"} prisma/seed.ts" }` no `package.json`)

6.  **Rodar o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

## Integração com Banco de Dados (Prisma + Neon)

- **ORM:** Prisma para interação type-safe com o banco de dados PostgreSQL.
- **Banco de Dados:** PostgreSQL, hospedado na plataforma serverless Neon.
- **Schema (`prisma/schema.prisma`):**
  - `Fatura`: `id`, `dataReferencia` (DateTime), `dataUpload`, `nomeArquivoOriginal`, `cartaoId`, `transacoes`.
  - `Transacao`: `id`, `data`, `descricao`, `valor`, `moeda` (BRL/USD), `categoriaOriginal` (String?), `valorUSD` (Decimal?), `cotacaoBRL` (Decimal?), `faturaId`, `categoriaId` (opcional).
  - `Cartao`: `id`, `final`, `nomeTitular`, `faturas`.
  - `Categoria`: `id`, `nome`, `transacoes`.
  - `RegraCategorizacao`: (Planejado) `id`, `descricaoContem`, `categoriaId`.

## Estrutura do Projeto (Principais Pastas)

- `prisma/`: Schema (`schema.prisma`), migrações, script de seed (`seed.ts`).
- `public/`: Arquivos estáticos.
- `src/app/`: Rotas da aplicação (App Router).
  - `page.tsx`: Página "Visão Geral".
  - `api/`: Rotas de API (ex: para futuras interações diretas com o cliente, se necessário).
- `src/components/`:
  - `my-components/`: Componentes customizados (`DatePicker.tsx`, `Sidebar.tsx`, `StoreInitializer.tsx`, `TransactionTable.tsx`).
  - `ui/`: Componentes do shadcn/ui.
- `src/data/`: Arquivos CSV de faturas para seeding inicial.
- `src/lib/`: Funções utilitárias.
- `src/store/`: Gerenciamento de estado com Zustand (`csvStore.ts`).

## Comandos Úteis do Prisma

- `npx prisma studio`: Abre o Prisma Studio para visualização e edição de dados.
- `npx prisma migrate dev --name <nome_migracao>`: Cria e aplica migrações.
- `npx prisma generate`: Gera/atualiza o Prisma Client (geralmente automático).
- `npx prisma db seed`: Executa o script de seeding.

## Fluxo de Dados (Planejado com Banco de Dados)

1.  **Seeding Inicial:** O script `prisma/seed.ts` lê os CSVs de `src/data/`, processa-os e popula o banco de dados Neon.
2.  **Carregamento da Aplicação:**
    - `StoreInitializer` pode (ou uma action no `csvStore`) buscar a data da fatura mais antiga do banco para configurar o limite mínimo do `DatePicker`.
    - O `selectedPeriod` no Zustand é inicializado (ex: para o mês da fatura mais antiga ou um período padrão).
3.  **Interação do Usuário:**
    - O usuário seleciona um período no `DatePicker` da `Sidebar`.
    - O estado `selectedPeriod` no Zustand é atualizado.
4.  **Busca e Exibição de Dados:**
    - A página "Visão Geral" (`app/page.tsx`), provavelmente usando Server Components ou fetching em Client Components, consulta o banco de dados via Prisma Client.
    - A query ao banco filtra as transações com base no `selectedPeriod` do Zustand.
    - Os dados são renderizados em tabelas e (futuramente) gráficos.

## Próximos Passos

1.  **Desenvolver Script de Seeding (`prisma/seed.ts`):**

    - Ler arquivos CSV de `src/data/`.
    - Mapear colunas do CSV para os modelos Prisma (`Fatura`, `Transacao`, `Cartao`).
    - Lidar com datas, valores monetários e relacionamentos.
    - Inserir os dados no banco Neon usando Prisma Client.
    - Configurar `package.json` para `npx prisma db seed`.

2.  **Refatorar `csvStore.ts` e Componentes para Usar o Banco de Dados:**

    - Criar uma action no `csvStore.ts` (ex: `fetchInitialAppData` ou similar) para:
      - Buscar a data da fatura mais antiga do banco de dados.
      - Atualizar o estado `oldestInvoiceDate` no store.
      - Garantir que `selectedPeriod` seja definido com base nisso, se não houver um período já selecionado.
    - Modificar `DatePicker.tsx` para usar `oldestInvoiceDate` do store para definir sua data mínima (`fromDate`, `fromYear`).
    - Atualizar `app/page.tsx` (e futuros componentes de visualização) para buscar e exibir dados diretamente do banco de dados, filtrados pelo `selectedPeriod`. Isso pode envolver Server Actions, API routes que usam Prisma, ou fetching em Server Components.

3.  **Implementar Sistema de Categorização:**

    - Permitir cadastro de `Categorias`.
    - Criar UI para `RegrasDeCategorizacao`.
    - Aplicar categorização durante o seeding e/ou em transações futuras.

4.  **Expandir Dashboards e Análises:**

    - Novas visualizações (gastos por categoria, evolução mensal).
    - Filtros avançados.

5.  **Melhorar Tratamento de Erros e Feedback.**

6.  **Testes.**

Este README será atualizado conforme o projeto evolui.
