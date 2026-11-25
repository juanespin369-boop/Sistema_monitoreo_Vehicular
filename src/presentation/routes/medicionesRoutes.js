const express = require("express");
const medicionesController = require("../controllers/medicionesController");
const { verificarToken } = require("../middlewares/autenticacionMiddleware");

const router = express.Router();

router.get(
    "/vehiculos/:id/mediciones/actual",
    verificarToken,
    medicionesController.obtenerMedicionActual
);

router.get(
    "/vehiculos/:id/historial",
    verificarToken,
    medicionesController.obtenerHistorial
);

module.exports = router;