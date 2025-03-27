/*
  Warnings:

  - A unique constraint covering the columns `[CNPJ_empresa]` on the table `Empresas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Empresas_CNPJ_empresa_key` ON `Empresas`(`CNPJ_empresa`);
