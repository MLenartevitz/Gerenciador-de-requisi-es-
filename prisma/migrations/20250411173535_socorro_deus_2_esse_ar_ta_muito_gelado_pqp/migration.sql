/*
  Warnings:

  - Added the required column `ordem_item` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_requisicao` ADD COLUMN `ordem_item` INTEGER NOT NULL;
