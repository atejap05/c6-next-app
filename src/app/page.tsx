"use client";

import { TransactionTable } from "@/components/my-components/TransactionTable";
import { useCsvStore } from "@/store/csvStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

// Define dummy data structure (matches ProcessedCsvData)
const dummyProcessedData = {
  fileName: "Fatura Demonstrativa (Exemplo Jun/2025)",
  headers: ["Data", "Descrição", "Valor (em R$)", "Categoria"], // Added headers
  data: [
    {
      Data: "01/06/2025",
      Descrição: "Supermercado Bom Preço",
      "Valor (em R$)": "320,50",
      Categoria: "Alimentação",
    },
    {
      Data: "02/06/2025",
      Descrição: "Restaurante Sabor da Terra",
      "Valor (em R$)": "95,00",
      Categoria: "Restaurante",
    },
    {
      Data: "03/06/2025",
      Descrição: "Assinatura Streaming Vídeo",
      "Valor (em R$)": "45,90",
      Categoria: "Entretenimento",
    },
    {
      Data: "04/06/2025",
      Descrição: "Conta de Luz - Residencial",
      "Valor (em R$)": "180,70",
      Categoria: "Contas Fixas",
    },
    {
      Data: "05/06/2025",
      Descrição: "Compra Online - Eletrônicos",
      "Valor (em R$)": "899,00",
      Categoria: "Compras",
    },
    {
      Data: "05/06/2025",
      Descrição: "INCLUSAO DE PAGAMENTO",
      "Valor (em R$)": "-2000,00",
      Categoria: "Pagamento",
    },
    {
      Data: "06/06/2025",
      Descrição: "Transporte App - Ida Trabalho",
      "Valor (em R$)": "25,00",
      Categoria: "Transporte",
    },
    {
      Data: "07/06/2025",
      Descrição: "Farmácia Bem Estar",
      "Valor (em R$)": "60,25",
      Categoria: "Saúde",
    },
  ],
  rowCount: 8, // Reflects the number of dummy transactions
};

export default function HomePage() {
  const { processedData, isLoading, error, formattedFileName } = useCsvStore();

  // Determine the data to display: store data if available, otherwise dummy data
  const currentDisplayData = processedData || dummyProcessedData;
  // Determine the file name to display
  const displayFileName =
    (processedData ? formattedFileName : null) || currentDisplayData.fileName;

  const summaryStats = useMemo(() => {
    if (!currentDisplayData || !currentDisplayData.data) {
      return {
        totalCharged: 0,
        transactionCount: 0,
        previousInvoicePayment: 0,
      };
    }

    let totalCharged = 0;
    let previousInvoicePayment = 0;
    const transactionCount = currentDisplayData.data.length;

    currentDisplayData.data.forEach(row => {
      const valueString = row["Valor (em R$)"] || row["Valor"] || row["value"];
      const description = row["Descrição"] || row["description"];

      if (valueString) {
        const cleanedValueString = String(valueString)
          .replace("R$", "")
          .trim() // Remove leading/trailing whitespace
          .replace(/\./g, "") // Remove thousand separators if used like 1.234,56
          .replace(",", "."); // Replace decimal comma with point
        const value = parseFloat(cleanedValueString);

        if (!isNaN(value)) {
          if (value > 0) {
            totalCharged += value;
          }
          if (
            description &&
            (description.toLowerCase().includes("inclusao de pagamento") ||
              description.toLowerCase().includes("pagamento efetuado") ||
              description.toLowerCase().includes("pagamento de fatura")) &&
            value < 0
          ) {
            previousInvoicePayment += Math.abs(value);
          }
        }
      }
    });

    return {
      totalCharged,
      transactionCount,
      previousInvoicePayment,
    };
  }, [currentDisplayData]); // Dependency is now currentDisplayData

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground mt-8">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-center text-red-500 mt-8">
          Erro ao carregar dados: {error}
        </p>
      </div>
    );
  }

  // If not loading and no error, render the page with currentDisplayData (real or dummy)
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Visão Geral das Faturas</h1>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{displayFileName} </h2>

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
              <p className="text-2xl font-bold text-red-500">
                {summaryStats.previousInvoicePayment.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-semibold mb-4">Detalhes das Transações</h3>
        <TransactionTable processedData={currentDisplayData} />
      </div>
    </div>
  );
}
