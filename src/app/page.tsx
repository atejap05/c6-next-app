"use client"; // Required for useState and other client-side hooks

import { Button } from "@/components/ui/button";
import { DragAndDrop } from "@/components/my-components/DragAndDrop";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    // You can add further processing logic here if needed when a file is selected
    if (file) {
      console.log("Arquivo selecionado:", file.name);
    } else {
      console.log("Nenhum arquivo selecionado ou seleção limpa.");
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log("Processando fatura:", selectedFile.name);
      // TODO: Implement actual CSV processing logic here
      alert(`Processando: ${selectedFile.name}`);
    } else {
      alert("Por favor, selecione um arquivo CSV primeiro.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-foreground">
      <div className="w-full max-w-prose space-y-8 rounded-xl bg-card/50 p-10 shadow-2xl backdrop-blur-md">
        <div className="text-center ">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Análise de Gastos
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Faça o upload da sua fatura de cartão de crédito em formato CSV para
            visualizar seus gastos de forma inteligente.
          </p>
        </div>
        <div className="space-y-6 text-center">
          <DragAndDrop onFileSelect={handleFileSelected} accept=".csv" />

          <Button
            type="button" // Changed from submit as we are handling click with handleSubmit
            onClick={handleSubmit}
            className="w-1/2 py-3 text-base font-semibold disabled:opacity-50" // Removed bg-sky-600 and hover:bg-sky-700
            disabled={!selectedFile} // Disable button if no file is selected
          >
            Processar Fatura
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Seus dados são processados localmente no seu navegador e não são
          enviados para nenhum servidor.
        </p>
      </div>
    </main>
  );
}
