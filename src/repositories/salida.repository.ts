import { prisma } from "../config/prisma";

interface CrearSalidaData {
    cantidad: number;
    observaciones?: string | null;
    motivoId: number;
    usuarioId: number;
    productoId?: number;
    loteId?: number;
    fechaSalida?: Date;
}

export class SalidaRepository {

    async crear(data: CrearSalidaData) {
        return prisma.$transaction(async (tx) => {

            // 1. Verificar el motivo
            const motivo = await tx.motivo.findUnique({
                where: {
                    id: data.motivoId,
                },
            });

            if (!motivo) {
                throw new Error("El motivo seleccionado no existe");
            }

            if (!motivo.activo) {
                throw new Error("El motivo seleccionado está inactivo");
            }

            if (motivo.tipo !== "SALIDA") {
                throw new Error(
                    "El motivo seleccionado no corresponde a una salida"
                );
            }

            // 2. Buscar el lote
            let lote;

            if (data.loteId !== undefined) {

                // =====================================================
                // SELECCIÓN MANUAL DEL LOTE
                // =====================================================

                lote = await tx.lote.findUnique({
                    where: {
                        id: data.loteId,
                    },
                    include: {
                        producto: true,
                    },
                });

                if (!lote) {
                    throw new Error(
                        "El lote seleccionado no existe"
                    );
                }

                // Si se proporcionaron ambos valores,
                // verificar que el lote pertenezca al producto.
                if (
                    data.productoId !== undefined &&
                    lote.productoId !== data.productoId
                ) {
                    throw new Error(
                        "El lote seleccionado no pertenece al producto indicado"
                    );
                }

            } else {

                // =====================================================
                // SELECCIÓN AUTOMÁTICA FEFO
                // =====================================================

                if (data.productoId === undefined) {
                    throw new Error(
                        "Debe indicar el producto cuando no se selecciona un lote manualmente"
                    );
                }

                // Verificar que el producto exista
                const producto = await tx.producto.findUnique({
                    where: {
                        id: data.productoId,
                    },
                });

                if (!producto) {
                    throw new Error(
                        "El producto seleccionado no existe"
                    );
                }

                if (!producto.activo) {
                    throw new Error(
                        "El producto seleccionado está inactivo"
                    );
                }

                // Buscar el lote con la fecha de caducidad
                // más próxima dentro de ESTE producto.
                lote = await tx.lote.findFirst({
                    where: {
                        productoId: data.productoId,
                        activo: true,
                        cantidadDisponible: {
                            gt: 0,
                        },
                    },
                    include: {
                        producto: true,
                    },
                    orderBy: {
                        fechaCaducidad: "asc",
                    },
                });

                if (!lote) {
                    throw new Error(
                        "No existen lotes disponibles para realizar la salida"
                    );
                }
            }

            // =====================================================
            // VALIDACIONES DEL LOTE Y PRODUCTO
            // =====================================================

            if (!lote.activo) {
                throw new Error(
                    "El lote seleccionado está inactivo"
                );
            }

            if (!lote.producto.activo) {
                throw new Error(
                    "El producto asociado al lote está inactivo"
                );
            }

            // =====================================================
            // VALIDAR EXISTENCIA DEL LOTE
            // =====================================================

            if (Number(lote.cantidadDisponible) < data.cantidad) {
                throw new Error(
                    `Existencia insuficiente en el lote. Disponible: ${lote.cantidadDisponible}`
                );
            }

            // =====================================================
            // VALIDAR EXISTENCIA DEL PRODUCTO
            // =====================================================

            if (Number(lote.producto.stockActual) < data.cantidad) {
                throw new Error(
                    `Existencia insuficiente del producto. Disponible: ${lote.producto.stockActual}`
                );
            }

            // =====================================================
            // CREAR SALIDA
            // =====================================================

            const salida = await tx.salida.create({
                data: {
                    cantidad: data.cantidad,
                    observaciones: data.observaciones ?? null,
                    motivoId: data.motivoId,
                    usuarioId: data.usuarioId,
                    loteId: lote.id,
                    ...(data.fechaSalida && {
                        fechaSalida: data.fechaSalida,
                    }),
                },
            });

            // =====================================================
            // DESCONTAR EXISTENCIA DEL LOTE
            // =====================================================

            await tx.lote.update({
                where: {
                    id: lote.id,
                },
                data: {
                    cantidadDisponible: {
                        decrement: data.cantidad,
                    },
                },
            });

            // =====================================================
            // DESCONTAR EXISTENCIA DEL PRODUCTO
            // =====================================================

            await tx.producto.update({
                where: {
                    id: lote.productoId,
                },
                data: {
                    stockActual: {
                        decrement: data.cantidad,
                    },
                },
            });

            // =====================================================
            // RECUPERAR SALIDA ACTUALIZADA
            // =====================================================

            const salidaActualizada = await tx.salida.findUnique({
                where: {
                    id: salida.id,
                },
                include: {
                    lote: {
                        include: {
                            producto: true,
                        },
                    },
                    motivo: true,
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            usuario: true,
                        },
                    },
                },
            });

            if (!salidaActualizada) {
                throw new Error(
                    "No se pudo recuperar la salida registrada"
                );
            }

            return salidaActualizada;
        });
    }
}