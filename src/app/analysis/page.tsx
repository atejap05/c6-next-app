"use client";

import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysisPage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Análises Avançadas</h1>

      {isLoading && (
        <p className="text-center text-muted-foreground mt-8">
          Carregando dados para análise...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500 mt-8">
          Erro ao carregar dados: {error}
        </p>
      )}

      {processedData && !isLoading && !error && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Analisando: {formattedFileName || processedData.fileName}
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore diferentes aspectos dos seus gastos com análises detalhadas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise por Categoria (Em Breve)</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Detalhes sobre gastos agrupados por categoria. Funcionalidade
                  em desenvolvimento.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comparativo Mensal (Em Breve)</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Compare seus gastos ao longo de diferentes meses.
                  Funcionalidade em desenvolvimento.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Maiores Despesas (Em Breve)</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Identifique suas maiores transações e categorias de despesa.
                  Funcionalidade em desenvolvimento.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Análise de Comerciantes (Em Breve)</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Veja onde você mais gasta. Funcionalidade em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!processedData && !isLoading && !error && (
        <div className="text-center mt-8 p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhuma fatura carregada para realizar análises.
          </p>
          <Link href="/upload" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Fazer Upload de Fatura
            </Link>
        </div>
      )}
    </div>
  );
}
