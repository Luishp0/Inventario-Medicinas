import { Response } from "express";
import { LoteService } from "../services/lote.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { registrarAuditoria } from "../utils/auditoria";

export class LoteController {

    private service = new LoteService();

    listar = async (req: AuthRequest, res: Response) => {
        try {

            const filtros = {
                productoId: req.query.producto
                    ? Number(req.query.producto)
                    : undefined,

                numeroLote: req.query.numeroLote as string,

                activo:
                    req.query.activo === undefined
                        ? undefined
                        : req.query.activo === "true",

                fechaCaducidadDesde:
                    req.query.fechaCaducidadDesde as string,

                fechaCaducidadHasta:
                    req.query.fechaCaducidadHasta as string,

                page:
                    req.query.page
                        ? Number(req.query.page)
                        : 1,

                limit:
                    req.query.limit
                        ? Number(req.query.limit)
                        : 10,

                sort:
                    req.query.sort as string,

                order:
                    req.query.order as "asc" | "desc"
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
                lotes: resultado.lotes
            });

        } catch (error: any) {

            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });

        }
    };


    buscarPorId = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "ID de lote inválido"
                });
            }

            const lote =
                await this.service.buscarPorId(id);

            return res.json({
                ok: true,
                lote
            });

        } catch (error: any) {

            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });

        }
    };


    crear = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const lote =
                await this.service.crear(req.body);

            await registrarAuditoria({
                modulo: "Inventario",
                tabla: "lotes",
                accion: "CREAR",
                idRegistro: lote.id,
                descripcion: "Se creó un lote",
                datosNuevos: lote,
                usuarioId: req.usuario!.id,
                ip: req.ip
            });

            return res.status(201).json({
                ok: true,
                lote
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }
    };


    actualizar = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "ID de lote inválido"
                });
            }

            const anterior =
                await this.service.buscarPorId(id);

            const lote =
                await this.service.actualizar(
                    id,
                    req.body
                );

            await registrarAuditoria({
                modulo: "Inventario",
                tabla: "lotes",
                accion: "EDITAR",
                idRegistro: lote.id,
                descripcion: "Se actualizó un lote",
                datosAnteriores: anterior,
                datosNuevos: lote,
                usuarioId: req.usuario!.id,
                ip: req.ip
            });

            return res.json({
                ok: true,
                lote
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }
    };


    cambiarEstado = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "ID de lote inválido"
                });
            }

            if (typeof req.body.activo !== "boolean") {
                return res.status(400).json({
                    ok: false,
                    mensaje:
                        "El campo activo debe ser true o false"
                });
            }

            const anterior =
                await this.service.buscarPorId(id);

            const lote =
                await this.service.cambiarEstado(
                    id,
                    req.body.activo
                );

            await registrarAuditoria({
                modulo: "Inventario",
                tabla: "lotes",
                accion: req.body.activo
                    ? "ACTIVAR"
                    : "DESACTIVAR",
                idRegistro: lote.id,
                descripcion: req.body.activo
                    ? "Lote activado"
                    : "Lote desactivado",
                datosAnteriores: anterior,
                datosNuevos: lote,
                usuarioId: req.usuario!.id,
                ip: req.ip
            });

            return res.json({
                ok: true,
                lote
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }
    };
}