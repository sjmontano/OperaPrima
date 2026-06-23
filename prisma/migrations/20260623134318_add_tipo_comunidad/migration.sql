-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('OPEAR_PRIMA', 'COMUNIDAD');

-- AlterTable
ALTER TABLE "Evento" ADD COLUMN     "disciplinas" TEXT[],
ADD COLUMN     "link" TEXT,
ADD COLUMN     "tipo" "TipoEvento" NOT NULL DEFAULT 'OPEAR_PRIMA';
