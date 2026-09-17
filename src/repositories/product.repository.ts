import { prisma } from "../config/prisma";

export class ProductRepository {


    

    async listar(filtros: {
    codigo?: string;
    nombre?: string;
    categoriaId?: number;
    activo?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
}) {

    const {
        codigo,
        nombre,
        categoriaId,
        activo,
        page = 1,
        limit = 10,
        sort = "nombre",
        order = "asc"
    } = filtros;

    const where: any = {};

    if (codigo) {
        where.codigo = {
            contains: codigo,
            mode: "insensitive"
        };
    }

    if (nombre) {
        where.nombre = {
            contains: nombre,
            mode: "insensitive"
        };
    }

    if (categoriaId) {
        where.categoriaId = categoriaId;
    }

    if (activo !== undefined) {
        where.activo = activo;
    }

    const total = await prisma.producto.count({
        where
    });

    const productos = await prisma.producto.findMany({

        where,

        include: {
            categoria: true
        },

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {
            [sort]: order
        }

    });

    return {
        total,
        productos
    };

}

    async buscarPorId(id: number) {

        return prisma.producto.findUnique({

            where: { id },

            include: {
                categoria: true
            }

        });

    }

    async buscarPorCodigo(codigo: string) {

        return prisma.producto.findUnique({

            where: {
                codigo
            }

        });

    }

    

    async crear(data: {

        codigo: string;

        nombre: string;

        descripcion?: string;

        categoriaId: number;

        stockMinimo: number;

    }) {

        

        return prisma.producto.create({

            data: {

                ...data,

                stockActual: 0,

                activo: true

            }

        });

    }

    async actualizar(

        id: number,

        data: {

            codigo: string;

            nombre: string;

            descripcion?: string;

            categoriaId: number;

            stockMinimo: number;

        }

    ) {

        return prisma.producto.update({

            where: {
                id
            },

            data

        });

    }

    async cambiarEstado(

        id: number,

        activo: boolean

    ) {

        return prisma.producto.update({

            where: {
                id
            },

            data: {
                activo
            }

        });

    }

    

}