import { Request, Response, NextFunction } from "express";

export const verificarRol = (...rolesPermitidos: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const usuario = (req as any).usuario;

        if (!usuario) {

            return res.status(401).json({
                ok: false,
                mensaje: "No autenticado"
            });

        }

        if (!rolesPermitidos.includes(usuario.rol)) {

            return res.status(403).json({
                ok: false,
                mensaje: "No tiene permisos para realizar esta acción"
            });

        }

        next();

    };

};