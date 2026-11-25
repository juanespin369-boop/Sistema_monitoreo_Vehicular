jest.mock("../src/persistence/medicionesRepository");
jest.mock("../src/persistence/vehiculoRepository");
jest.mock("../src/persistence/nodeRedClient");
jest.mock("../src/application/vehiculoService");

const medicionesRepository = require("../src/persistence/medicionesRepository");
const vehiculoService = require("../src/application/vehiculoService");
const medicionesService = require("../src/application/medicionesService");

describe("Servicio de mediciones", () => {

    const cliente = {
        id_usuario: 2,
        rol: "cliente"
    };

    const medicion = {
        id_medicion: "1",
        id_vehiculo: 1,
        temperatura_motor: "95.50",
        presion_delantera_izquierda: "32.50",
        presion_delantera_derecha: "33.20",
        presion_trasera_izquierda: "32.80",
        presion_trasera_derecha: "34.10",
        voltaje_bateria: "13.20",
        nivel_combustible: "85.50",
        fecha_medicion: "2026-11-25T19:00:00.000Z"
    };

    beforeEach(() => {
        jest.resetAllMocks();

        vehiculoService.verificarAcceso.mockResolvedValue({
            id_vehiculo: 1,
            id_usuario: 2
        });
    });

    test("Debe obtener la última medición del vehículo", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(medicion);

        const resultado = await medicionesService.obtenerMedicionActual(
            cliente,
            1
        );

        expect(resultado).toEqual(medicion);

        expect(vehiculoService.verificarAcceso)
            .toHaveBeenCalledWith(cliente, 1);

        expect(medicionesRepository.obtenerUltimaMedicion)
            .toHaveBeenCalledWith(1);
    });

    test("Debe devolver un error si no existen mediciones", async () => {

        medicionesRepository.obtenerUltimaMedicion
            .mockResolvedValue(null);

        await expect(
            medicionesService.obtenerMedicionActual(cliente, 1)
        ).rejects.toMatchObject({
            status: 404,
            message: "No existen mediciones para este vehículo"
        });
    });

    test("Debe obtener el historial dentro de un rango válido", async () => {

        const inicio = "2026-11-25T00:00:00Z";
        const fin = "2026-11-25T23:59:59Z";

        medicionesRepository.obtenerHistorial
            .mockResolvedValue([medicion]);

        const resultado = await medicionesService.obtenerHistorial(
            cliente,
            1,
            inicio,
            fin
        );

        expect(resultado).toHaveLength(1);
        expect(resultado[0]).toEqual(medicion);

        expect(medicionesRepository.obtenerHistorial)
            .toHaveBeenCalledWith(1, inicio, fin);
    });

    test("Debe rechazar un rango de fechas inválido", async () => {

        const inicio = "2026-11-26T00:00:00Z";
        const fin = "2026-11-25T23:59:59Z";

        await expect(
            medicionesService.obtenerHistorial(
                cliente,
                1,
                inicio,
                fin
            )
        ).rejects.toMatchObject({
            status: 400,
            message: "Rango de fechas inválido"
        });

        expect(medicionesRepository.obtenerHistorial)
            .not.toHaveBeenCalled();
    });

    test("Debe impedir la consulta de mediciones de un vehículo ajeno", async () => {

        const error = new Error(
            "No tiene permiso para acceder a este vehículo"
        );

        error.status = 403;

        vehiculoService.verificarAcceso.mockRejectedValue(error);

        await expect(
            medicionesService.obtenerMedicionActual(cliente, 2)
        ).rejects.toMatchObject({
            status: 403
        });

        expect(medicionesRepository.obtenerUltimaMedicion)
            .not.toHaveBeenCalled();
    });

});