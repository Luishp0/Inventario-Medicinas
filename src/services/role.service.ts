import { RoleRepository } from "../repositories/role.repository";

export class RoleService {

    private roleRepository = new RoleRepository();

    async listar() {

        return this.roleRepository.listar();

    }

    async buscarPorId(id: number) {

        const rol = await this.roleRepository.buscarPorId(id);

        if (!rol) {
            throw new Error("Rol no encontrado");
        }

        return rol;

    }

    async crear(
        nombre: string,
        descripcion?: string
    ) {

        const existe = await this.roleRepository.buscarPorNombre(nombre);

        if (existe) {
            throw new Error("Ya existe un rol con ese nombre");
        }

        return this.roleRepository.crear({
            nombre,
            descripcion
        });

    }

    async actualizar(
        id: number,
        nombre: string,
        descripcion?: string
    ) {

        const rol = await this.roleRepository.buscarPorId(id);

        if (!rol) {
            throw new Error("Rol no encontrado");
        }

        const existe = await this.roleRepository.buscarPorNombre(nombre);

        if (existe && existe.id !== id) {
            throw new Error("Ya existe un rol con ese nombre");
        }

        return this.roleRepository.actualizar(id, {
            nombre,
            descripcion
        });

    }

    async cambiarEstado(
        id: number,
        activo: boolean
    ) {

        const rol = await this.roleRepository.buscarPorId(id);

        if (!rol) {
            throw new Error("Rol no encontrado");
        }

        return this.roleRepository.cambiarEstado(
            id,
            activo
        );

    }

}