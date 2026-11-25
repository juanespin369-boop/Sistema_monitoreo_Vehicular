const vehiculoRepository = require("../persistence/vehiculoRepository");

async function listarVehiculos(usuario) {

    if (usuario.rol === "administrador") {
        return await vehiculoRepository.listarVehiculos();
    }

    if (usuario.rol === "cliente") {
        const vehiculo = await vehiculoRepository.buscarPorUsuario(
            usuario.id_usuario
        );

        return vehiculo ? [vehiculo] : [];
    }

    const error = new Error("Acceso no autorizado");
    error.status = 403;
    throw error;
}

async function verificarAcceso(usuario, id_vehiculo) {

    const vehiculo = await vehiculoRepository.buscarPorId(id_vehiculo);

    if (!vehiculo) {
        const error = new Error("Vehículo no encontrado");
        error.status = 404;
        throw error;
    }

    if (usuario.rol === "administrador") {
        return vehiculo;
    }

    if (
        usuario.rol === "cliente" &&
        usuario.id_usuario === vehiculo.id_usuario
    ) {
        return vehiculo;
    }

    const error = new Error("No tiene permiso para acceder a este vehículo");
    error.status = 403;
    throw error;
}

module.exports = {
    listarVehiculos,
    verificarAcceso
};