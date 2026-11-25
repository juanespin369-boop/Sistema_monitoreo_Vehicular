const pool = require("./database");

async function buscarPorCorreo(correo) {

    const resultado = await pool.query(
        `SELECT id_usuario, nombre, correo, password_hash, rol
         FROM usuarios
         WHERE correo = $1`,
        [correo]
    );

    return resultado.rows[0] || null;
}

async function buscarPorId(id_usuario) {

    const resultado = await pool.query(
        `SELECT id_usuario, nombre, correo, rol
         FROM usuarios
         WHERE id_usuario = $1`,
        [id_usuario]
    );

    return resultado.rows[0] || null;
}

module.exports = {
    buscarPorCorreo,
    buscarPorId
};