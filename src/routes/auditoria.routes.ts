import { Router } from "express";
import { AuditoriaController } from "../controllers/auditoria.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();

const controller = new AuditoriaController();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Consultar auditorías
router.get(
    "/",
    verificarPermiso("AUDITORIA_VER"),
    controller.listar
);

export default router;