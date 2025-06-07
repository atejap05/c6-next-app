import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define the structure of a single transaction/row in the CSV
export interface Transaction {
  [key: string]: string | number | null; // Allow string, number, or null
}

// Define the structure for the processed CSV data
export interface ProcessedCsvData {
  message: string;
  fileName: string;
  rowCount: number;
  headers: string[];
  data: Transaction[];
}

export interface CsvState {
  rawFile: File | null;
  processedData: ProcessedCsvData | null;
  isLoading: boolean;
  error: string | null;
  formattedFileName: string | null;
  selectedPeriod: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setRawFile: (file: File | null) => void;
  setProcessedData: (data: ProcessedCsvData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFormattedFileName: (name: string | null) => void;
  setSelectedPeriod: (
    period: Partial<{ startDate: Date | undefined; endDate: Date | undefined }>
  ) => void;
  resetState: () => void;
}

const initialState: Omit<
  CsvState,
  | "setRawFile"
  | "setProcessedData"
  | "setIsLoading"
  | "setError"
  | "setFormattedFileName"
  | "setSelectedPeriod"
  | "resetState"
> = {
  rawFile: null,
  processedData: null,
  isLoading: false,
  error: null,
  formattedFileName: null,
  selectedPeriod: {
    startDate: new Date(), // Default to current date
    endDate: undefined,
  },
};

export const useCsvStore = create<CsvState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setRawFile: file => set({ rawFile: file }),
        setProcessedData: data => set({ processedData: data }),
        setIsLoading: loading => set({ isLoading: loading }),
        setError: error => set({ error: error }),
        setFormattedFileName: name => set({ formattedFileName: name }),
        setSelectedPeriod: periodUpdate =>
          set(state => ({
            selectedPeriod: { ...state.selectedPeriod, ...periodUpdate },
          })),
        resetState: () => set(initialState as CsvState), // Cast to CsvState
      }),
      {
        name: "csv-storage", // name of the item in the storage (must be unique)
        // getStorage: () => sessionStorage, // (optionally) define storage solution - removed for now to simplify
      }
    )
  )
);
