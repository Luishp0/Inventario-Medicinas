import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new RoleController();

router.use(verificarToken);

router.get(
    "/",
    verificarPermiso("ROL_VER"),
    controller.listar
);

router.post(
    "/",
    verificarPermiso("ROL_CREAR"),
    controller.crear
);

router.put(
    "/:id",
    verificarPermiso("ROL_EDITAR"),
    controller.actualizar
);

router.patch(
    "/:id/estado",
    verificarPermiso("ROL_DESACTIVAR"),
    controller.cambiarEstado
);

export default router;