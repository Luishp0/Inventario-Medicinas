import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new UserController();

router.use(verificarToken);


router.get(
    "/",
    verificarPermiso("USUARIO_VER"),
    controller.listar
);

router.post(
    "/",
    verificarPermiso("USUARIO_CREAR"),
    controller.crear
);

router.put(
    "/:id",
    verificarPermiso("USUARIO_EDITAR"),
    controller.actualizar
);

router.patch(
    "/:id/estado",
    verificarPermiso("USUARIO_DESACTIVAR"),
    controller.cambiarEstado
);



export default router;