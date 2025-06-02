"use client"; // Required for useState and other client-side hooks

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-8 text-foreground">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center ">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Dashboard de Análise de Gastos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bem-vindo ao seu painel de controle financeiro.
          </p>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Exemplo de Card - Substituir com dados reais */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Valor Total da Fatura
            </h3>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Nº de Transações
            </h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Gasto Médio
            </h3>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-muted-foreground">
              Maior Despesa
            </h3>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </div>
        </div>

        {/* Placeholder for Charts */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Visualizações Gráficas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-md min-h-[300px]">
              <h3 className="text-lg font-semibold mb-2">
                Gastos por Categoria
              </h3>
              <p className="text-muted-foreground">
                Gráfico de Pizza/Rosca aqui...
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md min-h-[300px]">
              <h3 className="text-lg font-semibold mb-2">
                Top Estabelecimentos
              </h3>
              <p className="text-muted-foreground">Gráfico de Barras aqui...</p>
            </div>
          </div>
        </div>

        {/* Link para a página de upload/detalhes */}
        {/* <div className=\"mt-8 text-center\">
          <Button asChild>
            <Link href=\"/visao-geral\">Ver e Carregar Faturas</Link>
          </Button>
        </div> */}
      </div>
    </main>
  );
}
