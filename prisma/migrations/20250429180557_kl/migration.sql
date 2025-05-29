/*
  Warnings:

  - Added the required column `projetoId` to the `Cotacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cotacoes` ADD COLUMN `projetoId` INTEGER NOT NULL,
    ALTER COLUMN `status` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Cotacoes` ADD CONSTRAINT `Cotacoes_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`cod_proj`) ON DELETE RESTRICT ON UPDATE CASCADE;
