"use client";

import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";
import { TransactionTable } from "@/components/my-components/TransactionTable"; // Assuming you might reuse this

export default function TransactionsPage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Transações Detalhadas</h1>

      {isLoading && (
        <p className="text-center text-muted-foreground mt-8">
          Carregando dados das transações...
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
          <p className="text-muted-foreground mb-4">
            Todas as transações da fatura selecionada. Utilize os filtros e a
            paginação para explorar.
          </p>
          <TransactionTable processedData={processedData} />
          {/* 
            Future enhancements for this page:
            - Advanced filtering options (by category, date range, amount).
            - Sorting by different columns.
            - Bulk actions (e.g., categorize multiple transactions).
          */}
        </div>
      )}

      {!processedData && !isLoading && !error && (
        <div className="text-center mt-8 p-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhuma fatura carregada para exibir transações.
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
