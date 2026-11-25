const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Token de autenticación requerido"
        });
    }

    const token = authorization.split(" ")[1];

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        req.usuario = usuario;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
}

module.exports = {
    verificarToken
};