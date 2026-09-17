import { UserRepository } from "../repositories/user.repository";
import { RoleRepository } from "../repositories/role.repository";
import { encriptar } from "../utils/bcrypt";

export class UserService {

    private userRepository = new UserRepository();
    private roleRepository = new RoleRepository();

    async listar() {

        return await this.userRepository.listar();

    }

    async buscarPorId(id: number) {

        const usuario = await this.userRepository.buscarPorId(id);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        return usuario;

    }

    async crear(data: {
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno?: string;
        usuario: string;
        correo?: string;
        contrasena: string;
        rolId: number;
    }) {

        const existeUsuario =
            await this.userRepository.buscarPorUsuario(data.usuario);

        if (existeUsuario) {
            throw new Error("El nombre de usuario ya existe");
        }

        if (data.correo) {

            const existeCorreo =
                await this.userRepository.buscarPorCorreo(data.correo);

            if (existeCorreo) {
                throw new Error("El correo ya existe");
            }

        }

        const rol =
            await this.roleRepository.buscarPorId(data.rolId);

        if (!rol) {
            throw new Error("Rol no encontrado");
        }

        const password = await encriptar(data.contrasena);

        return await this.userRepository.crear({

            nombre: data.nombre,

            apellidoPaterno: data.apellidoPaterno,

            apellidoMaterno: data.apellidoMaterno,

            usuario: data.usuario,

            correo: data.correo,

            contrasena: password,

            activo: true,

            rol: {
                connect: {
                    id: data.rolId
                }
            }

        });

    }

    async actualizar(

        id: number,

        data: {
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno?: string;
            correo?: string;
            rolId: number;
        }

    ) {

        const usuario =
            await this.userRepository.buscarPorId(id);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        const rol =
            await this.roleRepository.buscarPorId(data.rolId);

        if (!rol) {
            throw new Error("Rol no encontrado");
        }

        return await this.userRepository.actualizar(id, {

            nombre: data.nombre,

            apellidoPaterno: data.apellidoPaterno,

            apellidoMaterno: data.apellidoMaterno,

            correo: data.correo,

            rol: {
                connect: {
                    id: data.rolId
                }
            }

        });

    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {

        return await this.userRepository.cambiarEstado(
            id,
            activo
        );

    }

    async cambiarPassword(
        id: number,
        passwordNueva: string
    ) {

        const password = await encriptar(passwordNueva);

        return await this.userRepository.cambiarPassword(
            id,
            password
        );

    }

}