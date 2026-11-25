const pool = require("./database");

async function guardarMedicion(medicion) {

    const resultado = await pool.query(
        `INSERT INTO mediciones (
            id_vehiculo,
            temperatura_motor,
            presion_delantera_izquierda,
            presion_delantera_derecha,
            presion_trasera_izquierda,
            presion_trasera_derecha,
            voltaje_bateria,
            nivel_combustible,
            fecha_medicion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id_vehiculo, fecha_medicion)
        DO NOTHING
        RETURNING *`,
        [
            medicion.vehiculo_id,
            medicion.temperatura_motor,
            medicion.presion_neumaticos.delantero_izquierdo,
            medicion.presion_neumaticos.delantero_derecho,
            medicion.presion_neumaticos.trasero_izquierdo,
            medicion.presion_neumaticos.trasero_derecho,
            medicion.voltaje_bateria,
            medicion.nivel_combustible,
            medicion.timestamp
        ]
    );

    return resultado.rows[0] || null;
}

async function obtenerUltimaMedicion(id_vehiculo) {

    const resultado = await pool.query(
        `SELECT *
         FROM mediciones
         WHERE id_vehiculo = $1
         ORDER BY fecha_medicion DESC
         LIMIT 1`,
        [id_vehiculo]
    );

    return resultado.rows[0] || null;
}

async function obtenerHistorial(id_vehiculo, inicio, fin) {

    const resultado = await pool.query(
        `SELECT *
         FROM mediciones
         WHERE id_vehiculo = $1
         AND fecha_medicion BETWEEN $2 AND $3
         ORDER BY fecha_medicion DESC`,
        [id_vehiculo, inicio, fin]
    );

    return resultado.rows;
}

module.exports = {
    guardarMedicion,
    obtenerUltimaMedicion,
    obtenerHistorial
};