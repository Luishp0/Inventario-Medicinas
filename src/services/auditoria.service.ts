import { AuditoriaRepository } from "../repositories/auditoria.repository";

export class AuditoriaService {

    private repository = new AuditoriaRepository();

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

}