-- CreateTable
CREATE TABLE `Epi_descartaveis` (
    `cod_epid` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_user` INTEGER NOT NULL,
    `data_retirada` DATETIME(3) NOT NULL,
    `oculos` INTEGER NOT NULL,
    `protetor` INTEGER NOT NULL,
    `luvas` INTEGER NOT NULL,
    `mascara` INTEGER NOT NULL,

    PRIMARY KEY (`cod_epid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Epi_descartaveis` ADD CONSTRAINT `Epi_descartaveis_cod_user_fkey` FOREIGN KEY (`cod_user`) REFERENCES `Usuario`(`cod_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
