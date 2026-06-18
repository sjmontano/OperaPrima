/*
  Warnings:

  - Added the required column `categoria` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "agotado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "categoria" TEXT NOT NULL,
ADD COLUMN     "comentarios" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "precio" TEXT NOT NULL,
ADD COLUMN     "ubicacion" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vistas" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_usuarioId_eventoId_key" ON "Inscripcion"("usuarioId", "eventoId");

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
