import { PermissionRepository } from "../repositories/permission.repository";
import { RoleRepository } from "../repositories/role.repository";

export class PermissionService {

    private repository = new PermissionRepository();

    private roleRepository = new RoleRepository();

    async listar() {

        return this.repository.listar();

    }

    async obtenerPermisosRol(idRol: number) {

        const rol = await this.roleRepository.buscarPorId(idRol);

        if (!rol) {

            throw new Error("Rol no encontrado");

        }

        return this.repository.obtenerPermisosRol(idRol);

    }

    async reemplazarPermisos(
        idRol: number,
        permisos: number[]
    ) {

        const rol = await this.roleRepository.buscarPorId(idRol);

        if (!rol) {

            throw new Error("Rol no encontrado");

        }

        await this.repository.reemplazarPermisos(
            idRol,
            permisos
        );

    }

    async agregarPermisos(
        idRol: number,
        permisos: number[]
    ) {

        const rol = await this.roleRepository.buscarPorId(idRol);

        if (!rol) {

            throw new Error("Rol no encontrado");

        }

        await this.repository.agregarPermisos(
            idRol,
            permisos
        );

    }

    async quitarPermisos(
        idRol: number,
        permisos: number[]
    ) {

        const rol = await this.roleRepository.buscarPorId(idRol);

        if (!rol) {

            throw new Error("Rol no encontrado");

        }

        await this.repository.quitarPermisos(
            idRol,
            permisos
        );

    }

}