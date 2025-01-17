/*
  Warnings:

  - Added the required column `iconClass` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconColor` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `iconClass` VARCHAR(191) NOT NULL,
    ADD COLUMN `iconColor` VARCHAR(191) NOT NULL;
