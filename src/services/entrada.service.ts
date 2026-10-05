
import { EntradaRepository } from "../repositories/entrada.repository";
import { registrarAuditoria } from "../utils/auditoria";

const entradaRepository = new EntradaRepository();

export class EntradaService {

    async crear(data: {
        cantidad: number;
        observaciones?: string;
        motivoId: number;
        usuarioId: number;
        loteId: number;
        fechaEntrada?: Date;
        ip?: string;
    }) {

        // Validar cantidad
        if (!Number.isFinite(data.cantidad) || data.cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor que cero");
        }

        // Validar identificadores
        if (!Number.isInteger(data.motivoId) || data.motivoId <= 0) {
            throw new Error("El motivo no es válido");
        }

        if (!Number.isInteger(data.loteId) || data.loteId <= 0) {
            throw new Error("El lote no es válido");
        }

        if (!Number.isInteger(data.usuarioId) || data.usuarioId <= 0) {
            throw new Error("El usuario no es válido");
        }

        // Validar fecha, si fue proporcionada
        if (
            data.fechaEntrada &&
            Number.isNaN(data.fechaEntrada.getTime())
        ) {
            throw new Error("La fecha de entrada no es válida");
        }

        // Registrar entrada y actualizar inventario
        const entrada = await entradaRepository.crear({
            cantidad: data.cantidad,
            observaciones: data.observaciones,
            motivoId: data.motivoId,
            usuarioId: data.usuarioId,
            loteId: data.loteId,
            fechaEntrada: data.fechaEntrada
        });

        // Registrar auditoría
        await registrarAuditoria({
            modulo: "Inventario",
            tabla: "entradas",
            accion: "CREAR",
            idRegistro: entrada.id,
            descripcion: `Entrada de ${data.cantidad} unidades al lote ${data.loteId}`,
            datosNuevos: {
                idEntrada: entrada.id,
                cantidad: data.cantidad,
                loteId: data.loteId,
                motivoId: data.motivoId,
                usuarioId: data.usuarioId,
                fechaEntrada: entrada.fechaEntrada
            },
            usuarioId: data.usuarioId,
            ip: data.ip
        });

        return entrada;
    }
}