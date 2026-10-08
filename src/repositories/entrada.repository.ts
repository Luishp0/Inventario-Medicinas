import { Prisma } from "@prisma/client";
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

    // =========================================================
    // CREAR ENTRADA
    // =========================================================
    async crear(data: CrearEntradaData) {

        return await prisma.$transaction(async (tx) => {

            // -------------------------------------------------
            // Verificar lote
            // -------------------------------------------------
            const lote = await tx.lote.findUnique({
                where: {
                    id: data.loteId,
                },
                include: {
                    producto: true,
                },
            });

            if (!lote) {
                throw new Error("El lote no existe.");
            }

            if (!lote.activo) {
                throw new Error("El lote está inactivo.");
            }

            if (!lote.producto.activo) {
                throw new Error("El producto asociado al lote está inactivo.");
            }

            // -------------------------------------------------
            // Verificar motivo
            // -------------------------------------------------
            const motivo = await tx.motivo.findUnique({
                where: {
                    id: data.motivoId,
                },
            });

            if (!motivo) {
                throw new Error("El motivo no existe.");
            }

            if (!motivo.activo) {
                throw new Error("El motivo está inactivo.");
            }

            if (motivo.tipo !== "ENTRADA") {
                throw new Error(
                    "El motivo seleccionado no corresponde a una entrada."
                );
            }

            // -------------------------------------------------
            // Crear entrada
            // -------------------------------------------------
            const entrada = await tx.entrada.create({
                data: {
                    cantidad: new Prisma.Decimal(data.cantidad),
                    observaciones: data.observaciones ?? null,
                    motivoId: data.motivoId,
                    usuarioId: data.usuarioId,
                    loteId: data.loteId,
                    fechaEntrada: data.fechaEntrada ?? new Date(),
                },
            });

            // -------------------------------------------------
            // Actualizar existencia del lote
            // -------------------------------------------------
            await tx.lote.update({
                where: {
                    id: data.loteId,
                },
                data: {
                    cantidadDisponible: {
                        increment: new Prisma.Decimal(data.cantidad),
                    },
                },
            });

            // -------------------------------------------------
            // Actualizar stock del producto
            // -------------------------------------------------
            await tx.producto.update({
                where: {
                    id: lote.productoId,
                },
                data: {
                    stockActual: {
                        increment: new Prisma.Decimal(data.cantidad),
                    },
                },
            });

            // -------------------------------------------------
            // Obtener entrada actualizada con relaciones
            // -------------------------------------------------
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
                throw new Error(
                    "No se pudo recuperar la entrada después de crearla."
                );
            }

            return entradaActualizada;
        });
    }

    // =========================================================
    // LISTAR ENTRADAS
    // =========================================================
    async listar(params: {
        page: number;
        limit: number;
        motivoId?: number;
        loteId?: number;
        usuarioId?: number;
        fechaDesde?: Date;
        fechaHasta?: Date;
        buscar?: string;
    }) {

        const {
            page,
            limit,
            motivoId,
            loteId,
            usuarioId,
            fechaDesde,
            fechaHasta,
            buscar,
        } = params;

        // -------------------------------------------------
        // Paginación
        // -------------------------------------------------
        const skip = (page - 1) * limit;

        // -------------------------------------------------
        // Construcción dinámica de filtros
        // -------------------------------------------------
        const where: any = {};

        // Filtrar por motivo
        if (motivoId !== undefined) {
            where.motivoId = motivoId;
        }

        // Filtrar por lote
        if (loteId !== undefined) {
            where.loteId = loteId;
        }

        // Filtrar por usuario
        if (usuarioId !== undefined) {
            where.usuarioId = usuarioId;
        }

        // Filtrar por rango de fechas
        if (fechaDesde || fechaHasta) {

            where.fechaEntrada = {};

            if (fechaDesde) {
                where.fechaEntrada.gte = fechaDesde;
            }

            if (fechaHasta) {
                where.fechaEntrada.lte = fechaHasta;
            }
        }

        // -------------------------------------------------
        // Búsqueda
        // Lote
        // Nombre del producto
        // Código del producto
        // -------------------------------------------------
        if (buscar && buscar.trim() !== "") {

            const texto = buscar.trim();

            where.OR = [
                {
                    lote: {
                        numeroLote: {
                            contains: texto,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    lote: {
                        producto: {
                            nombre: {
                                contains: texto,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    lote: {
                        producto: {
                            codigo: {
                                contains: texto,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ];
        }

        // -------------------------------------------------
        // Obtener datos y total
        // -------------------------------------------------
        const [entradas, total] = await prisma.$transaction([
            prisma.entrada.findMany({
                where,
                skip,
                take: limit,

                orderBy: {
                    fechaEntrada: "desc",
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
            }),

            prisma.entrada.count({
                where,
            }),
        ]);

        // -------------------------------------------------
        // Calcular total de páginas
        // -------------------------------------------------
        const totalPaginas = Math.ceil(total / limit);

        // -------------------------------------------------
        // Respuesta
        // -------------------------------------------------
        return {
            datos: entradas,

            paginacion: {
                pagina: page,
                limite: limit,
                total,
                totalPaginas,
            },
        };
    }
}