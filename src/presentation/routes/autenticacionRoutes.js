const express = require("express");
const autenticacionController = require("../controllers/autenticacionController");

const router = express.Router();

router.post("/login", autenticacionController.iniciarSesion);

module.exports = router;
