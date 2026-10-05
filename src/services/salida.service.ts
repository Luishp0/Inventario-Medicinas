import { SalidaRepository } from "../repositories/salida.repository";
import { registrarAuditoria } from "../utils/auditoria";

interface CrearSalidaServiceData {
    cantidad: number;
    observaciones?: string | null;
    motivoId: number;
    usuarioId: number;
    productoId?: number;
    loteId?: number;
    fechaSalida?: Date;
    ip?: string;
}

export class SalidaService {

    private repository: SalidaRepository;

    constructor() {
        this.repository = new SalidaRepository();
    }

    async crear(data: CrearSalidaServiceData) {

        // =====================================================
        // VALIDAR CANTIDAD
        // =====================================================

        if (
            typeof data.cantidad !== "number" ||
            !Number.isFinite(data.cantidad) ||
            data.cantidad <= 0
        ) {
            throw new Error(
                "La cantidad debe ser un número mayor que cero"
            );
        }

        // =====================================================
        // VALIDAR MOTIVO
        // =====================================================

        if (
            !Number.isInteger(data.motivoId) ||
            data.motivoId <= 0
        ) {
            throw new Error(
                "El motivo seleccionado no es válido"
            );
        }

        // =====================================================
        // VALIDAR USUARIO
        // =====================================================

        if (
            !Number.isInteger(data.usuarioId) ||
            data.usuarioId <= 0
        ) {
            throw new Error(
                "El usuario no es válido"
            );
        }

        // =====================================================
        // VALIDAR PRODUCTO
        // =====================================================

        if (
            data.productoId !== undefined &&
            (
                !Number.isInteger(data.productoId) ||
                data.productoId <= 0
            )
        ) {
            throw new Error(
                "El producto seleccionado no es válido"
            );
        }

        // =====================================================
        // VALIDAR LOTE
        // =====================================================

        if (
            data.loteId !== undefined &&
            (
                !Number.isInteger(data.loteId) ||
                data.loteId <= 0
            )
        ) {
            throw new Error(
                "El lote seleccionado no es válido"
            );
        }

        // =====================================================
        // VALIDAR QUE EXISTAN PRODUCTO O LOTE
        // =====================================================

        if (
            data.productoId === undefined &&
            data.loteId === undefined
        ) {
            throw new Error(
                "Debe indicar un producto para utilizar FEFO o seleccionar un lote manualmente"
            );
        }

        // =====================================================
        // VALIDAR FECHA
        // =====================================================

        if (
            data.fechaSalida !== undefined &&
            !(data.fechaSalida instanceof Date)
        ) {
            throw new Error(
                "La fecha de salida no es válida"
            );
        }

        // =====================================================
        // CREAR SALIDA
        // =====================================================

        const salida = await this.repository.crear({
            cantidad: data.cantidad,
            observaciones: data.observaciones,
            motivoId: data.motivoId,
            usuarioId: data.usuarioId,
            productoId: data.productoId,
            loteId: data.loteId,
            fechaSalida: data.fechaSalida,
        });

        // =====================================================
        // AUDITORÍA
        // =====================================================

        await registrarAuditoria({
            usuarioId: data.usuarioId,
            modulo: "Inventario",
            tabla: "salidas",
            accion: "CREAR",
            idRegistro: salida.id,
            descripcion:
                `Salida de ${data.cantidad} unidades del lote ${salida.loteId}`,
            datosNuevos: {
                idSalida: salida.id,
                cantidad: data.cantidad,
                productoId: data.productoId,
                loteId: salida.loteId,
                motivoId: data.motivoId,
                usuarioId: data.usuarioId,
                fechaSalida: salida.fechaSalida,
            },
            ip: data.ip,
        });

        return salida;
    }
}