jest.mock("../src/persistence/vehiculoRepository");

const vehiculoRepository = require("../src/persistence/vehiculoRepository");
const vehiculoService = require("../src/application/vehiculoService");

describe("Servicio de vehículos", () => {

    const administrador = {
        id_usuario: 1,
        rol: "administrador"
    };

    const cliente = {
        id_usuario: 2,
        rol: "cliente"
    };

    const vehiculos = [
        {
            id_vehiculo: 1,
            id_usuario: 2,
            marca: "Toyota",
            modelo: "Corolla",
            placa: "DEMO-001"
        },
        {
            id_vehiculo: 2,
            id_usuario: 3,
            marca: "Chevrolet",
            modelo: "D-Max",
            placa: "DEMO-002"
        },
        {
            id_vehiculo: 3,
            id_usuario: 4,
            marca: "Kia",
            modelo: "Sportage",
            placa: "DEMO-003"
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("El administrador puede consultar todos los vehículos", async () => {

        vehiculoRepository.listarVehiculos.mockResolvedValue(vehiculos);

        const resultado = await vehiculoService.listarVehiculos(
            administrador
        );

        expect(resultado).toHaveLength(3);
        expect(resultado).toEqual(vehiculos);
    });

    test("El cliente solo puede consultar su vehículo asignado", async () => {

        vehiculoRepository.buscarPorUsuario.mockResolvedValue(
            vehiculos[0]
        );

        const resultado = await vehiculoService.listarVehiculos(
            cliente
        );

        expect(resultado).toHaveLength(1);
        expect(resultado[0].id_usuario).toBe(cliente.id_usuario);

        expect(vehiculoRepository.buscarPorUsuario)
            .toHaveBeenCalledWith(cliente.id_usuario);

        expect(vehiculoRepository.listarVehiculos)
            .not.toHaveBeenCalled();
    });

    test("El cliente puede acceder a su propio vehículo", async () => {

        vehiculoRepository.buscarPorId.mockResolvedValue(
            vehiculos[0]
        );

        const resultado = await vehiculoService.verificarAcceso(
            cliente,
            1
        );

        expect(resultado).toEqual(vehiculos[0]);
    });

    test("El cliente no puede acceder a un vehículo ajeno", async () => {

        vehiculoRepository.buscarPorId.mockResolvedValue(
            vehiculos[1]
        );

        await expect(
            vehiculoService.verificarAcceso(cliente, 2)
        ).rejects.toMatchObject({
            status: 403,
            message: "No tiene permiso para acceder a este vehículo"
        });
    });

    test("Debe rechazar la consulta de un vehículo inexistente", async () => {

        vehiculoRepository.buscarPorId.mockResolvedValue(null);

        await expect(
            vehiculoService.verificarAcceso(cliente, 999)
        ).rejects.toMatchObject({
            status: 404,
            message: "Vehículo no encontrado"
        });
    });

});