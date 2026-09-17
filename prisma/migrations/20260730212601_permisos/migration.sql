-- AlterTable
ALTER TABLE "auditoria" ADD COLUMN     "endpoint" VARCHAR(255);

-- CreateIndex
CREATE INDEX "permisos_codigo_idx" ON "permisos"("codigo");
