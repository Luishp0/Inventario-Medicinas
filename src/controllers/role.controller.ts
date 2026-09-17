import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

export class RoleController {

    private roleService = new RoleService();

    listar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const roles = await this.roleService.listar();

            res.json({
                ok: true,
                roles
            });

        } catch (error: any) {

            res.status(500).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    crear = async (
        req: Request,
        res: Response
    ) => {

        try {

            const { nombre, descripcion } = req.body;

            const rol = await this.roleService.crear(
                nombre,
                descripcion
            );

            res.status(201).json({
                ok: true,
                rol
            });

        } catch (error: any) {

            res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    actualizar = async (
        req: Request,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            const { nombre, descripcion } = req.body;

            const rol = await this.roleService.actualizar(
                id,
                nombre,
                descripcion
            );

            res.json({
                ok: true,
                rol
            });

        } catch (error: any) {

            res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

    cambiarEstado = async (
        req: Request,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            const { activo } = req.body;

            const rol = await this.roleService.cambiarEstado(
                id,
                activo
            );

            res.json({
                ok: true,
                rol
            });

        } catch (error: any) {

            res.status(400).json({
                ok: false,
                mensaje: error.message
            });

        }

    };

}