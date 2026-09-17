/*
  Warnings:

  - A unique constraint covering the columns `[id_producto,numero_lote]` on the table `lotes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uq_producto_lote" ON "lotes"("id_producto", "numero_lote");
