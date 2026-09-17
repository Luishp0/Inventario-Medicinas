import { Response } from "express";
import { ProductService } from "../services/product.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { registrarAuditoria } from "../utils/auditoria";

export class ProductController {

    private service = new ProductService();
    

    listar = async (
    req: AuthRequest,
    res: Response
    
) => {

    try {

        const filtros = {

            codigo: req.query.codigo as string,

            nombre: req.query.nombre as string,

            categoriaId: req.query.categoria
                ? Number(req.query.categoria)
                : undefined,

            activo:
                req.query.activo === undefined
                    ? undefined
                    : req.query.activo === "true",

            page: req.query.page
                ? Number(req.query.page)
                : 1,

            limit: req.query.limit
                ? Number(req.query.limit)
                : 10,

            sort: req.query.sort as string,

            order: req.query.order as "asc" | "desc"

        };

        const resultado = await this.service.listar(filtros);

        return res.json({

            ok: true,

            total: resultado.total,

            page: filtros.page,

            limit: filtros.limit,

            totalPages: Math.ceil(
                resultado.total / filtros.limit!
            ),

            productos: resultado.productos

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

            const producto = await this.service.buscarPorId(
                Number(req.params.id)
            );

            return res.json({
                ok: true,
                producto
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

        const producto = await this.service.crear(req.body);

        await registrarAuditoria({

             modulo: "Inventario",

            tabla: "productos",

            accion: "CREAR",

            idRegistro: producto.id,

            descripcion: "Se creó un producto",

            datosNuevos: producto,

            usuarioId: req.usuario!.id,

            ip: req.ip

        });

        return res.status(201).json({
            ok: true,
            producto
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

        const anterior = await this.service.buscarPorId(id);

        const producto = await this.service.actualizar(
            id,
            req.body
        );

        await registrarAuditoria({

            modulo: "Inventario",

            tabla: "productos",

            accion: "EDITAR",

            idRegistro: producto.id,

            descripcion: "Se actualizó un producto",

            datosAnteriores: anterior,

            datosNuevos: producto,

            usuarioId: req.usuario!.id,

            ip: req.ip

        });

        return res.json({
            ok: true,
            producto
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

        const anterior = await this.service.buscarPorId(id);

        const producto = await this.service.cambiarEstado(
            id,
            req.body.activo
        );

        await registrarAuditoria({

            modulo: "Inventario",

            tabla: "productos",

            accion: req.body.activo
                ? "ACTIVAR"
                : "DESACTIVAR",

            idRegistro: producto.id,

            descripcion: req.body.activo
                ? "Producto activado"
                : "Producto desactivado",

            datosAnteriores: anterior,

            datosNuevos: producto,

            usuarioId: req.usuario!.id,

            ip: req.ip

        });

        return res.json({
            ok: true,
            producto
        });

    } catch (error: any) {

        return res.status(400).json({
            ok: false,
            mensaje: error.message
        });

    }

    };

}