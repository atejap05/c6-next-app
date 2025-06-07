-- CreateTable
CREATE TABLE "Fatura" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "categoriaOriginal" TEXT,
    "parcelaAtual" INTEGER,
    "totalParcelas" INTEGER,
    "valorUSD" DECIMAL(65,30),
    "cotacaoBRL" DECIMAL(65,30),
    "faturaId" TEXT NOT NULL,
    "cartaoId" TEXT NOT NULL,
    "categoriaId" TEXT,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cartao" (
    "id" TEXT NOT NULL,
    "finalCartao" TEXT NOT NULL,
    "nomeTitular" TEXT NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegraCategorizacao" (
    "id" TEXT NOT NULL,
    "palavraChave" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "RegraCategorizacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transacao_faturaId_idx" ON "Transacao"("faturaId");

-- CreateIndex
CREATE INDEX "Transacao_cartaoId_idx" ON "Transacao"("cartaoId");

-- CreateIndex
CREATE INDEX "Transacao_categoriaId_idx" ON "Transacao"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cartao_finalCartao_key" ON "Cartao"("finalCartao");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE INDEX "RegraCategorizacao_categoriaId_idx" ON "RegraCategorizacao"("categoriaId");

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegraCategorizacao" ADD CONSTRAINT "RegraCategorizacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
