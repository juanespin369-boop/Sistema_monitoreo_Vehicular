const medicionesRepository = require("../persistence/medicionesRepository");
const vehiculoRepository = require("../persistence/vehiculoRepository");
const nodeRedClient = require("../persistence/nodeRedClient");
const vehiculoService = require("./vehiculoService");

// Consultar la última medición
async function obtenerMedicionActual(usuario, id_vehiculo) {

    await vehiculoService.verificarAcceso(usuario, id_vehiculo);

    const medicion = await medicionesRepository.obtenerUltimaMedicion(
        id_vehiculo
    );

    if (!medicion) {
        const error = new Error("No existen mediciones para este vehículo");
        error.status = 404;
        throw error;
    }

    return medicion;
}

// Consultar el historial de mediciones
async function obtenerHistorial(usuario, id_vehiculo, inicio, fin) {

    await vehiculoService.verificarAcceso(usuario, id_vehiculo);

    if (
        !inicio ||
        !fin ||
        isNaN(Date.parse(inicio)) ||
        isNaN(Date.parse(fin)) ||
        new Date(inicio) > new Date(fin)
    ) {
        const error = new Error("Rango de fechas inválido");
        error.status = 400;
        throw error;
    }

    return await medicionesRepository.obtenerHistorial(
        id_vehiculo,
        inicio,
        fin
    );
}

// Obtener y almacenar las mediciones de Node-RED
async function sincronizarMediciones() {

    const vehiculos = await vehiculoRepository.listarVehiculos();

    for (const vehiculo of vehiculos) {

        try {
            const medicion = await nodeRedClient.obtenerMedicion(
                vehiculo.id_vehiculo
            );

            if (medicion.vehiculo_id !== vehiculo.id_vehiculo) {
                throw new Error("Identificador de vehículo incorrecto");
            }

            await medicionesRepository.guardarMedicion(medicion);

        } catch (error) {
            console.error(
                `Error al sincronizar vehículo ${vehiculo.id_vehiculo}:`,
                error.message
            );
        }
    }
}

module.exports = {
    obtenerMedicionActual,
    obtenerHistorial,
    sincronizarMediciones
};