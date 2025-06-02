"use client";

import {
  useState,
  DragEvent,
  ChangeEvent,
  ReactNode,
  KeyboardEvent,
} from "react";
import { UploadCloud, X as XIcon } from "lucide-react";

export interface ProcessedCsvData {
  fileName: string;
  rowCount: number;
  headers: string[];
  data: Record<string, string>[]; // Array de objetos, onde cada objeto representa uma linha
}

interface DragAndDropProps {
  /**
   * Função chamada quando um arquivo é selecionado ou a seleção é limpa.
   * Passa o objeto File ou `null`.
   */
  onFileSelect: (file: File | null) => void;
  /**
   * String contendo os tipos de arquivo aceitos, separados por vírgula.
   * Exemplos: ".csv", "image/*", ".pdf,application/pdf", "text/csv,application/vnd.ms-excel,.csv"
   */
  accept?: string;
}

export function DragAndDrop({
  onFileSelect,
  accept,
}: DragAndDropProps): ReactNode {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Essencial para permitir o drop
    e.stopPropagation();
    setDragging(true);
    setError(null); // Limpar erro ao arrastar sobre
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Evita que o estado 'dragging' seja desativado ao mover sobre elementos filhos
    // if (e.currentTarget.contains(e.relatedTarget as Node)) {
    //   return;
    // }
    setDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (accept && accept.trim() !== "") {
      const acceptedTypes = accept
        .split(",")
        .map(type => type.trim().toLowerCase());
      const fileTypeLower = file.type.toLowerCase();
      const fileExtension = `.${
        file.name.split(".").pop()?.toLowerCase() || ""
      }`;

      let isValid = acceptedTypes.includes(fileTypeLower);
      if (!isValid && fileExtension !== ".") {
        isValid = acceptedTypes.includes(fileExtension);
      }
      if (!isValid) {
        isValid = acceptedTypes.some(acceptedType => {
          if (acceptedType.endsWith("/*")) {
            const baseType = acceptedType.slice(0, -2);
            return fileTypeLower.startsWith(baseType + "/");
          }
          return false;
        });
      }

      if (!isValid) {
        const userFriendlyAccept = accept
          .replace(/,/g, ", ")
          .replace(/\/\*/g, "/*"); // Corrected regex escape
        setError(`Formato inválido. Use: ${userFriendlyAccept}`);
        onFileSelect(null); // Pass null if invalid
        setFileName(null);
        return false; // Indicate failure
      }
    }
    return true;
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Essencial para que o navegador não abra o arquivo
    e.stopPropagation();
    setDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    } else {
      onFileSelect(null);
      setFileName(null);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Limpar erro ao selecionar novo arquivo
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect(file);
      }
    } else {
      setFileName(null);
      onFileSelect(null); // Pass null if no file is selected
    }
    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = "";
  };

  const handleClearFile = () => {
    setFileName(null);
    setError(null);
    onFileSelect(null); // Pass null when clearing
  };

  const openFileDialog = () => {
    const inputElement = document.getElementById(
      "fileInput-dragAndDrop" // ID único para o input
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!fileName && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openFileDialog();
    }
  };

  return (
    <div
      className={`w-full p-6 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out cursor-pointer
        ${
          dragging
            ? "border-sky-500 bg-sky-900/30"
            : "border-slate-600 hover:border-slate-500"
        }
        ${error ? "border-red-500 bg-red-900/20" : ""}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!fileName ? openFileDialog : undefined}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={
        fileName
          ? `Arquivo selecionado: ${fileName}. Clique para alterar.`
          : "Área para arrastar e soltar ou clicar para selecionar arquivo"
      }
    >
      <input
        type="file"
        id="fileInput-dragAndDrop" // ID único para o input
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud
          className={`w-12 h-12 mb-3 transition-colors duration-200 ease-in-out ${
            dragging ? "text-sky-400" : "text-slate-400"
          }`}
          aria-hidden="true"
        />
        {fileName ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-slate-300">
                Arquivo:{" "}
                <span className="font-semibold text-sky-400 break-all">
                  {fileName}
                </span>
              </p>
              <button
                onClick={e => {
                  e.stopPropagation(); // Evita que o openFileDialog seja acionado
                  handleClearFile();
                }}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                aria-label="Limpar seleção de arquivo"
                type="button"
              >
                <XIcon size={18} />
              </button>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                openFileDialog();
              }}
              className="text-sm text-sky-500 hover:text-sky-400 underline"
              type="button"
            >
              Trocar arquivo
            </button>
          </div>
        ) : (
          <>
            <p className="text-lg font-semibold text-slate-200">
              {dragging ? "Solte o arquivo aqui" : "Arraste e solte o arquivo"}
            </p>
            <p className="text-sm text-slate-400">ou clique para selecionar</p>
          </>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          {accept
            ? `Formatos: ${accept.replace(/,/g, ", ").replace(/\.\*/g, "/*")}`
            : "Qualquer formato de arquivo"}
        </p>
      </div>
    </div>
  );
}
