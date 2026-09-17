import { AuthRepository } from "../repositories/auth.repository";
import { comparar } from "../utils/bcrypt";
import { generarToken } from "../utils/jwt";

export class AuthService {

    private authRepository = new AuthRepository();

    async login(usuario: string, contrasena: string) {

        const usuarioDB = await this.authRepository.buscarUsuario(usuario);

        if (!usuarioDB) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        if (!usuarioDB.activo) {
            throw new Error("Usuario desactivado");
        }

        const passwordCorrecta = await comparar(
            contrasena,
            usuarioDB.contrasena
        );

        if (!passwordCorrecta) {
            throw new Error("Usuario o contraseña incorrectos");
        }

        await this.authRepository.actualizarUltimoAcceso(usuarioDB.id);

        const token = generarToken({
            id: usuarioDB.id,
            usuario: usuarioDB.usuario,
            rol: usuarioDB.rol.nombre
        });

        return {
            token,
            usuario: {
                id: usuarioDB.id,
                nombre: usuarioDB.nombre,
                usuario: usuarioDB.usuario,
                rol: usuarioDB.rol.nombre
            }
        };
    }
}