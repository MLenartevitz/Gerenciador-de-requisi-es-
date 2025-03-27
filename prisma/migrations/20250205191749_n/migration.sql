/*
  Warnings:

  - A unique constraint covering the columns `[nome_cliente]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cliente_nome_cliente_key` ON `Cliente`(`nome_cliente`);
