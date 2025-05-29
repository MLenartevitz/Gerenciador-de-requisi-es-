-- CreateTable
CREATE TABLE `Cotacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeFornecedor` VARCHAR(191) NOT NULL,
    `localCotacao` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pendente',
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
