import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import roleRoutes from "./routes/role.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import permissionRoutes from "./routes/permission.routes";
import loteRoutes from "./routes/lote.route";
import auditoriaRoutes from "./routes/auditoria.routes";
import entradaRoutes from "./routes/entrada.routes";
import salidaRoutes from "./routes/salidas.routes";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/permisos", permissionRoutes);
app.use("/api/lotes", loteRoutes);
app.use("/api/auditorias", auditoriaRoutes);
app.use("/api/entradas", entradaRoutes);
app.use("/api/salidas", salidaRoutes);


export default app;