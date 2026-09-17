-- CreateEnum
CREATE TYPE "accion_auditoria" AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" VARCHAR(255),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido_paterno" VARCHAR(100) NOT NULL,
    "apellido_materno" VARCHAR(100),
    "usuario" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "id_rol" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" TIMESTAMP(6),
    "correo" VARCHAR(150),
    "fecha_actualizacion" TIMESTAMP(6),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "productos" (
    "id_producto" SERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "stock_actual" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stock_minimo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id_lote" SERIAL NOT NULL,
    "numero_lote" VARCHAR(100) NOT NULL,
    "fecha_caducidad" DATE NOT NULL,
    "cantidad_disponible" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fecha_registro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "id_producto" INTEGER NOT NULL,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id_lote")
);

-- CreateTable
CREATE TABLE "motivos" (
    "id_motivo" SERIAL NOT NULL,
    "tipo" VARCHAR(50),
    "nombre" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "motivos_pkey" PRIMARY KEY ("id_motivo")
);

-- CreateTable
CREATE TABLE "entradas" (
    "id_entrada" SERIAL NOT NULL,
    "fecha_entrada" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "observaciones" TEXT,
    "id_motivo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_lote" INTEGER NOT NULL,

    CONSTRAINT "entradas_pkey" PRIMARY KEY ("id_entrada")
);

-- CreateTable
CREATE TABLE "salidas" (
    "id_salida" SERIAL NOT NULL,
    "fecha_salida" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "observaciones" TEXT,
    "id_lote" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_motivo" INTEGER NOT NULL,

    CONSTRAINT "salidas_pkey" PRIMARY KEY ("id_salida")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id_auditoria" SERIAL NOT NULL,
    "tabla" VARCHAR(100) NOT NULL,
    "accion" VARCHAR(20) NOT NULL,
    "id_registro" INTEGER,
    "descripcion" TEXT,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip" VARCHAR(45),
    "fecha" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "modulo" VARCHAR(100) NOT NULL DEFAULT 'General',

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id_permiso" SERIAL NOT NULL,
    "modulo" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "roles_permisos" (
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "roles_permisos_pkey" PRIMARY KEY ("id_rol","id_permiso")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_roles_nombre" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_key" ON "productos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "motivos_nombre_key" ON "motivos"("nombre");

-- CreateIndex
CREATE INDEX "idx_auditoria_accion" ON "auditoria"("accion");

-- CreateIndex
CREATE INDEX "idx_auditoria_fecha" ON "auditoria"("fecha");

-- CreateIndex
CREATE INDEX "idx_auditoria_tabla" ON "auditoria"("tabla");

-- CreateIndex
CREATE INDEX "idx_auditoria_usuario" ON "auditoria"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lotes"("id_lote") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "motivos"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salidas" ADD CONSTRAINT "salidas_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lotes"("id_lote") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salidas" ADD CONSTRAINT "salidas_id_motivo_fkey" FOREIGN KEY ("id_motivo") REFERENCES "motivos"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "salidas" ADD CONSTRAINT "salidas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "fk_auditoria_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles_permisos" ADD CONSTRAINT "roles_permisos_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permisos"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;
