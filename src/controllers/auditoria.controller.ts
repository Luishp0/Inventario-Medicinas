import { Response } from "express";
import { AuditoriaService } from "../services/auditoria.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AuditoriaController {

    private service = new AuditoriaService();

    listar = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const filtros = {

                modulo:
                    req.query.modulo as string,

                tabla:
                    req.query.tabla as string,

                accion:
                    req.query.accion as string,

                usuarioId:
                    req.query.usuarioId
                        ? Number(req.query.usuarioId)
                        : undefined,

                fechaDesde:
                    req.query.fechaDesde as string,

                fechaHasta:
                    req.query.fechaHasta as string,

                page:
                    req.query.page
                        ? Number(req.query.page)
                        : 1,

                limit:
                    req.query.limit
                        ? Number(req.query.limit)
                        : 10

            };

            const resultado =
                await this.service.listar(filtros);

            return res.json({

                ok: true,
                total: resultado.total,
                page: resultado.page,
                limit: resultado.limit,

                totalPages: Math.ceil(
                    resultado.total / resultado.limit
                ),

                auditorias: resultado.auditorias

            });

        } catch (error: any) {

            return res.status(500).json({

                ok: false,
                mensaje: error.message

            });

        }

    };

}