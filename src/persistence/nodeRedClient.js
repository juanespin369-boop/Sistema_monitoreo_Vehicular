async function obtenerMedicion(id_vehiculo) {

    const respuesta = await fetch(
        `${process.env.NODE_RED_URL}/api/vehiculo/${id_vehiculo}`,
        {
            signal: AbortSignal.timeout(3000)
        }
    );

    if (!respuesta.ok) {
        throw new Error(
            `Error al consultar Node-RED: ${respuesta.status}`
        );
    }

    return await respuesta.json();
}

module.exports = {
    obtenerMedicion
};