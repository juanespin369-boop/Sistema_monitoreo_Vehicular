function manejarError(error, req, res, next) {

    if (res.headersSent) {
        return next(error);
    }

    const status = error.status || 500;

    if (status >= 500) {

        console.error(error);

        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }

    return res.status(status).json({
        mensaje: error.message
    });
}

module.exports = {
    manejarError
};