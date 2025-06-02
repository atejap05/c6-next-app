"use client"; // Required for useState and other client-side hooks

import { Button } from "@/components/ui/button";
import {
  DragAndDrop,
  ProcessedCsvData,
} from "@/components/my-components/DragAndDrop";
import { TransactionTable } from "@/components/my-components/TransactionTable"; // Importar TransactionTable
import { useState } from "react";

export default function Home() {
  const [processedData, setProcessedData] = useState<ProcessedCsvData | null>(
    null
  );

  const handleFileProcessed = (data: ProcessedCsvData | null) => {
    setProcessedData(data);
    if (data) {
      console.log("Dados do CSV processados:", data);
      // Aqui você pode começar a usar os dados para popular os componentes Card, DataTable, Chart
    } else {
      console.log("Nenhum dado processado ou seleção limpa.");
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
          <DragAndDrop onFileSelect={handleFileProcessed} accept=".csv" />

          {/* O botão de "Processar Fatura" pode ser removido ou ter sua lógica ajustada,
              já que o processamento é disparado ao selecionar o arquivo. 
              Se mantido, poderia servir para disparar uma nova análise ou visualização
              dos dados já carregados (processedData).*/}
          {processedData && (
            <Button
              type="button"
              onClick={() =>
                console.log("Visualizar dados detalhados", processedData)
              } // Exemplo de ação
              className="w-1/2 py-3 text-base font-semibold"
            >
              Visualizar Análise (Exemplo)
            </Button>
          )}
        </div>

        {/* Aqui você adicionará os componentes Card, DataTable e Chart */}
        {processedData && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Resultados da Análise
            </h2>

            {/* Componente DataTable para exibir as transações */}
            <TransactionTable processedData={processedData} />

            {/* Exemplo de como você poderia começar a exibir os dados (pode ser removido ou adaptado) */}
            <div className="p-4 border rounded-md bg-card/70">
              <p>Arquivo: {processedData.fileName}</p>
              <p>Total de Transações: {processedData.rowCount}</p>
              <p>Cabeçalhos: {processedData.headers.join(", ")}</p>
              {/* Idealmente, aqui entraria o DataTable */}
            </div>
            {/* Espaço para Cards e Charts */}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          O processamento do arquivo é feito no servidor.
        </p>
      </div>
    </main>
  );
}
