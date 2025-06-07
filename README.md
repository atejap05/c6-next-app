# Analisador de Faturas de Cartão de Crédito C6

Este é um projeto Next.js para analisar faturas de cartão de crédito em formato CSV, com foco na visualização de despesas e integração com banco de dados PostgreSQL (Plataforma Neon) usando Prisma.

## Visão Geral

A aplicação permite que os usuários façam upload de arquivos CSV de faturas de cartão de crédito, processa esses dados e os armazena em um banco de dados. O dashboard principal exibe um gráfico de pizza (PieChart) mostrando a distribuição de despesas por titular do cartão.

## Tecnologias Utilizadas

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL (hospedado na Neon)
- **Estilização:** Tailwind CSS
- **Componentes UI:** shadcn/ui
- **Gráficos:** Recharts
- **Linting/Formatting:** ESLint, Prettier

## Setup do Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente:

1. **Clonar o Repositório:**

   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd c6-next-app
   ```

2. **Instalar Dependências:**

   ```bash
   npm install
   ```

   ou

   ```bash
   yarn install
   ```

   ou

   ```bash
   pnpm install
   ```

3. **Configurar Variáveis de Ambiente:**

   - Copie o arquivo `.env.example` (se existir) para `.env` ou crie um novo arquivo `.env` na raiz do projeto.
   - Adicione a URL de conexão do seu banco de dados Neon:

     ```env
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
     ```

     Substitua `USER`, `PASSWORD`, `HOST`, `PORT`, e `DATABASE` com as suas credenciais do Neon. (Você já fez isso para `d:\Git_Projects\c6-next-app\.env`)

4. **Inicializar o Prisma (se ainda não foi feito):**

   Este passo já foi realizado, mas para um novo setup, o comando seria:

   ```bash
   npx prisma init --datasource-provider postgresql
   ```

   Isso cria a pasta `prisma` com o arquivo `schema.prisma` e atualiza o `.env`.

5. **Sincronizar o Schema do Banco de Dados:**

   Este comando aplica o schema definido em `prisma/schema.prisma` ao seu banco de dados, criando as tabelas necessárias. Este passo também já foi realizado.

   ```bash
   npx prisma db push
   ```

6. **(Opcional, mas Recomendado) Popular o Banco de Dados (Seeding):**

   - Um script para popular o banco de dados com dados históricos de CSVs (de 2023 em diante) será desenvolvido.
   - Após a criação do script (ex: `prisma/seed.ts`), você poderá executá-lo com:

     ```bash
     npx prisma db seed
     ```

   - (Nota: A configuração do seeder no `package.json` será necessária para o comando acima funcionar).

7. **Rodar o Servidor de Desenvolvimento:**

   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## Integração com Banco de Dados (Prisma + Neon)

- **ORM:** Utilizamos o Prisma para facilitar a interação com o banco de dados de forma type-safe.
- **Banco de Dados:** PostgreSQL, hospedado na plataforma serverless Neon.
- **Schema (`prisma/schema.prisma`):** Define a estrutura dos dados. Os principais modelos são:
  - `Fatura`: Informações gerais da fatura (nome do arquivo, mês/ano de referência, data de upload).
  - `Transacao`: Detalhes de cada lançamento (data, descrição, valor, parcelas, categoria, etc.).
  - `Cartao`: Informações dos cartões (final, nome do titular).
  - `Categoria`: Para categorizar despesas (nome da categoria).
  - `RegraCategorizacao`: Para automatizar a categorização baseada em descrições de transações.

## Estrutura do Projeto (Principais Pastas)

- `prisma/`: Contém o schema do banco de dados (`schema.prisma`) e futuras migrações ou scripts de seed.
- `public/`: Arquivos estáticos.
- `src/app/`: Rotas da aplicação (App Router do Next.js).
  - `api/`: Rotas de API.
  - `dashboard/`: Página do dashboard principal.
- `src/components/`: Componentes React reutilizáveis.
  - `my-components/`: Componentes customizados para o projeto.
  - `ui/`: Componentes do shadcn/ui.
- `src/data/`: Local para armazenar arquivos CSV de faturas (para desenvolvimento/seeding inicial).
- `src/lib/`: Funções utilitárias (`utils.ts`).
- `src/store/`: Lógica de estado (ex: Zustand store `csvStore.ts`, que será gradualmente substituído/complementado pela interação com o BD).

## Scripts Disponíveis no `package.json` (Exemplos)

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia o servidor de produção (após o build).
- `npm run lint`: Executa o linter.

## Comandos Úteis do Prisma

- `npx prisma studio`: Abre o Prisma Studio, uma interface gráfica para visualizar e editar os dados no banco.
- `npx prisma migrate dev`: Cria uma nova migração baseada nas mudanças do `schema.prisma` e a aplica ao banco (preferível para evoluções de schema em desenvolvimento e produção).
- `npx prisma db push`: Sincroniza o schema com o banco (útil para prototipagem rápida e setups iniciais, como o nosso).
- `npx prisma generate`: Gera/atualiza o Prisma Client após modificações no `schema.prisma` (geralmente executado automaticamente com outros comandos Prisma).

## Fluxo de Dados (Com Integração do Banco de Dados)

1. **Upload de CSV:** O usuário faz o upload de um arquivo CSV através do componente `DragAndDrop.tsx`.
2. **Processamento no Backend:** Uma API Route (ex: `/api/process-csv/route.ts`) recebe o arquivo.
3. **Persistência no Banco:** O backend utiliza o Prisma Client para:
   - Criar um registro para a `Fatura` (incluindo nome do arquivo, mês e ano de referência).
   - Identificar ou criar registros de `Cartao` (baseado no "Final do Cartão" e mapeamento para o titular).
   - Salvar cada linha do CSV como uma `Transacao`, associada à fatura e ao cartão.
   - (Futuramente) Aplicar `RegraCategorizacao` para definir a `Categoria` da transação.
4. **Visualização no Frontend:**
   - As páginas (ex: `src/app/dashboard/page.tsx`) utilizam Server Components, API Routes ou Server Actions para buscar dados do banco de dados via Prisma Client.
   - Os dados são então usados para renderizar tabelas, gráficos (como o PieChart de despesas por cartão) e outras visualizações.

## Próximos Passos e Melhorias Futuras

1. **Desenvolver Script de Seeding (`prisma/seed.ts`):**

   - Criar um script TypeScript para ler os arquivos CSV da pasta `src/data/` (ex: `Fatura_2024-07-05.csv`, `Fatura_2025-06-05.csv`).
   - O script deve processar cada CSV, extrair as transações e popular as tabelas `Fatura`, `Transacao`, e `Cartao` no banco de dados Neon usando o Prisma Client.
   - Configurar o `package.json` para permitir a execução do seed com `npx prisma db seed`.

2. **Refatorar Lógica de Upload e Leitura de Dados:**

   - **Backend (`src/app/api/process-csv/route.ts`):** Modificar para que, ao invés de (ou além de) apenas processar o CSV para o estado do cliente, ele grave os dados nas tabelas do banco de dados usando Prisma.
   - **Frontend (`src/app/dashboard/page.tsx` e outros):** Alterar para buscar os dados diretamente do banco de dados (via Server Components ou API routes que usam Prisma) em vez de depender exclusivamente do `csvStore` para dados persistidos.

3. **Implementar Sistema de Categorização Completo:**

   - **Interface de Usuário:** Permitir o cadastro e gerenciamento de `Categorias` e `RegrasDeCategorizacao` através da interface da aplicação (novas páginas em `src/app/settings/` ou similar).
   - **Lógica de Aplicação:** Implementar a lógica para aplicar automaticamente as categorias às transações durante o upload do CSV ou através de um processo de categorização em lote.

4. **Expandir Dashboards e Análises:**

   - Criar novas visualizações e páginas de análise (ex: gastos por categoria, evolução mensal de despesas, análise de parcelamentos).
   - Implementar filtros avançados (por data, categoria, cartão) nas páginas de visualização de dados.

5. **Melhorar Tratamento de Erros e Feedback ao Usuário:**

   - Aprimorar o feedback durante o upload de arquivos e processamento de dados.

6. **Autenticação de Usuário (Opcional):**

   - Se o projeto for compartilhado ou acessado por múltiplos usuários, implementar um sistema de autenticação (ex: NextAuth.js).

7. **Testes:**

   - Adicionar testes unitários e de integração para garantir a robustez da aplicação.

Este README será atualizado conforme o projeto evolui.
