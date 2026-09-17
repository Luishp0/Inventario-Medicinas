import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

    console.log("Creando datos iniciales...");

    // Roles
    const administrador = await prisma.rol.upsert({
        where: {
            nombre: "Administrador"
        },
        update: {},
        create: {
            nombre: "Administrador",
            descripcion: "Acceso completo al sistema",
            activo: true
        }
    });

    

   

    // Contraseña
    const password = await bcrypt.hash("Admin123*", 10);

    // Usuario administrador
    await prisma.usuario.upsert({

        where: {
            usuario: "admin"
        },

        update: {
            correo: "admin@farmacia.local",
            activo: true
        },

            create: {
            
            nombre: "Administrador",
            apellidoPaterno: "Sistema",
            apellidoMaterno: "",
            usuario: "admin",
            correo: "admin@farmacia.local",
            contrasena: password,
            activo: true,

            rol: {
                connect: {
                    id: administrador.id
                }
            }
        }

    });

    console.log("Datos creados correctamente.");



    const motivos = [
    {
        tipo: "ENTRADA",
        nombre: "Compra"
    },
    {
        tipo: "ENTRADA",
        nombre: "Donación"
    },
    {
        tipo: "ENTRADA",
        nombre: "Ajuste positivo"
    },
    {
        tipo: "SALIDA",
        nombre: "Venta"
    },
    {
        tipo: "SALIDA",
        nombre: "Caducidad"
    },
    {
        tipo: "SALIDA",
        nombre: "Merma"
    },
    {
        tipo: "SALIDA",
        nombre: "Ajuste negativo"
    }
];

for (const motivo of motivos) {
    await prisma.motivo.upsert({
        where: {
            nombre: motivo.nombre
        },
        update: {},
        create: {
            ...motivo,
            activo: true
        }
    });
}

const categorias = [
    "Analgésicos",
    "Antibióticos",
    "Antiinflamatorios",
    "Vitaminas",
    "Jarabes",
    "Inyectables"
];

for (const categoria of categorias) {
    await prisma.categoria.upsert({
        where: {
            nombre: categoria
        },
        update: {},
        create: {
            nombre: categoria,
            activo: true
        }
    });
}


 const permisos = [

    // Usuarios
    {
        modulo: "Usuarios",
        codigo: "USUARIO_VER",
        nombre: "Ver usuarios",
        descripcion: "Permite consultar usuarios"
    },
    {
        modulo: "Usuarios",
        codigo: "USUARIO_CREAR",
        nombre: "Crear usuarios",
        descripcion: "Permite crear usuarios"
    },
    {
        modulo: "Usuarios",
        codigo: "USUARIO_EDITAR",
        nombre: "Editar usuarios",
        descripcion: "Permite editar usuarios"
    },
    {
        modulo: "Usuarios",
        codigo: "USUARIO_DESACTIVAR",
        nombre: "Desactivar usuarios",
        descripcion: "Permite activar/desactivar usuarios"
    },

    // Roles
    {
        modulo: "Roles",
        codigo: "ROL_VER",
        nombre: "Ver roles",
        descripcion: "Consultar roles"
    },
    {
        modulo: "Roles",
        codigo: "ROL_CREAR",
        nombre: "Crear roles",
        descripcion: "Crear roles"
    },
    {
        modulo: "Roles",
        codigo: "ROL_EDITAR",
        nombre: "Editar roles",
        descripcion: "Editar roles"
    },
    {
        modulo: "Roles",
        codigo: "ROL_DESACTIVAR",
        nombre: "Activar/Desactivar roles",
        descripcion: "Cambiar estado del rol"
    },

    // Productos
    {
        modulo: "Productos",
        codigo: "PRODUCTO_VER",
        nombre: "Ver productos",
        descripcion: "Consultar productos"
    },
    {
        modulo: "Productos",
        codigo: "PRODUCTO_CREAR",
        nombre: "Crear productos",
        descripcion: "Registrar productos"
    },
    {
        modulo: "Productos",
        codigo: "PRODUCTO_EDITAR",
        nombre: "Editar productos",
        descripcion: "Editar productos"
    },
    {
        modulo: "Productos",
        codigo: "PRODUCTO_DESACTIVAR",
        nombre: "Activar/Desactivar productos",
        descripcion: "Cambiar estado del producto"
    },

    // Lotes
    {
        modulo: "Lotes",
        codigo: "LOTE_VER",
        nombre: "Ver lotes",
        descripcion: "Consultar lotes"
    },
    {
        modulo: "Lotes",
        codigo: "LOTE_CREAR",
        nombre: "Registrar lotes",
        descripcion: "Crear lotes"
    },
    {
        modulo: "Lotes",
        codigo: "LOTE_EDITAR",
        nombre: "Editar lotes",
        descripcion: "Modificar lotes"
    },

    // Entradas
    {
        modulo: "Entradas",
        codigo: "ENTRADA_VER",
        nombre: "Ver entradas",
        descripcion: "Consultar entradas"
    },
    {
        modulo: "Entradas",
        codigo: "ENTRADA_CREAR",
        nombre: "Registrar entradas",
        descripcion: "Registrar entradas de inventario"
    },

    // Salidas
    {
        modulo: "Salidas",
        codigo: "SALIDA_VER",
        nombre: "Ver salidas",
        descripcion: "Consultar salidas"
    },
    {
        modulo: "Salidas",
        codigo: "SALIDA_CREAR",
        nombre: "Registrar salidas",
        descripcion: "Registrar salidas de inventario"
    },

    // Categorías
    {
        modulo: "Categorías",
        codigo: "CATEGORIA_VER",
        nombre: "Ver categorías",
        descripcion: "Consultar categorías"
    },
    {
        modulo: "Categorías",
        codigo: "CATEGORIA_ADMIN",
        nombre: "Administrar categorías",
        descripcion: "Crear y editar categorías"
    },

    // Auditoría
    {
        modulo: "Auditoría",
        codigo: "AUDITORIA_VER",
        nombre: "Ver auditoría",
        descripcion: "Consultar auditoría"
    },

    // Reportes
    {
        modulo: "Reportes",
        codigo: "REPORTE_VER",
        nombre: "Ver reportes",
        descripcion: "Consultar reportes"
    }

];

for (const permiso of permisos) {

    await prisma.permiso.upsert({

        where: {
            codigo: permiso.codigo
        },

        update: {},

        create: permiso

    });

}

console.log("✓ Permisos creados");


const permisosDB = await prisma.permiso.findMany();

for (const permiso of permisosDB) {

    await prisma.rolesPermisos.upsert({

        where: {

            rolId_permisoId: {

                rolId: administrador.id,

                permisoId: permiso.id

            }

        },

        update: {},

        create: {

            rolId: administrador.id,

            permisoId: permiso.id

        }

    });

}

console.log("✓ Permisos asignados al Administrador");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });

   