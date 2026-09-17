import { AuditoriaService } from "../services/auditoria.service";

const auditoria = new AuditoriaService();

export async function registrarAuditoria(data: {
    modulo?: string;
    tabla: string;
    accion: string;
    idRegistro?: number;
    descripcion?: string;
    datosAnteriores?: any;
    datosNuevos?: any;
    usuarioId: number;
    ip?: string;
    endpoint?: string;
}) {
    try {

        await auditoria.registrar({
            modulo: data.modulo ?? "General",
            tabla: data.tabla,
            accion: data.accion,
            idRegistro: data.idRegistro,
            descripcion: data.descripcion,
            datosAnteriores: data.datosAnteriores,
            datosNuevos: data.datosNuevos,
            usuarioId: data.usuarioId,
            ip: data.ip
        });

    } catch (error) {

        console.log(
            "Error registrando auditoría"
        );

    }
}