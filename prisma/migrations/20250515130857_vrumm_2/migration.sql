/*
  Warnings:

  - Added the required column `observacao` to the `Controle_saida_retorno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `controle_saida_retorno` ADD COLUMN `observacao` VARCHAR(191) NOT NULL;
