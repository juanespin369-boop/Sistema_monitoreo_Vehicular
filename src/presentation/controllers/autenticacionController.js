const autenticacionService = require("../../application/autenticacionService");

async function iniciarSesion(req, res, next) {

    try {

        const { correo, password } = req.body || {};

        if (
            typeof correo !== "string" ||
            typeof password !== "string" ||
            !correo.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: "El correo y la contraseña son obligatorios"
            });
        }

        const resultado = await autenticacionService.iniciarSesion(
            correo,
            password
        );

        if (!resultado) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    iniciarSesion
};