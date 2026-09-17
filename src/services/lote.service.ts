import { LoteRepository } from "../repositories/lote.repository";
import { prepararPaginacion } from "../utils/pagination";

export class LoteService {

    private repository = new LoteRepository();

    async listar(filtros: {
        productoId?: number;
        numeroLote?: string;
        activo?: boolean;
        fechaCaducidadDesde?: string;
        fechaCaducidadHasta?: string;
        page?: number;
        limit?: number;
        sort?: string;
        order?: "asc" | "desc";
    }) {

        const { page, limit, skip, order } =
            prepararPaginacion(filtros);

        const where: any = {};

        // Filtrar por producto
        if (filtros.productoId !== undefined) {
            where.productoId = filtros.productoId;
        }

        // Buscar por número de lote
        if (filtros.numeroLote) {
            where.numeroLote = {
                contains: filtros.numeroLote,
                mode: "insensitive"
            };
        }

        // Filtrar activos/inactivos
        if (filtros.activo !== undefined) {
            where.activo = filtros.activo;
        }

        // Fecha de caducidad desde
        if (filtros.fechaCaducidadDesde) {
            where.fechaCaducidad = {
                ...(where.fechaCaducidad || {}),
                gte: new Date(filtros.fechaCaducidadDesde)
            };
        }

        // Fecha de caducidad hasta
        if (filtros.fechaCaducidadHasta) {
            const fechaHasta = new Date(
                filtros.fechaCaducidadHasta
            );

            fechaHasta.setHours(23, 59, 59, 999);

            where.fechaCaducidad = {
                ...(where.fechaCaducidad || {}),
                lte: fechaHasta
            };
        }

        // Campos permitidos para ordenar
        const camposPermitidos = [
            "id",
            "numeroLote",
            "fechaCaducidad",
            "cantidadDisponible",
            "fechaRegistro",
            "activo"
        ];

        const campoOrden =
            camposPermitidos.includes(filtros.sort || "")
                ? filtros.sort!
                : "fechaCaducidad";

        const orderBy = {
            [campoOrden]: order
        };

        const resultado = await this.repository.listar(
            where,
            skip,
            limit,
            orderBy
        );

        return {
            lotes: resultado.lotes,
            total: resultado.total,
            page,
            limit
        };
    }

    async buscarPorId(id: number) {

        const lote = await this.repository.buscarPorId(id);

        if (!lote) {
            throw new Error("Lote no encontrado");
        }

        return lote;
    }

    async crear(data: {
        numeroLote: string;
        fechaCaducidad: string;
        cantidadDisponible?: number;
        productoId: number;
    }) {

        if (!data.numeroLote?.trim()) {
            throw new Error("El número de lote es obligatorio");
        }

        if (!data.fechaCaducidad) {
            throw new Error("La fecha de caducidad es obligatoria");
        }

        if (!data.productoId) {
            throw new Error("El producto es obligatorio");
        }

        const producto = await this.repository.buscarPorProductoYLote(
            data.productoId,
            data.numeroLote.trim()
        );

        if (producto) {
            throw new Error(
                "Ya existe ese número de lote para este producto"
            );
        }

        return await this.repository.crear({
            numeroLote: data.numeroLote.trim(),
            fechaCaducidad: new Date(data.fechaCaducidad),
            cantidadDisponible: data.cantidadDisponible ?? 0,
            productoId: data.productoId
        });
    }

    async actualizar(
        id: number,
        data: {
            numeroLote?: string;
            fechaCaducidad?: string;
            activo?: boolean;
        }
    ) {

        const lote = await this.repository.buscarPorId(id);

        if (!lote) {
            throw new Error("Lote no encontrado");
        }

        const datos: {
            numeroLote?: string;
            fechaCaducidad?: Date;
            activo?: boolean;
        } = {};

        if (data.numeroLote !== undefined) {
            if (!data.numeroLote.trim()) {
                throw new Error(
                    "El número de lote no puede estar vacío"
                );
            }

            datos.numeroLote = data.numeroLote.trim();

            if (datos.numeroLote !== lote.numeroLote) {

                const existente =
                    await this.repository.buscarPorProductoYLote(
                        lote.productoId,
                        datos.numeroLote
                    );

                if (existente && existente.id !== id) {
                    throw new Error(
                        "Ya existe ese número de lote para este producto"
                    );
                }
            }
        }

        if (data.fechaCaducidad !== undefined) {
            if (!data.fechaCaducidad) {
                throw new Error(
                    "La fecha de caducidad es obligatoria"
                );
            }

            datos.fechaCaducidad =
                new Date(data.fechaCaducidad);
        }

        if (data.activo !== undefined) {
            datos.activo = data.activo;
        }

        return await this.repository.actualizar(
            id,
            datos
        );
    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {

        const lote = await this.repository.buscarPorId(id);

        if (!lote) {
            throw new Error("Lote no encontrado");
        }

        return await this.repository.cambiarEstado(
            id,
            activo
        );
    }
}