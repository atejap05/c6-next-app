"use client";

import { useState } from "react";
import {
  DragAndDrop,
  ProcessedCsvData,
} from "@/components/my-components/DragAndDrop";
import { TransactionTable } from "@/components/my-components/TransactionTable";

export default function VisaoGeralPage() {
  const [processedData, setProcessedData] = useState<ProcessedCsvData | null>(
    null
  );

  const handleFileProcessed = (data: ProcessedCsvData | null) => {
    setProcessedData(data);
    if (data) {
      console.log("Dados do CSV processados na página Visão Geral:", data);
    } else {
      console.log("Nenhum dado processado ou seleção limpa na Visão Geral.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Visão Geral das Transações</h1>

      <div className="p-6 rounded-lg shadow-md bg-card">
        <h2 className="text-xl font-semibold mb-4">Carregar Nova Fatura</h2>
        <DragAndDrop onFileSelect={handleFileProcessed} accept=".csv" />
      </div>

      {processedData && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Detalhes da Fatura: {processedData.fileName}
          </h2>
          <TransactionTable processedData={processedData} />
        </div>
      )}

      {!processedData && (
        <p className="text-center text-muted-foreground mt-8">
          Nenhuma fatura carregada. Faça o upload de um arquivo CSV para ver as
          transações.
        </p>
      )}
    </div>
  );
}
