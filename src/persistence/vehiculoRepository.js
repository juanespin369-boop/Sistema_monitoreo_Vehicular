const pool = require("./database");

async function listarVehiculos() {

    const resultado = await pool.query(
        `SELECT id_vehiculo, id_usuario, marca, modelo, placa
         FROM vehiculos
         ORDER BY id_vehiculo`
    );

    return resultado.rows;
}

async function buscarPorId(id_vehiculo) {

    const resultado = await pool.query(
        `SELECT id_vehiculo, id_usuario, marca, modelo, placa
         FROM vehiculos
         WHERE id_vehiculo = $1`,
        [id_vehiculo]
    );

    return resultado.rows[0] || null;
}

async function buscarPorUsuario(id_usuario) {

    const resultado = await pool.query(
        `SELECT id_vehiculo, id_usuario, marca, modelo, placa
         FROM vehiculos
         WHERE id_usuario = $1`,
        [id_usuario]
    );

    return resultado.rows[0] || null;
}

module.exports = {
    listarVehiculos,
    buscarPorId,
    buscarPorUsuario
};