import { prisma } from "../config/prisma";

export class PermissionRepository {

    async listar() {

        return prisma.permiso.findMany({

            where: {
                activo: true
            },

            orderBy: [
                {
                    modulo: "asc"
                },
                {
                    nombre: "asc"
                }
            ]

        });

    }

    async obtenerPermisosRol(idRol: number) {

        return prisma.rolesPermisos.findMany({

            where: {
                rolId: idRol
            },

            include: {
                permiso: true
            }

        });

    }

    async reemplazarPermisos(
        idRol: number,
        permisos: number[]
    ) {

        await prisma.$transaction(async (tx) => {

            await tx.rolesPermisos.deleteMany({

                where: {
                    rolId: idRol
                }

            });

            if (permisos.length > 0) {

                await tx.rolesPermisos.createMany({

                    data: permisos.map(id => ({
                        rolId: idRol,
                        permisoId: id
                    })),

                    skipDuplicates: true

                });

            }

        });

    }

    async agregarPermisos(
        idRol: number,
        permisos: number[]
    ) {

        await prisma.$transaction(async (tx) => {

            await tx.rolesPermisos.createMany({

                data: permisos.map(id => ({
                    rolId: idRol,
                    permisoId: id
                })),

                skipDuplicates: true

            });

        });

    }

   async quitarPermisos(
    idRol: number,
    permisos: number[]
) {

    await prisma.$transaction(async (tx) => {

        await tx.rolesPermisos.deleteMany({

            where: {

                rolId: idRol,

                permisoId: {
                    in: permisos
                }

            }

        });

    });

}

}