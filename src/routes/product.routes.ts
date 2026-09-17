import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new ProductController();

router.use(verificarToken);

router.get(
    "/",
    verificarPermiso("PRODUCTO_VER"),
    controller.listar
);

router.get(
    "/:id",
    verificarPermiso("PRODUCTO_VER"),
    controller.buscarPorId
);

router.post(
    "/",
    verificarPermiso("PRODUCTO_CREAR"),
    controller.crear
);

router.put(
    "/:id",
    verificarPermiso("PRODUCTO_EDITAR"),
    controller.actualizar
);

router.patch(
    "/:id/estado",
    verificarPermiso("PRODUCTO_DESACTIVAR"),
    controller.cambiarEstado
);

export default router;