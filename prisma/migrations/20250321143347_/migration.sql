/*
  Warnings:

  - You are about to drop the column `descrição` on the `item_requisicao` table. All the data in the column will be lost.
  - You are about to drop the column `observação` on the `item_requisicao` table. All the data in the column will be lost.
  - Added the required column `descricao` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacao` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_requisicao` DROP COLUMN `descrição`,
    DROP COLUMN `observação`,
    ADD COLUMN `descricao` VARCHAR(191) NOT NULL,
    ADD COLUMN `observacao` VARCHAR(191) NOT NULL;
