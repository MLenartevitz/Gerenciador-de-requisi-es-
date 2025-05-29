-- AlterTable
ALTER TABLE `cotacoes` ADD COLUMN `aprovadoPor` VARCHAR(191) NULL,
    ADD COLUMN `dataAprovacao` DATETIME(3) NULL,
    ADD COLUMN `dataRecusa` DATETIME(3) NULL,
    ADD COLUMN `recusadoPor` VARCHAR(191) NULL;
