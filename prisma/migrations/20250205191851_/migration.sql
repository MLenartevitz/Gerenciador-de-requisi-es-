/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ_cliente]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Cliente_nome_cliente_key` ON `cliente`;

-- CreateIndex
CREATE UNIQUE INDEX `Cliente_CNPJ_cliente_key` ON `Cliente`(`CNPJ_cliente`);
