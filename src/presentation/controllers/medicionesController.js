const medicionesService = require("../../application/medicionesService");

async function obtenerMedicionActual(req, res, next) {

    try {

        const usuario = req.usuario;
        const id_vehiculo = Number(req.params.id);

        if (!Number.isSafeInteger(id_vehiculo) || id_vehiculo <= 0) {
            return res.status(400).json({
                mensaje: "Identificador de vehículo inválido"
            });
        }

        const medicion = await medicionesService.obtenerMedicionActual(
            usuario,
            id_vehiculo
        );

        return res.status(200).json(medicion);

    } catch (error) {
        next(error);
    }
}

async function obtenerHistorial(req, res, next) {

    try {

        const usuario = req.usuario;
        const id_vehiculo = Number(req.params.id);
        const { inicio, fin } = req.query;

        if (!Number.isSafeInteger(id_vehiculo) || id_vehiculo <= 0) {
            return res.status(400).json({
                mensaje: "Identificador de vehículo inválido"
            });
        }

        const historial = await medicionesService.obtenerHistorial(
            usuario,
            id_vehiculo,
            inicio,
            fin
        );

        return res.status(200).json(historial);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerMedicionActual,
    obtenerHistorial
};