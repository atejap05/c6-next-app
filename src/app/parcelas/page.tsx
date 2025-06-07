"use client";

import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";

export default function ParcelasPage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore();

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-2">
      <h1 className="text-3xl font-bold mb-6">Análise de Parcelas</h1>

      {isLoading && (
        <p className="text-center text-muted-foreground mt-8">
          Carregando dados...
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
            {formattedFileName || processedData.fileName}
          </h2>
          {/* Placeholder for installment analysis content */}
          <div className="p-6 rounded-lg shadow-md bg-card">
            <p className="text-muted-foreground">
              Funcionalidade de análise de parcelas em desenvolvimento.
            </p>
            {/* 
              Future considerations:
              - Identify transactions that are installments (e.g., "1/3", "2/6").
              - Group installments by description.
              - Show total paid and remaining for each installment group.
              - Estimate future payments based on installments.
            */}
          </div>
        </div>
      )}

      {!processedData && !isLoading && !error && (
        <div className="text-center mt-8 p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhuma fatura carregada para analisar parcelas.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Fazer Upload de Fatura
          </Link>
        </div>
      )}
    </div>
  );
}
