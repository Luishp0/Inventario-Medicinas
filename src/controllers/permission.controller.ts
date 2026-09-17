import { Request, Response } from "express";
import { PermissionService } from "../services/permission.service";

export class PermissionController {

    private service = new PermissionService();

    listar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const permisos = await this.service.listar();

            return res.json({
                ok: true,
                permisos
            });

        } catch (error: any) {

            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    obtenerPermisosRol = async (
        req: Request,
        res: Response
    ) => {

        try {

            const permisos =
                await this.service.obtenerPermisosRol(
                    Number(req.params.id)
                );

            return res.json({

                ok: true,

                permisos

            });

        } catch (error: any) {

            return res.status(400).json({

                ok: false,

                mensaje: error.message

            });

        }

    };

    reemplazar = async (
        req: Request,
        res: Response
    ) => {

        try {

            await this.service.reemplazarPermisos(

                Number(req.params.id),

                req.body.permisos

            );

            return res.json({

                ok: true,

                mensaje: "Permisos actualizados"

            });

        } catch (error: any) {

            return res.status(400).json({

                ok: false,

                mensaje: error.message

            });

        }

    };

    agregar = async (
        req: Request,
        res: Response
    ) => {

        try {

            await this.service.agregarPermisos(

                Number(req.params.id),

                req.body.permisos

            );

            return res.json({

                ok: true,

                mensaje: "Permisos agregados"

            });

        } catch (error: any) {

            return res.status(400).json({

                ok: false,

                mensaje: error.message

            });

        }

    };

    quitar = async (
        req: Request,
        res: Response
    ) => {

        try {

            await this.service.quitarPermisos(

                Number(req.params.id),

                req.body.permisos

            );

            return res.json({

                ok: true,

                mensaje: "Permisos eliminados"

            });

        } catch (error: any) {

            return res.status(400).json({

                ok: false,

                mensaje: error.message

            });

        }

    };

}