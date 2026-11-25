const express = require("express");
const vehiculoController = require("../controllers/vehiculoController");
const { verificarToken } = require("../middlewares/autenticacionMiddleware");

const router = express.Router();

router.get(
    "/vehiculos",
    verificarToken,
    vehiculoController.listarVehiculos
);

module.exports = router;