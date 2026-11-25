jest.mock("../src/persistence/medicionesRepository");
jest.mock("../src/application/vehiculoService");

const medicionesRepository = require("../src/persistence/medicionesRepository");
const vehiculoService = require("../src/application/vehiculoService");
const alertaService = require("../src/application/alertaService");

describe("Servicio de alertas", () => {

    const cliente = {
        id_usuario: 2,
        rol: "cliente"
    };

    let medicion;

    beforeEach(() => {

        jest.resetAllMocks();

        jest.useFakeTimers();

        jest.setSystemTime(
            new Date("2026-11-25T19:00:00.000Z")
        );

        vehiculoService.verificarAcceso.mockResolvedValue({
            id_vehiculo: 1,
            id_usuario: 2
        });

        medicion = {
            id_medicion: "1",
            id_vehiculo: 1,
            temperatura_motor: "95.00",
            presion_delantera_izquierda: "33.00",
            presion_delantera_derecha: "33.00",
            presion_trasera_izquierda: "33.00",
            presion_trasera_derecha: "33.00",
            voltaje_bateria: "13.50",
            nivel_combustible: "80.00",
            fecha_medicion: new Date().toISOString()
        };

    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test("No debe generar alertas cuando las mediciones son normales", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toEqual([]);
    });

    test("Debe detectar una temperatura elevada del motor", async () => {

        medicion.temperatura_motor = "105.00";

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "temperatura",
            mensaje: "Temperatura del motor elevada"
        });
    });

    test("Debe detectar una presión fuera de rango", async () => {

        medicion.presion_delantera_izquierda = "29.00";

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "presion",
            mensaje: "Presión fuera de rango: Delantero izquierdo"
        });
    });

    test("Debe detectar un voltaje de batería fuera de rango", async () => {

        medicion.voltaje_bateria = "11.50";

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "bateria",
            mensaje: "Voltaje de batería fuera de rango"
        });
    });

    test("Debe detectar un nivel bajo de combustible", async () => {

        medicion.nivel_combustible = "10.00";

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "combustible",
            mensaje: "Nivel de combustible bajo"
        });
    });

    test("No debe generar una alerta de comunicación antes de los 15 segundos", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        jest.advanceTimersByTime(14999);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toEqual([]);
    });

    test("Debe generar una alerta después de 15 segundos sin mediciones", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        jest.advanceTimersByTime(15000);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "comunicacion",
            mensaje: "No se reciben nuevas mediciones"
        });
    });

    test("Debe generar una alerta cuando no existen mediciones", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(null);

        const resultado = await alertaService.obtenerAlertas(
            cliente,
            1
        );

        expect(resultado).toContainEqual({
            tipo: "comunicacion",
            mensaje: "No se reciben nuevas mediciones"
        });
    });

    test("Debe impedir consultar alertas de un vehículo ajeno", async () => {

        const error = new Error(
            "No tiene permiso para acceder a este vehículo"
        );

        error.status = 403;

        vehiculoService.verificarAcceso.mockRejectedValue(error);

        await expect(
            alertaService.obtenerAlertas(cliente, 2)
        ).rejects.toMatchObject({
            status: 403
        });

        expect(medicionesRepository.obtenerUltimaMedicion)
            .not.toHaveBeenCalled();
    });

});