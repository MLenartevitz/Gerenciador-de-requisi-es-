-- DropForeignKey
ALTER TABLE `cotacoes` DROP FOREIGN KEY `Cotacoes_projetoId_fkey`;

-- DropForeignKey
ALTER TABLE `cotacoes` DROP FOREIGN KEY `Cotacoes_requisicaoId_fkey`;

-- DropIndex
DROP INDEX `Cotacoes_projetoId_fkey` ON `cotacoes`;

-- DropIndex
DROP INDEX `Cotacoes_requisicaoId_fkey` ON `cotacoes`;

-- AlterTable
ALTER TABLE `cotacoes` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pendente',
    MODIFY `projetoId` INTEGER NULL,
    MODIFY `motivorec` VARCHAR(191) NULL,
    MODIFY `requisicaoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Cotacoes` ADD CONSTRAINT `Cotacoes_projetoId_fkey` FOREIGN KEY (`projetoId`) REFERENCES `Projeto`(`cod_proj`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cotacoes` ADD CONSTRAINT `Cotacoes_requisicaoId_fkey` FOREIGN KEY (`requisicaoId`) REFERENCES `Requisicoes`(`num_requisicao`) ON DELETE SET NULL ON UPDATE CASCADE;
