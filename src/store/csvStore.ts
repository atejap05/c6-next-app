import { create } from "zustand";
import { ProcessedCsvData } from "@/components/my-components/DragAndDrop"; // Adjust path as needed

interface CsvState {
  processedData: ProcessedCsvData | null;
  isLoading: boolean;
  error: string | null;
  setProcessedData: (data: ProcessedCsvData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const useCsvStore = create<CsvState>(set => ({
  processedData: null,
  isLoading: false,
  error: null,
  setProcessedData: data =>
    set({ processedData: data, isLoading: false, error: null }),
  setIsLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error: error, isLoading: false }),
  clearData: () => set({ processedData: null, isLoading: false, error: null }),
}));
