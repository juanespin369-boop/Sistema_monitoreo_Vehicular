const vehiculoService = require("../../application/vehiculoService");

async function listarVehiculos(req, res, next) {

    try {

        const usuario = req.usuario;

        const vehiculos = await vehiculoService.listarVehiculos(
            usuario
        );

        return res.status(200).json(vehiculos);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    listarVehiculos
};