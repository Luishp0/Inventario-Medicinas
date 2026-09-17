import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

    private userService = new UserService();

    listar = async (_req: Request, res: Response) => {

        try {

            const usuarios = await this.userService.listar();

            return res.json({
                ok: true,
                usuarios
            });

        } catch (error) {

            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener usuarios"
            });

        }

    };

    obtener = async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const usuario = await this.userService.buscarPorId(id);

            return res.json({
                ok: true,
                usuario
            });

        } catch (error: any) {

            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    crear = async (req: Request, res: Response) => {

        try {

            const usuario = await this.userService.crear(req.body);

            return res.status(201).json({
                ok: true,
                usuario
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    actualizar = async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const usuario = await this.userService.actualizar(id, req.body);

            return res.json({
                ok: true,
                usuario
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    cambiarEstado = async (req: Request, res: Response) => {

        try {

            const id = Number(req.params.id);

            const { activo } = req.body;

            const usuario = await this.userService.cambiarEstado(id, activo);

            return res.json({
                ok: true,
                usuario
            });

        } catch (error: any) {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

}