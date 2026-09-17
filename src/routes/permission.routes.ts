import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new PermissionController();

router.use(verificarToken);

router.get(
    "/",
    verificarPermiso("ROL_VER"),
    controller.listar
);

router.get(
    "/rol/:id",
    verificarPermiso("ROL_VER"),
    controller.obtenerPermisosRol
);

router.put(
    "/rol/:id",
    verificarPermiso("ROL_EDITAR"),
    controller.reemplazar
);

router.post(
    "/rol/:id/agregar",
    verificarPermiso("ROL_EDITAR"),
    controller.agregar
);

router.delete(
    "/rol/:id/quitar",
    verificarPermiso("ROL_EDITAR"),
    controller.quitar
);

export default router;