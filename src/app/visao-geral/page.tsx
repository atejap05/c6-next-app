"use client";

import { TransactionTable } from "@/components/my-components/TransactionTable";
import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";

export default function VisaoGeralPage() {
  const { processedData, isLoading, error } = useCsvStore();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Visão Geral das Transações</h1>

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
            Detalhes da Fatura: {processedData.fileName}
          </h2>
          <TransactionTable processedData={processedData} />
        </div>
      )}

      {!processedData && !isLoading && !error && (
        <div className="text-center mt-8 p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhuma fatura carregada.
          </p>
          <Link href="/upload" legacyBehavior>
            <a className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Fazer Upload de Fatura
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
