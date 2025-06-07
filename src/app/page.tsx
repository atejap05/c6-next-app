"use client";

import { TransactionTable } from "@/components/my-components/TransactionTable";
import { useCsvStore, ProcessedCsvData, Transaction } from "@/store/csvStore"; // Import ProcessedCsvData and Transaction
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Define dummy data structure (matches ProcessedCsvData)
const dummyProcessedData: ProcessedCsvData = {
  message: "Dados de exemplo", // Added message field
  fileName: "Fatura Demonstrativa (Exemplo)",
  headers: ["Data", "Descrição", "Valor (em R$)", "Categoria"],
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
      "Valor (em R$)": -2000.0, // Changed to number for consistency
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
  ] as Transaction[], // Cast to Transaction[]
  rowCount: 8, // Re-added rowCount
};

export default function HomePage() {
  const { processedData, isLoading, error, formattedFileName, selectedPeriod } =
    useCsvStore();

  const currentDisplayData: ProcessedCsvData =
    processedData || dummyProcessedData;

  const displayFileName = useMemo(() => {
    if (processedData && formattedFileName) {
      return formattedFileName;
    }
    if (selectedPeriod.startDate) {
      return `Fatura de ${format(selectedPeriod.startDate, "MMMM/yyyy", {
        locale: ptBR,
      })}`;
    }
    return currentDisplayData.fileName;
  }, [
    processedData,
    formattedFileName,
    selectedPeriod.startDate,
    currentDisplayData.fileName,
  ]);

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
      const valueInBRL = row["Valor (em R$)"] || row["Valor"] || row["value"];
      let description = row["Descrição"] || row["description"];

      if (typeof description !== "string") {
        description = String(description ?? ""); // Convert to string, default to empty if null/undefined
      }

      let value: number | null = null;
      if (typeof valueInBRL === "string") {
        const cleanedValueString = valueInBRL
          .replace("R$", "")
          .trim()
          .replace(/\./g, "")
          .replace(",", ".");
        value = parseFloat(cleanedValueString);
      } else if (typeof valueInBRL === "number") {
        value = valueInBRL;
      }

      if (value !== null && !isNaN(value)) {
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
    });

    return {
      totalCharged,
      transactionCount,
      previousInvoicePayment,
    };
  }, [currentDisplayData]);

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

  return (
    <div className="container mx-auto py-8 space-y-6 px-4 md:px-4">
      {/* Removed md:pl-72, pt-20 md:pt-8. Padding is now handled by layout.tsx and container's own padding */}
      {/* Added px-4 for mobile padding, md:px-0 to rely on container for desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Visão Geral das Faturas</h1>
        {/* DatePicker removed from here, now in Sidebar */}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">{displayFileName}</h2>

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
