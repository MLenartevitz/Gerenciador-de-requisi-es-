/*
  Warnings:

  - You are about to drop the column `luvas` on the `epi_descartaveis` table. All the data in the column will be lost.
  - You are about to drop the column `mascara` on the `epi_descartaveis` table. All the data in the column will be lost.
  - You are about to drop the column `oculos` on the `epi_descartaveis` table. All the data in the column will be lost.
  - You are about to drop the column `protetor` on the `epi_descartaveis` table. All the data in the column will be lost.
  - Added the required column `quantidadeLuvas` to the `Epi_descartaveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeMascara` to the `Epi_descartaveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeOculos` to the `Epi_descartaveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeProtetor` to the `Epi_descartaveis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `epi_descartaveis` DROP COLUMN `luvas`,
    DROP COLUMN `mascara`,
    DROP COLUMN `oculos`,
    DROP COLUMN `protetor`,
    ADD COLUMN `quantidadeLuvas` INTEGER NOT NULL,
    ADD COLUMN `quantidadeMascara` INTEGER NOT NULL,
    ADD COLUMN `quantidadeOculos` INTEGER NOT NULL,
    ADD COLUMN `quantidadeProtetor` INTEGER NOT NULL;
