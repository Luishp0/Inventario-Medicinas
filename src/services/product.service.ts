import { ProductRepository } from "../repositories/product.repository";
import { prisma } from "../config/prisma";

export class ProductService {

    private repository = new ProductRepository();

    async listar(filtros: any) {

    return this.repository.listar(filtros);

}

    async buscarPorId(id: number) {

        const producto = await this.repository.buscarPorId(id);

        if (!producto) {
            throw new Error("Producto no encontrado");
        }

        return producto;

    }

    

    async crear(data: {

    
        codigo: string;

        nombre: string;

        descripcion?: string;

        categoriaId: number;

        stockMinimo: number;

    }) {
        

        const existeCodigo = await this.repository.buscarPorCodigo(data.codigo);

        if (existeCodigo) {
            throw new Error("Ya existe un producto con ese código.");
        }

        const categoria = await prisma.categoria.findUnique({
            where: {
                id: data.categoriaId
            }
        });

        if (!categoria) {
            throw new Error("La categoría no existe.");
        }

        return await this.repository.crear(data);

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

        const producto = await this.repository.buscarPorId(id);

        if (!producto) {
            throw new Error("Producto no encontrado.");
        }

        const codigo = await this.repository.buscarPorCodigo(data.codigo);

        if (codigo && codigo.id !== id) {
            throw new Error("Ese código ya pertenece a otro producto.");
        }

        const categoria = await prisma.categoria.findUnique({
            where: {
                id: data.categoriaId
            }
        });

        if (!categoria) {
            throw new Error("La categoría no existe.");
        }

        return await this.repository.actualizar(id, data);

    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {

        await this.buscarPorId(id);

        return await this.repository.cambiarEstado(
            id,
            activo
        );

    }

}