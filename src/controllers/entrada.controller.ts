
import { Request, Response } from "express";
import { EntradaService } from "../services/entrada.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const entradaService = new EntradaService();

export class EntradaController {

    async crear(req: Request, res: Response) {

        try {
            const authReq = req as AuthRequest;

            // Obtener usuario autenticado desde el token
            const usuarioId = authReq.usuario?.id;

            if (!usuarioId) {
                return res.status(401).json({
                    ok: false,
                    mensaje: "Usuario no autenticado"
                });
            }

            const {
                cantidad,
                observaciones,
                motivoId,
                loteId,
                fechaEntrada
            } = req.body;

            // Validar campos obligatorios
            if (
                cantidad === undefined ||
                motivoId === undefined ||
                loteId === undefined
            ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Cantidad, motivo y lote son obligatorios"
                });
            }

            const entrada = await entradaService.crear({
                cantidad: Number(cantidad),
                observaciones,
                motivoId: Number(motivoId),
                loteId: Number(loteId),
                usuarioId,
                fechaEntrada: fechaEntrada
                    ? new Date(fechaEntrada)
                    : undefined,
                ip: req.ip
            });

            return res.status(201).json({
                ok: true,
                mensaje: "Entrada registrada correctamente",
                entrada
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message || "Error al registrar la entrada"
            });
        }
    }
}