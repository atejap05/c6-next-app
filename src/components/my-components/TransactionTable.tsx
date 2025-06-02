"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ProcessedCsvData } from "./DragAndDrop";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

interface TransactionTableProps {
  processedData: ProcessedCsvData | null;
}

export function TransactionTable({ processedData }: TransactionTableProps) {
  const [showValorUSD, setShowValorUSD] = useState(false);
  const [showCotacaoBRL, setShowCotacaoBRL] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const filteredData = useMemo(() => {
    if (!processedData || !processedData.data) {
      return [];
    }
    if (!searchTerm) {
      return processedData.data;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return processedData.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(lowercasedSearchTerm)
      )
    );
  }, [processedData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (filteredData.length === 0) return 1; // Avoid division by zero if no data
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData, itemsPerPage]);

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

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex  items-center space-x-4">
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
        <div className="flex w-[50%] items-center gap-2">
          <Select
            value={String(itemsPerPage)}
            onValueChange={value => {
              setItemsPerPage(Number(value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map(value => (
                <SelectItem key={value} value={String(value)}>
                  {value} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="w-full md:max-w-2xl"
          />
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
                  {header.replace(/_/g, " ")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/50">
                  {displayHeaders.map(header => (
                    <TableCell
                      key={`${rowIndex}-${header}`}
                      className="px-4 py-3 text-sm text-foreground whitespace-nowrap"
                    >
                      {row[header] !== undefined &&
                      row[header] !== null &&
                      row[header] !== ""
                        ? row[header]
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={displayHeaders.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchTerm
                    ? `Nenhum resultado encontrado para "${searchTerm}".`
                    : "Nenhum dado disponível."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded-md text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
