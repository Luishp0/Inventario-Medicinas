import { AuditoriaRepository } from "../repositories/auditoria.repository";
import { prepararPaginacion } from "../utils/pagination";

export class AuditoriaService {

    private repository = new AuditoriaRepository();

    // Registrar una acción
    async registrar(data: {

        modulo: string;
        tabla: string;
        accion: string;
        idRegistro?: number;
        descripcion?: string;
        datosAnteriores?: any;
        datosNuevos?: any;
        usuarioId: number;
        ip?: string;

    }) {

        return this.repository.crear(data);

    }

    // Consultar auditorías
    async listar(filtros: {

        modulo?: string;
        tabla?: string;
        accion?: string;
        usuarioId?: number;
        fechaDesde?: string;
        fechaHasta?: string;
        page?: number;
        limit?: number;

    }) {

        const { page, limit, skip } =
            prepararPaginacion(filtros);

        const where: any = {};

        if (filtros.modulo) {
            where.modulo = {
                contains: filtros.modulo,
                mode: "insensitive"
            };
        }

        if (filtros.tabla) {
            where.tabla = {
                contains: filtros.tabla,
                mode: "insensitive"
            };
        }

        if (filtros.accion) {
            where.accion = filtros.accion;
        }

        if (filtros.usuarioId !== undefined) {
            where.usuarioId = filtros.usuarioId;
        }

        if (filtros.fechaDesde || filtros.fechaHasta) {

            where.fecha = {};

            if (filtros.fechaDesde) {
                where.fecha.gte =
                    new Date(filtros.fechaDesde);
            }

            if (filtros.fechaHasta) {

                const fechaHasta =
                    new Date(filtros.fechaHasta);

                fechaHasta.setHours(23, 59, 59, 999);

                where.fecha.lte = fechaHasta;

            }

        }

        const resultado =
            await this.repository.listar(
                where,
                skip,
                limit
            );

        return {
            auditorias: resultado.auditorias,
            total: resultado.total,
            page,
            limit
        };

    }

}