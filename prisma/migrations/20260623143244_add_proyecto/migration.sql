-- CreateEnum
CREATE TYPE "TipoProyecto" AS ENUM ('OPERA_PRIMA', 'COMUNIDAD', 'ENTIDAD');

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" TEXT NOT NULL,
    "tipo" "TipoProyecto" NOT NULL DEFAULT 'COMUNIDAD',
    "nombre" TEXT NOT NULL,
    "representante" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "queBuscan" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "proceso" TEXT NOT NULL,
    "imagen" TEXT,
    "contacto" TEXT NOT NULL,
    "disciplinas" TEXT[],
    "ubicacion" TEXT NOT NULL,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
