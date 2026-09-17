import { prisma } from "../config/prisma";

export class AuditoriaRepository {

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

}