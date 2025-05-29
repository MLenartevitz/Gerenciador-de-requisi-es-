/*
  Warnings:

  - Added the required column `unidade_medida` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade_medida` to the `Produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_requisicao` ADD COLUMN `unidade_medida` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `unidade_medida` VARCHAR(191) NOT NULL;
