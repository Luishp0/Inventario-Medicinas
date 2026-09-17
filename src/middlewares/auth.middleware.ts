import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: number;
    usuario: string;
    rol: string;
}

export interface AuthRequest extends Request {
    usuario?: TokenPayload;
}

export function verificarToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            ok: false,
            mensaje: "Token no proporcionado"
        });
    }

    const token = authorization.replace("Bearer ", "");

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as TokenPayload;

        req.usuario = payload;

        next();

    } catch {

        return res.status(401).json({
            ok: false,
            mensaje: "Token inválido"
        });

    }

}