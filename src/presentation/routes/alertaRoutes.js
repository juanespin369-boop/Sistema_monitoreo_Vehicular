const express = require("express");
const alertaController = require("../controllers/alertaController");
const { verificarToken } = require("../middlewares/autenticacionMiddleware");

const router = express.Router();

router.get(
    "/vehiculos/:id/alertas",
    verificarToken,
    alertaController.obtenerAlertas
);

module.exports = router;