import { Router } from "express";
import { SalidaController } from "../controllers/salida.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new SalidaController();

// Todas las rutas requieren usuario autenticado
router.use(verificarToken);

// Registrar salida
router.post(
    "/",
    verificarPermiso("SALIDA_CREAR"),
    controller.crear
);

export default router;