/*
  Warnings:

  - You are about to alter the column `localCotacao` on the `cotacoes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `cotacoes` MODIFY `localCotacao` INTEGER NOT NULL;
