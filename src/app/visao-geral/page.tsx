"use client";

import { TransactionTable } from "@/components/my-components/TransactionTable";
import { useCsvStore } from "@/store/csvStore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react"; // Import useMemo

export default function VisaoGeralPage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore(); // Added formattedFileName

  const summaryStats = useMemo(() => {
    if (!processedData || !processedData.data) {
      return {
        totalCharged: 0,
        transactionCount: 0,
        previousInvoicePayment: 0,
      };
    }

    let totalCharged = 0;
    let previousInvoicePayment = 0;
    const transactionCount = processedData.data.length;

    processedData.data.forEach(row => {
      // Assuming the value is in a column named 'Valor (em R$)' or similar
      // And description is in 'Descrição'
      const valueString = row["Valor (em R$)"] || row["Valor"] || row["value"]; // Adjust column name as needed
      const description = row["Descrição"] || row["description"]; // Adjust column name as needed

      if (valueString) {
        const value = parseFloat(valueString.replace(",", ".")); // Handle decimal comma
        if (!isNaN(value)) {
          if (value > 0) {
            // Exclude negative values for total charged
            totalCharged += value;
          }
          if (
            description &&
            description.toLowerCase().includes("inclusao de pagamento")
          ) {
            previousInvoicePayment += Math.abs(value); // Sum absolute values for payments
          }
        }
      }
    });

    return {
      totalCharged,
      transactionCount,
      previousInvoicePayment,
    };
  }, [processedData]);

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
            {formattedFileName || processedData.fileName}{" "}
            {/* Use formatted name from store */}
          </h2>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Cobrado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {summaryStats.totalCharged.toLocaleString("pt-BR", {
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
                  {summaryStats.transactionCount}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pagamento Fatura Anterior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {summaryStats.previousInvoicePayment.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>

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
