import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { parse, startOfMonth, endOfMonth } from "date-fns";

// Define the structure of a single transaction/row in the CSV
export interface Transaction {
  "Data de Compra"?: string; // "DD/MM/YYYY"
  "Data da Fatura"?: string; // "YYYY-MM-DD"
  "Nome no Cartão"?: string;
  "Final do Cartão"?: string;
  Categoria?: string;
  Descrição?: string;
  Parcela?: string;
  "Valor (em US$)"?: number;
  "Cotação (em R$)"?: number;
  "Valor (em R$)"?: number;
  [key: string]: string | number | null | undefined; // Adjusted to include undefined for optional known props
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
  oldestInvoiceDate: Date | null; // New state for oldest invoice date
  setRawFile: (file: File | null) => void;
  setProcessedData: (
    data: ProcessedCsvData | null,
    allTransactions?: Transaction[] // Optional: pass all transactions to find the oldest
  ) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFormattedFileName: (name: string | null) => void;
  setSelectedPeriod: (
    period: Partial<{ startDate: Date | undefined; endDate: Date | undefined }>
  ) => void;
  setOldestInvoiceDate: (date: Date | null) => void; // Setter for oldestInvoiceDate
  fetchAndSetInitialData: () => Promise<void>; // New action to fetch dummy data
  ensureInitialPeriodIsSet: () => void; // New action
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
  | "setOldestInvoiceDate"
  | "fetchAndSetInitialData"
  | "ensureInitialPeriodIsSet" // Added to Omit
  | "resetState"
> = {
  rawFile: null,
  processedData: null,
  isLoading: false,
  error: null,
  formattedFileName: null,
  selectedPeriod: {
    startDate: undefined, // Default to undefined
    endDate: undefined, // Default to undefined
  },
  oldestInvoiceDate: null, // Initialize oldestInvoiceDate
};

export const useCsvStore = create<CsvState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setRawFile: file => set({ rawFile: file }),
        setProcessedData: (data, allTransactions) => {
          set({ processedData: data });
          if (allTransactions && allTransactions.length > 0) {
            let oldestDate: Date | null = null;
            allTransactions.forEach(transaction => {
              const invoiceDateStr = transaction["Data da Fatura"];
              if (invoiceDateStr && typeof invoiceDateStr === "string") {
                try {
                  const parsedDate = parse(
                    invoiceDateStr,
                    "yyyy-MM-dd",
                    new Date()
                  );
                  if (!oldestDate || parsedDate < oldestDate) {
                    oldestDate = parsedDate;
                  }
                } catch (e) {
                  console.error(
                    "Error parsing date for oldestInvoiceDate:",
                    invoiceDateStr,
                    e
                  );
                }
              }
            });
            set({ oldestInvoiceDate: oldestDate });
            // REMOVED: Initial period setting moved to ensureInitialPeriodIsSet
            // if (!get().selectedPeriod.startDate && oldestDate) {
            //   set({
            //     selectedPeriod: {
            //       startDate: startOfMonth(oldestDate),
            //       endDate: endOfMonth(oldestDate),
            //     },
            //   });
            // }
          }
        },
        setIsLoading: loading => set({ isLoading: loading }),
        setError: error => set({ error: error }),
        setFormattedFileName: name => set({ formattedFileName: name }),
        setSelectedPeriod: periodUpdate =>
          set(state => ({
            selectedPeriod: { ...state.selectedPeriod, ...periodUpdate },
          })),
        setOldestInvoiceDate: date => set({ oldestInvoiceDate: date }),
        fetchAndSetInitialData: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch("/api/dummy-data");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const dummyData: Transaction[] = await response.json();

            if (dummyData && dummyData.length > 0) {
              const processedForStore: ProcessedCsvData = {
                message: "Dummy data loaded successfully",
                fileName: "dummy-data.json",
                rowCount: dummyData.length,
                headers: Object.keys(dummyData[0]),
                data: dummyData,
              };
              get().setProcessedData(processedForStore, dummyData); // Pass dummyData to calculate oldest
            } else {
              get().setProcessedData(null);
              set({ error: "No data found in dummy-data.json" });
            }
          } catch (err) {
            console.error("Failed to fetch or process dummy data:", err);
            set({
              error: (err as Error).message || "Failed to load initial data",
            });
            get().setProcessedData(null);
          }
          set({ isLoading: false });
        },
        ensureInitialPeriodIsSet: () => {
          const { selectedPeriod, oldestInvoiceDate } = get();
          if (!selectedPeriod.startDate && oldestInvoiceDate) {
            set({
              selectedPeriod: {
                startDate: startOfMonth(oldestInvoiceDate),
                endDate: endOfMonth(oldestInvoiceDate),
              },
            });
          }
        },
        resetState: () => set(initialState as CsvState), // Cast to CsvState
      }),
      {
        name: "csv-storage", // name of the item in the storage (must be unique)
        // getStorage: () => sessionStorage, // (optionally) define storage solution - removed for now to simplify
      }
    )
  )
);
