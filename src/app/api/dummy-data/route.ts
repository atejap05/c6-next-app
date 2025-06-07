import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface TransactionData {
  "Data de Compra": string; // "DD/MM/YYYY"
  "Data da Fatura": string; // "YYYY-MM-DD"
  "Nome no Cartão": string;
  "Final do Cartão": string;
  Categoria: string;
  Descrição: string;
  Parcela: string;
  "Valor (em US$)": number;
  "Cotação (em R$)": number;
  "Valor (em R$)": number;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "dummy-data", "data.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data: TransactionData[] = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read dummy data:", error);
    // Ensure a valid Response object is returned in case of an error
    return NextResponse.json(
      { message: "Error fetching dummy data", error: (error as Error).message },
      { status: 500 }
    );
  }
}
