import { prisma } from "../config/prisma";

export class LoteRepository {

    async listar(
        where: any,
        skip: number,
        take: number,
        orderBy: any
    ) {
        const [lotes, total] = await Promise.all([
            prisma.lote.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            nombre: true
                        }
                    }
                }
            }),

            prisma.lote.count({
                where
            })
        ]);

        return {
            lotes,
            total
        };
    }

    async buscarPorId(id: number) {
        return await prisma.lote.findUnique({
            where: { id },
            include: {
                producto: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true
                    }
                }
            }
        });
    }

    async buscarPorProductoYLote(
        productoId: number,
        numeroLote: string
    ) {
        return await prisma.lote.findUnique({
            where: {
                productoId_numeroLote: {
                    productoId,
                    numeroLote
                }
            }
        });
    }

    async crear(data: {
        numeroLote: string;
        fechaCaducidad: Date;
        cantidadDisponible?: number;
        productoId: number;
    }) {
        return await prisma.lote.create({
            data: {
                numeroLote: data.numeroLote,
                fechaCaducidad: data.fechaCaducidad,
                cantidadDisponible: data.cantidadDisponible ?? 0,
                productoId: data.productoId
            }
        });
    }

    async actualizar(
        id: number,
        data: {
            numeroLote?: string;
            fechaCaducidad?: Date;
            activo?: boolean;
        }
    ) {
        return await prisma.lote.update({
            where: { id },
            data
        });
    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {
        return await prisma.lote.update({
            where: { id },
            data: { activo }
        });
    }
}