const express = require("express");
const path = require("path");
const fs = require("fs");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");

const autenticacionRoutes = require("./presentation/routes/autenticacionRoutes");
const vehiculoRoutes = require("./presentation/routes/vehiculoRoutes");
const medicionesRoutes = require("./presentation/routes/medicionesRoutes");
const alertaRoutes = require("./presentation/routes/alertaRoutes");

const { manejarError } = require("./presentation/middlewares/errorMiddleware");

const app = express();

// Leer el contrato OpenAPI
const archivoOpenAPI = fs.readFileSync(
    path.join(__dirname, "../docs/openapi.yaml"),
    "utf8"
);

const documentoOpenAPI = YAML.parse(archivoOpenAPI);

// Middlewares
app.use(express.json());

app.use(express.static(
    path.join(__dirname, "../public")
));

// Documentación Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(documentoOpenAPI)
);

// Rutas de la API
app.use("/api", autenticacionRoutes);
app.use("/api", vehiculoRoutes);
app.use("/api", medicionesRoutes);
app.use("/api", alertaRoutes);

// Rutas inexistentes
app.use((req, res) => {
    return res.status(404).json({
        mensaje: "Ruta no encontrada"
    });
});

// Manejo de errores
app.use(manejarError);

module.exports = app;