-- DropForeignKey
ALTER TABLE `Article` DROP FOREIGN KEY `Article_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Article` DROP FOREIGN KEY `Article_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_typeId_fkey`;

-- DropIndex
DROP INDEX `Article_categoryId_fkey` ON `Article`;

-- DropIndex
DROP INDEX `Article_typeId_fkey` ON `Article`;

-- DropIndex
DROP INDEX `Category_typeId_fkey` ON `Category`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ArticleType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ArticleType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
