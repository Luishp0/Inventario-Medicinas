import { Request, Response } from "express";
import { SalidaService } from "../services/salida.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class SalidaController {

    private service: SalidaService;

    constructor() {
        this.service = new SalidaService();
    }

    crear = async (req: Request, res: Response) => {

        try {

            const authReq = req as AuthRequest;

            // =====================================================
            // USUARIO AUTENTICADO
            // =====================================================

            const usuarioId = authReq.usuario?.id;

            if (!usuarioId) {
                return res.status(401).json({
                    ok: false,
                    mensaje: "Usuario no autenticado",
                });
            }

            // =====================================================
            // DATOS RECIBIDOS
            // =====================================================

            const {
                cantidad,
                observaciones,
                motivoId,
                productoId,
                loteId,
                fechaSalida,
            } = req.body;

            // =====================================================
            // VALIDAR CAMPOS OBLIGATORIOS
            // =====================================================

            if (
                cantidad === undefined ||
                motivoId === undefined
            ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "cantidad y motivoId son obligatorios",
                });
            }

            // =====================================================
            // CONVERTIR CANTIDAD
            // =====================================================

            const cantidadNumero = Number(cantidad);

            // =====================================================
            // CONVERTIR MOTIVO
            // =====================================================

            const motivoIdNumero = Number(motivoId);

            // =====================================================
            // CONVERTIR PRODUCTO
            // =====================================================

            const productoIdNumero =
                productoId !== undefined &&
                productoId !== null
                    ? Number(productoId)
                    : undefined;

            // =====================================================
            // CONVERTIR LOTE
            // =====================================================

            const loteIdNumero =
                loteId !== undefined &&
                loteId !== null
                    ? Number(loteId)
                    : undefined;

            // =====================================================
            // CONVERTIR FECHA
            // =====================================================

            let fecha: Date | undefined;

            if (fechaSalida) {

                fecha = new Date(fechaSalida);

                if (isNaN(fecha.getTime())) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "La fecha de salida no es válida",
                    });
                }
            }

            // =====================================================
            // CREAR SALIDA
            // =====================================================

            const salida = await this.service.crear({
                cantidad: cantidadNumero,
                observaciones,
                motivoId: motivoIdNumero,
                usuarioId,
                productoId: productoIdNumero,
                loteId: loteIdNumero,
                fechaSalida: fecha,
                ip: req.ip,
            });

            // =====================================================
            // RESPUESTA
            // =====================================================

            return res.status(201).json({
                ok: true,
                mensaje: "Salida registrada correctamente",
                salida,
            });

        } catch (error) {

            console.error(
                "Error al registrar salida:",
                error
            );

            return res.status(400).json({
                ok: false,
                mensaje:
                    error instanceof Error
                        ? error.message
                        : "Error al registrar la salida",
            });
        }
    };
}