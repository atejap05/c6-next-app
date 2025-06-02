"use client";

import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore();

  // Placeholder data for KPIs - replace with actual calculations from processedData
  const kpiData = {
    totalSpent: 0,
    transactionCount: 0,
    averageTransaction: 0,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="p-8 border-2 border-dashed border-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Bem-vindo ao Dashboard
          </h2>
          <p className="text-muted-foreground mb-4">
            Nenhuma fatura carregada. Faça o upload de um arquivo CSV para
            visualizar suas análises.
          </p>
          <Link href="/upload" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Fazer Upload de Fatura
            </a>
          </Link>
        </div>
      </div>
    );
  }

  // If data is loaded, show the dashboard content
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-2">
        Dashboard: {formattedFileName || processedData.fileName}
      </h1>
      <p className="text-muted-foreground mb-6">
        Resumo financeiro e visualizações da sua fatura.
      </p>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Gasto (Fatura Atual)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* Placeholder - Calculate from processedData */}
              {kpiData.totalSpent.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Número de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* Placeholder - Calculate from processedData */}
              {processedData.data.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gasto Médio por Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* Placeholder - Calculate from processedData */}
              {kpiData.averageTransaction.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Visualizações Gráficas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle>Gastos por Categoria (Em Breve)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <p className="text-muted-foreground">
                Gráfico de gastos por categoria em desenvolvimento.
              </p>
            </CardContent>
          </Card>
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle>Tendência de Gastos (Em Breve)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <p className="text-muted-foreground">
                Gráfico de tendência de gastos em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
