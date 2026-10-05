
import { prisma } from "../config/prisma";

interface CrearEntradaData {
    cantidad: number;
    observaciones?: string | null;
    motivoId: number;
    usuarioId: number;
    loteId: number;
    fechaEntrada?: Date;
}

export class EntradaRepository {
    async crear(data: CrearEntradaData) {
        return prisma.$transaction(async (tx) => {

            // 1. Buscar el lote y verificar que esté activo
            const lote = await tx.lote.findUnique({
                where: {
                    id: data.loteId,
                },
                include: {
                    producto: true,
                },
            });

            if (!lote) {
                throw new Error("El lote seleccionado no existe");
            }

            if (!lote.activo) {
                throw new Error("El lote seleccionado está inactivo");
            }

            if (!lote.producto.activo) {
                throw new Error("El producto asociado al lote está inactivo");
            }

            // 2. Verificar que el motivo exista y esté activo
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

            if (motivo.tipo !== "ENTRADA") {
                throw new Error("El motivo seleccionado no corresponde a una entrada");
            }

            // 3. Registrar la entrada
            const entrada = await tx.entrada.create({
                data: {
                    cantidad: data.cantidad,
                    observaciones: data.observaciones ?? null,
                    motivoId: data.motivoId,
                    usuarioId: data.usuarioId,
                    loteId: data.loteId,
                    ...(data.fechaEntrada && {
                        fechaEntrada: data.fechaEntrada,
                    }),
                },
            });

            // 4. Incrementar las existencias del lote
            await tx.lote.update({
                where: {
                    id: data.loteId,
                },
                data: {
                    cantidadDisponible: {
                        increment: data.cantidad,
                    },
                },
            });

            // 5. Incrementar las existencias generales del producto
            await tx.producto.update({
                where: {
                    id: lote.productoId,
                },
                data: {
                    stockActual: {
                        increment: data.cantidad,
                    },
                },
            });

            // 6. Consultar nuevamente la entrada con las existencias actualizadas
            const entradaActualizada = await tx.entrada.findUnique({
                where: {
                    id: entrada.id,
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

            if (!entradaActualizada) {
                throw new Error("No se pudo recuperar la entrada registrada");
            }

            return entradaActualizada;
        });
    }
}