const medicionesRepository = require("../persistence/medicionesRepository");
const vehiculoService = require("./vehiculoService");

const TIEMPO_MAXIMO = 15000;

async function obtenerAlertas(usuario, id_vehiculo) {

    await vehiculoService.verificarAcceso(usuario, id_vehiculo);

    const medicion = await medicionesRepository.obtenerUltimaMedicion(
        id_vehiculo
    );

    const alertas = [];

    // Comprobar si existen mediciones
    if (!medicion) {
        alertas.push({
            tipo: "comunicacion",
            mensaje: "No se reciben nuevas mediciones"
        });

        return alertas;
    }

    // Comprobar el tiempo de la última medición
    const tiempoTranscurrido =
        Date.now() - new Date(medicion.fecha_medicion).getTime();

    if (tiempoTranscurrido >= TIEMPO_MAXIMO) {
        alertas.push({
            tipo: "comunicacion",
            mensaje: "No se reciben nuevas mediciones"
        });

        return alertas;
    }

    // Temperatura del motor
    if (medicion.temperatura_motor > 100) {
        alertas.push({
            tipo: "temperatura",
            mensaje: "Temperatura del motor elevada"
        });
    }

    // Presión de los neumáticos
    const neumaticos = {
        "Delantero izquierdo": medicion.presion_delantera_izquierda,
        "Delantero derecho": medicion.presion_delantera_derecha,
        "Trasero izquierdo": medicion.presion_trasera_izquierda,
        "Trasero derecho": medicion.presion_trasera_derecha
    };

    for (const [nombre, presion] of Object.entries(neumaticos)) {

        if (presion < 32 || presion > 35) {
            alertas.push({
                tipo: "presion",
                mensaje: `Presión fuera de rango: ${nombre}`
            });
        }
    }

    // Voltaje de la batería
    if (medicion.voltaje_bateria < 12.4 ||
        medicion.voltaje_bateria > 14.5) {

        alertas.push({
            tipo: "bateria",
            mensaje: "Voltaje de batería fuera de rango"
        });
    }

    // Nivel de combustible
    if (medicion.nivel_combustible <= 15) {
        alertas.push({
            tipo: "combustible",
            mensaje: "Nivel de combustible bajo"
        });
    }

    return alertas;
}

module.exports = {
    obtenerAlertas
};