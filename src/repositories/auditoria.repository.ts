import { prisma } from "../config/prisma";

export class AuditoriaRepository {

    // Registrar una acción
    async crear(data: any) {

        return prisma.auditoria.create({
            data: {
                modulo: data.modulo,
                tabla: data.tabla,
                accion: data.accion,
                idRegistro: data.idRegistro,
                descripcion: data.descripcion,
                datosAnteriores: data.datosAnteriores,
                datosNuevos: data.datosNuevos,
                usuarioId: data.usuarioId,
                ip: data.ip
            }
        });

    }

    // Consultar auditorías con filtros y paginación
    async listar(
        where: any,
        skip: number,
        take: number
    ) {

        const [auditorias, total] = await Promise.all([

            prisma.auditoria.findMany({
                where,
                skip,
                take,
                orderBy: {
                    fecha: "desc"
                },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            usuario: true
                        }
                    }
                }
            }),

            prisma.auditoria.count({
                where
            })

        ]);

        return {
            auditorias,
            total
        };

    }

}