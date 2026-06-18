/*
  Warnings:

  - Made the column `countryCode` on table `Usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Perfil" ADD COLUMN     "banner" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "countryCode" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
