/*
  Warnings:

  - Added the required column `storeAdmin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superAdmin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "storeAdmin" BOOLEAN NOT NULL,
ADD COLUMN     "superAdmin" BOOLEAN NOT NULL;
