"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ProcessedCsvData } from "./DragAndDrop"; // Assuming ProcessedCsvData is exported from DragAndDrop
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { useState, useMemo } from "react"; // Import useState and useMemo

interface TransactionTableProps {
  processedData: ProcessedCsvData | null;
}

export function TransactionTable({ processedData }: TransactionTableProps) {
  const [showValorUSD, setShowValorUSD] = useState(false);
  const [showCotacaoBRL, setShowCotacaoBRL] = useState(false);

  // Moved useMemo before the early return
  const displayHeaders = useMemo(() => {
    if (!processedData || !processedData.headers) {
      return [];
    }
    let filteredHeaders = processedData.headers;
    if (!showValorUSD) {
      filteredHeaders = filteredHeaders.filter(h => h !== "Valor (em US$)");
    }
    if (!showCotacaoBRL) {
      filteredHeaders = filteredHeaders.filter(h => h !== "Cotação (em R$)");
    }
    return filteredHeaders;
  }, [processedData, showValorUSD, showCotacaoBRL]);

  if (
    !processedData ||
    !processedData.data ||
    processedData.data.length === 0
  ) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhum dado para exibir na tabela.
      </p>
    );
  }

  const { data } = processedData; // headers is already accessed via processedData.headers in useMemo

  return (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showValorUSD"
            checked={showValorUSD}
            onCheckedChange={() => setShowValorUSD(!showValorUSD)}
          />
          <label
            htmlFor="showValorUSD"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar Valor (em US$)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showCotacaoBRL"
            checked={showCotacaoBRL}
            onCheckedChange={() => setShowCotacaoBRL(!showCotacaoBRL)}
          />
          <label
            htmlFor="showCotacaoBRL"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar Cotação (em R$)
          </label>
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {displayHeaders.map(header => (
                <TableHead
                  key={header}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap"
                >
                  {header.replace(/_/g, " ")}{" "}
                  {/* Replace underscores for better readability */}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/50">
                {displayHeaders.map(header => (
                  <TableCell
                    key={`${rowIndex}-${header}`}
                    className="px-4 py-3 text-sm text-foreground whitespace-nowrap"
                  >
                    {row[header] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
