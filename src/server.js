require("dotenv").config();

const app = require("./app");
const medicionesService = require("./application/medicionesService");

const PORT = process.env.PORT || 3000;
const INTERVALO = 5000;

// Sincronización automática de mediciones
async function sincronizar() {

    try {

        await medicionesService.sincronizarMediciones();

    } catch (error) {

        console.error(
            "Error durante la sincronización:",
            error.message
        );

    } finally {

        setTimeout(sincronizar, INTERVALO);

    }
}

// Levantar servidor
app.listen(PORT, () => {

    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    sincronizar();

});