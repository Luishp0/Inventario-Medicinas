import { prisma } from "../config/prisma";

export class UserRepository {

    async listar() {

        return prisma.usuario.findMany({

            include: {
                rol: true
            },

            orderBy: {
                nombre: "asc"
            }

        });

    }

    async buscarPorId(id: number) {

        return prisma.usuario.findUnique({

            where: { id },

            include: {
                rol: true
            }

        });

    }

    async buscarPorUsuario(usuario: string) {

        return prisma.usuario.findUnique({

            where: {
                usuario
            }

        });

    }

    async buscarPorCorreo(correo: string) {

        return prisma.usuario.findUnique({

            where: {
                correo
            }

        });

    }

    async crear(data: any) {

        return prisma.usuario.create({

            data,

            include: {
                rol: true
            }

        });

    }

    async actualizar(id: number, data: any) {

        return prisma.usuario.update({

            where: { id },

            data,

            include: {
                rol: true
            }

        });

    }

    async cambiarEstado(id: number, activo: boolean) {

        return prisma.usuario.update({

            where: { id },

            data: {
                activo
            }

        });

    }

    async cambiarPassword(id: number, contrasena: string) {

        return prisma.usuario.update({

            where: { id },

            data: {
                contrasena
            }

        });

    }

}