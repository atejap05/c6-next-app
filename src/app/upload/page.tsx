"use client";

import { useState } from "react";
import {
  DragAndDrop,
  ProcessedCsvData,
} from "@/components/my-components/DragAndDrop";
// import { TransactionTable } from "@/components/my-components/TransactionTable"; // Not displaying table here for now

export default function UploadPage() {
  const [processedData, setProcessedData] = useState<ProcessedCsvData | null>(
    null
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleFileProcessed = (data: ProcessedCsvData | null) => {
    setProcessedData(data);
    if (data) {
      console.log("Dados do CSV processados na página Upload:", data);
      setFeedbackMessage(
        `Arquivo "${data.fileName}" processado com sucesso! ${data.rowCount} linhas carregadas.`
      );
      // Optionally, you could redirect or show a link to a page where data is visualized
    } else {
      console.log("Nenhum dado processado ou seleção limpa na página Upload.");
      setFeedbackMessage("Falha no processamento ou seleção de arquivo limpa.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Upload de Fatura</h1>

      <div className="p-6 rounded-lg shadow-md bg-card max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Carregar Novo Arquivo CSV
        </h2>
        <DragAndDrop onFileSelect={handleFileProcessed} accept=".csv" />
        {feedbackMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              processedData ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedbackMessage}
          </p>
        )}
      </div>

      {/* 
      // If you want to display the table directly on this page after upload:
      {processedData && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Visualização Prévia: {processedData.fileName}
          </h2>
          <TransactionTable processedData={processedData} />
        </div>
      )}
      */}
    </div>
  );
}
