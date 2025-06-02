"use client";

import { useCsvStore } from "@/store/csvStore";
import {
  DragAndDrop,
  ProcessedCsvData,
} from "@/components/my-components/DragAndDrop";

export default function UploadPage() {
  const {
    setProcessedData,
    setIsLoading,
    setError,
    processedData,
    isLoading,
    error,
    formattedFileName, // Destructure formattedFileName
  } = useCsvStore();

  const handleFileProcessed = async (file: File | null) => {
    if (!file) {
      // If DragAndDrop calls back with null (e.g. invalid file type, or cleared selection)
      // We ensure the store reflects that no data is being processed or is available.
      // setError might be set by DragAndDrop's internal validation if it passes null for that reason.
      // If it's just a clear action, we might want a different message or no message.
      // For now, if a file is null, we assume an issue or a clear.
      if (!error && !isLoading) {
        // Avoid overwriting a more specific error from DragAndDrop
        setError("Nenhum arquivo selecionado ou seleção inválida.");
      }
      setProcessedData(null); // Clear any existing processed data
      setIsLoading(false); // Ensure loading is false
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Falha ao processar o arquivo no backend."
        );
      }

      const data: ProcessedCsvData = await response.json();
      setProcessedData(data);
      console.log("Dados do CSV processados e armazenados no Zustand:", data);
    } catch (e: unknown) {
      // Use unknown instead of any for better type safety
      console.error("Erro no processamento do arquivo:", e);
      let errorMessage = "Ocorreu um erro ao processar o arquivo.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      setProcessedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine feedback message based on store state
  let feedbackMessage: string | null = null;
  if (isLoading) {
    feedbackMessage = "Processando arquivo...";
  } else if (error) {
    feedbackMessage = error;
  } else if (processedData) {
    // Use formattedFileName if available, otherwise fallback to raw fileName
    const displayName = formattedFileName || processedData.fileName;
    feedbackMessage = `"${displayName}" processada com sucesso! ${processedData.rowCount} linhas carregadas.`;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Upload de Fatura</h1>

      <div className="p-6 rounded-lg shadow-md bg-card max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Carregar Novo Arquivo CSV
        </h2>
        <DragAndDrop
          onFileSelect={handleFileProcessed} // This now correctly expects File | null
          accept=".csv"
        />
        {feedbackMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              error
                ? "text-red-500"
                : processedData && !isLoading
                ? "text-green-500"
                : "text-muted-foreground"
            }`}
          >
            {feedbackMessage}
          </p>
        )}
      </div>
    </div>
  );
}
