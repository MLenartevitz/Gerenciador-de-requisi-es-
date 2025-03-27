-- CreateTable
CREATE TABLE `Empresas` (
    `cod_empresa` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_empresa` VARCHAR(191) NOT NULL,
    `CNPJ_empresa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cod_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `cod_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_cliente` VARCHAR(191) NOT NULL,
    `CNPJ_cliente` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cod_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Projeto` (
    `cod_proj` INTEGER NOT NULL AUTO_INCREMENT,
    `num_proposta` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `cod_empresa` INTEGER NOT NULL,
    `cod_cliente` INTEGER NOT NULL,
    `data_entrega` DATETIME(3) NOT NULL,
    `num_pedido` INTEGER NOT NULL,
    `num_itempedido` INTEGER NOT NULL,
    `data_pedido` DATETIME(3) NOT NULL,
    `resp_pedido` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cod_proj`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `cod_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_user` VARCHAR(191) NOT NULL,
    `funcao` VARCHAR(191) NOT NULL,
    `data_inicio` DATETIME(3) NOT NULL,
    `data_inativo` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL,

    PRIMARY KEY (`cod_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produtos` (
    `cod_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_omie` INTEGER NOT NULL,
    `nome_produto` VARCHAR(191) NOT NULL,
    `qtde` INTEGER NOT NULL,

    PRIMARY KEY (`cod_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Requisicoes` (
    `num_requisicao` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_proj` INTEGER NOT NULL,
    `data_requisicao` DATETIME(3) NOT NULL,
    `cod_user` INTEGER NOT NULL,
    `rev_req` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`num_requisicao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item_requisicao` (
    `num_item_req` INTEGER NOT NULL AUTO_INCREMENT,
    `num_requisicao` INTEGER NOT NULL,
    `cod_produto` INTEGER NOT NULL,
    `nome_produto` VARCHAR(191) NOT NULL,
    `qtde` INTEGER NOT NULL,
    `tipo_categoria_da_requisicao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`num_item_req`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_cod_empresa_fkey` FOREIGN KEY (`cod_empresa`) REFERENCES `Empresas`(`cod_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Projeto` ADD CONSTRAINT `Projeto_cod_cliente_fkey` FOREIGN KEY (`cod_cliente`) REFERENCES `Cliente`(`cod_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Requisicoes` ADD CONSTRAINT `Requisicoes_cod_proj_fkey` FOREIGN KEY (`cod_proj`) REFERENCES `Projeto`(`cod_proj`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Requisicoes` ADD CONSTRAINT `Requisicoes_cod_user_fkey` FOREIGN KEY (`cod_user`) REFERENCES `Usuario`(`cod_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_requisicao` ADD CONSTRAINT `Item_requisicao_num_requisicao_fkey` FOREIGN KEY (`num_requisicao`) REFERENCES `Requisicoes`(`num_requisicao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item_requisicao` ADD CONSTRAINT `Item_requisicao_cod_produto_fkey` FOREIGN KEY (`cod_produto`) REFERENCES `Produtos`(`cod_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;
