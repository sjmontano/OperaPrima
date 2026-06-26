/*
  Warnings:

  - You are about to drop the column `disciplinas` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the `Proyecto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Proyecto" DROP CONSTRAINT "Proyecto_usuarioId_fkey";

-- DropIndex
DROP INDEX "Entrada_usuarioId_eventoId_key";

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "disciplinas",
DROP COLUMN "link",
DROP COLUMN "tipo";

-- DropTable
DROP TABLE "Proyecto";

-- DropEnum
DROP TYPE "TipoProyecto";
