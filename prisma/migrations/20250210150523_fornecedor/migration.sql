-- CreateTable
CREATE TABLE `Fornecedores` (
    `cod_fornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `tipo_peca` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `responsavel` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Fornecedores_email_key`(`email`),
    PRIMARY KEY (`cod_fornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
