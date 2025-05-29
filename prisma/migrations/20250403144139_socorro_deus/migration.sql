/*
  Warnings:

  - Added the required column `cod_empresa` to the `Requisicoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requisicoes` ADD COLUMN `cod_empresa` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Requisicoes` ADD CONSTRAINT `Requisicoes_cod_empresa_fkey` FOREIGN KEY (`cod_empresa`) REFERENCES `Empresas`(`cod_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;
