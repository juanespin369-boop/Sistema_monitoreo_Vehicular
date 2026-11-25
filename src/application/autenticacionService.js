const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioRepository = require("../persistence/usuarioRepository");

async function iniciarSesion(correo, password) {

    const usuario = await usuarioRepository.buscarPorCorreo(correo);

    if (!usuario) {
        return null;
    }

    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        return null;
    }

    const token = jwt.sign(
        {
            id_usuario: usuario.id_usuario,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        }
    };
}

module.exports = {
    iniciarSesion
};