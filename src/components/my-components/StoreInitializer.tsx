"use client";

import { useEffect, useRef } from "react";
import { useCsvStore } from "@/store/csvStore";

export function StoreInitializer() {
  const initializedFetch = useRef(false); // Tracks if the initial fetch has been attempted
  const { fetchAndSetInitialData, processedData, ensureInitialPeriodIsSet } =
    useCsvStore();

  useEffect(() => {
    // Attempt to fetch initial data only if not already fetched and no processedData exists
    if (!initializedFetch.current && !processedData) {
      fetchAndSetInitialData();
      initializedFetch.current = true;
    }
  }, [fetchAndSetInitialData, processedData]);

  useEffect(() => {
    // This effect runs whenever processedData changes or on initial load if processedData is already available (e.g. from persist)
    // It ensures that the initial period is set correctly based on the available data.
    if (processedData) {
      ensureInitialPeriodIsSet();
    }
  }, [processedData, ensureInitialPeriodIsSet]);

  return null; // This component doesn't render anything
}
