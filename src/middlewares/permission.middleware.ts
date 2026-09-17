import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "./auth.middleware";

export function verificarPermiso(codigo: string) {

    return async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        const usuario = req.usuario;

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: "No autorizado"
            });
        }

        const existe = await prisma.rolesPermisos.findFirst({

            where: {

                rol: {
                    nombre: usuario.rol
                },

                permiso: {
                    codigo,
                    activo: true
                }

            }

        });

        if (!existe) {

            return res.status(403).json({

                ok: false,

                mensaje: "No tienes permisos para realizar esta acción"

            });

        }

        next();

    };

}