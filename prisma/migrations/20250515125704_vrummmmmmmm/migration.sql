-- CreateTable
CREATE TABLE `Controle_saida_retorno` (
    `cod_evento` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_evento` BOOLEAN NOT NULL,
    `data_controle` DATETIME(3) NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `cod_user` INTEGER NOT NULL,
    `km` INTEGER NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cod_evento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Controle_saida_retorno` ADD CONSTRAINT `Controle_saida_retorno_cod_user_fkey` FOREIGN KEY (`cod_user`) REFERENCES `Usuario`(`cod_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controle_saida_retorno` ADD CONSTRAINT `Controle_saida_retorno_placa_fkey` FOREIGN KEY (`placa`) REFERENCES `Carro`(`placa`) ON DELETE RESTRICT ON UPDATE CASCADE;
