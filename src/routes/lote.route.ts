import { Router } from "express";
import { LoteController } from "../controllers/lote.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();
const controller = new LoteController();

// Todas las rutas de lotes requieren autenticación
router.use(verificarToken);

// Consultar lotes
router.get(
    "/",
    verificarPermiso("LOTE_VER"),
    controller.listar
);

// Consultar un lote específico
router.get(
    "/:id",
    verificarPermiso("LOTE_VER"),
    controller.buscarPorId
);

// Crear lote
router.post(
    "/",
    verificarPermiso("LOTE_CREAR"),
    controller.crear
);

// Editar lote
router.put(
    "/:id",
    verificarPermiso("LOTE_EDITAR"),
    controller.actualizar
);

// Activar / desactivar lote
router.patch(
    "/:id/estado",
    verificarPermiso("LOTE_DESACTIVAR"),
    controller.cambiarEstado
);

export default router;