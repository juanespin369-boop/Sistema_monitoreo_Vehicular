const alertaService = require("../../application/alertaService");

async function obtenerAlertas(req, res, next) {

    try {

        const usuario = req.usuario;
        const id_vehiculo = Number(req.params.id);

        if (!Number.isSafeInteger(id_vehiculo) || id_vehiculo <= 0) {
            return res.status(400).json({
                mensaje: "Identificador de vehículo inválido"
            });
        }

        const alertas = await alertaService.obtenerAlertas(
            usuario,
            id_vehiculo
        );

        return res.status(200).json(alertas);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerAlertas
};