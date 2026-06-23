/*
  Warnings:

  - You are about to drop the `Inscripcion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cuposDisponibles` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuposTotales` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `precio` on the `Evento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'EXPIRADO', 'REEMBOLSADO');

-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "cuposDisponibles" INTEGER NOT NULL,
ADD COLUMN     "cuposTotales" INTEGER NOT NULL,
DROP COLUMN "precio",
ADD COLUMN     "precio" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Inscripcion";

-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "entradaId" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "transaccionWompiId" TEXT,
    "monto" INTEGER NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_usuarioId_eventoId_key" ON "Entrada"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_entradaId_key" ON "Pago"("entradaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_referencia_key" ON "Pago"("referencia");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_transaccionWompiId_key" ON "Pago"("transaccionWompiId");

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "Entrada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
