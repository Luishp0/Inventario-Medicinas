import { prisma } from "../config/prisma";

export class AuthRepository {

    async buscarUsuario(usuario: string) {

        return prisma.usuario.findUnique({

            where: {
                usuario
            },

            include: {
                rol: true
            }

        });

    }

    async actualizarUltimoAcceso(id: number) {

        return prisma.usuario.update({

            where: {
                id
            },

            data: {
                ultimoAcceso: new Date()
            }

        });

    }

}