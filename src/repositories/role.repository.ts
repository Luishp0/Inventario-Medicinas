import { prisma } from "../config/prisma";

export class RoleRepository {

    async listar() {

        return prisma.rol.findMany({
            orderBy: {
                nombre: "asc"
            }
        });

    }

    async buscarPorId(id: number) {

        return prisma.rol.findUnique({
            where: { id }
        });

    }

    async buscarPorNombre(nombre: string) {

        return prisma.rol.findUnique({
            where: { nombre }
        });

    }

    async crear(data: {
        nombre: string;
        descripcion?: string;
    }) {

        return prisma.rol.create({
            data: {
                ...data,
                activo: true
            }
        });

    }

    async actualizar(
        id: number,
        data: {
            nombre: string;
            descripcion?: string;
        }
    ) {

        return prisma.rol.update({
            where: { id },
            data
        });

    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {

        return prisma.rol.update({
            where: { id },
            data: {
                activo
            }
        });

    }

}
