import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (file.type !== "text/csv") {
      return NextResponse.json(
        { error: "Formato de arquivo inválido. Apenas CSV é permitido." },
        { status: 400 }
      );
    }

    const fileContent = await file.text();

    // Usar PapaParse para processar o CSV
    const parsedData = Papa.parse(fileContent, {
      header: true, // Considera a primeira linha como cabeçalho
      skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
      console.error("Erros ao processar CSV:", parsedData.errors);
      return NextResponse.json(
        {
          error: "Erro ao processar o arquivo CSV.",
          details: parsedData.errors,
        },
        { status: 500 }
      );
    }

    // Aqui você pode adicionar a lógica para manipular os dados processados (parsedData.data)
    // Por exemplo, salvar em um banco de dados, realizar cálculos, etc.

    return NextResponse.json(
      {
        message: "Arquivo CSV processado com sucesso!",
        fileName: file.name,
        rowCount: parsedData.data.length,
        headers: parsedData.meta.fields,
        data: parsedData.data, // Retornar os dados processados (ou uma amostra)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no servidor:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return NextResponse.json(
      { error: "Erro interno do servidor.", details: errorMessage },
      { status: 500 }
    );
  }
}
