import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {

    private authService = new AuthService();

    async login(req: Request, res: Response) {

        try {

            const { usuario, contrasena } = req.body;

            if (!usuario || !contrasena) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Usuario y contraseña son obligatorios"
                });
            }

            const respuesta = await this.authService.login(
                usuario,
                contrasena
            );

            return res.status(200).json({
                ok: true,
                ...respuesta
            });

        } catch (error) {

            return res.status(401).json({
                ok: false,
                mensaje: error instanceof Error ? error.message : "Error interno"
            });

        }

    }

}