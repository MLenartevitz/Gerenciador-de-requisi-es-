/*
  Warnings:

  - Added the required column `status` to the `Projeto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projeto` ADD COLUMN `status` BOOLEAN NOT NULL;
