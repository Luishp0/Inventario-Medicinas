import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware";
import { verificarRol } from "../middlewares/role.middleware";

const router = Router();

router.get(
    "/admin",
    verificarToken,
    verificarRol("Administrador"),
    (req, res) => {

        res.json({

            ok: true,
            mensaje: "Bienvenido Administrador"

        });

    }
);

export default router;