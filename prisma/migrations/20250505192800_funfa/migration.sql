-- AlterTable
ALTER TABLE `cotacoes` ADD COLUMN `requisicaoId` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Cotacoes` ADD CONSTRAINT `Cotacoes_requisicaoId_fkey` FOREIGN KEY (`requisicaoId`) REFERENCES `Requisicoes`(`num_requisicao`) ON DELETE RESTRICT ON UPDATE CASCADE;
