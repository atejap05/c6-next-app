import { create } from "zustand";
import { ProcessedCsvData } from "@/components/my-components/DragAndDrop"; // Adjust path as needed

interface CsvState {
  processedData: ProcessedCsvData | null;
  isLoading: boolean;
  error: string | null;
  formattedFileName: string | null; // Added formatted file name
  setProcessedData: (data: ProcessedCsvData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

// Helper function to format the date from the filename (moved here)
const formatFileNameToDateTitle = (
  fileName: string | undefined
): string | null => {
  if (
    !fileName ||
    !fileName.startsWith("Fatura_") ||
    !fileName.endsWith(".csv")
  ) {
    return fileName || null; // Return original or null if format is unexpected
  }
  try {
    const datePart = fileName.substring(7, fileName.length - 4); // Extracts YYYY-MM-DD
    const [year, month, day] = datePart.split("-").map(Number);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return fileName; // Return original if date parts are not numbers
    }

    const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date

    // Check if the constructed date is valid
    if (isNaN(date.getTime())) {
      return fileName; // Return original if date is invalid
    }

    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Fatura de ${formattedDate}`;
  } catch (error) {
    console.error("Error formatting file name:", error);
    return fileName; // Return original filename in case of any error
  }
};

export const useCsvStore = create<CsvState>(set => ({
  processedData: null,
  isLoading: false,
  error: null,
  formattedFileName: null, // Initialize formatted file name
  setProcessedData: data =>
    set({
      processedData: data,
      isLoading: false,
      error: null,
      formattedFileName: data ? formatFileNameToDateTitle(data.fileName) : null, // Calculate and set formatted name
    }),
  setIsLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error: error, isLoading: false }),
  clearData: () =>
    set({
      processedData: null,
      isLoading: false,
      error: null,
      formattedFileName: null, // Clear formatted name
    }),
}));
