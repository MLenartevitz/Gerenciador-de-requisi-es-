/*
  Warnings:

  - You are about to drop the column `cod_produto` on the `item_requisicao` table. All the data in the column will be lost.
  - You are about to drop the column `nome_produto` on the `item_requisicao` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_categoria_da_requisicao` on the `item_requisicao` table. All the data in the column will be lost.
  - Added the required column `descrição` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observação` to the `Item_requisicao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item_requisicao` DROP FOREIGN KEY `Item_requisicao_cod_produto_fkey`;

-- DropIndex
DROP INDEX `Item_requisicao_cod_produto_fkey` ON `item_requisicao`;

-- AlterTable
ALTER TABLE `item_requisicao` DROP COLUMN `cod_produto`,
    DROP COLUMN `nome_produto`,
    DROP COLUMN `tipo_categoria_da_requisicao`,
    ADD COLUMN `descrição` VARCHAR(191) NOT NULL,
    ADD COLUMN `observação` VARCHAR(191) NOT NULL;
