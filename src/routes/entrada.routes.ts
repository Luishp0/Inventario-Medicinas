
import { Router } from "express";
import { EntradaController } from "../controllers/entrada.controller";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarPermiso } from "../middlewares/permission.middleware";

const router = Router();
const controller = new EntradaController();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Registrar entrada
router.post(
    "/",
    verificarPermiso("ENTRADA_CREAR"),
    controller.crear
);

export default router;