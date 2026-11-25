jest.mock("../src/persistence/usuarioRepository");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioRepository = require("../src/persistence/usuarioRepository");
const autenticacionService = require("../src/application/autenticacionService");

describe("Servicio de autenticación", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "clave_exclusiva_para_tests";
    });

    test("Debe iniciar sesión con credenciales correctas", async () => {

        const passwordHash = await bcrypt.hash("Cliente123", 4);

        usuarioRepository.buscarPorCorreo.mockResolvedValue({
            id_usuario: 2,
            nombre: "Cliente 1",
            correo: "cliente1@example.com",
            password_hash: passwordHash,
            rol: "cliente"
        });

        const resultado = await autenticacionService.iniciarSesion(
            "cliente1@example.com",
            "Cliente123"
        );

        expect(resultado).not.toBeNull();
        expect(resultado.token).toBeDefined();
        expect(resultado.usuario.rol).toBe("cliente");
        expect(resultado.usuario.password_hash).toBeUndefined();

        const token = jwt.verify(
            resultado.token,
            process.env.JWT_SECRET
        );

        expect(token.id_usuario).toBe(2);
        expect(token.rol).toBe("cliente");
    });

    test("Debe rechazar una contraseña incorrecta", async () => {

        const passwordHash = await bcrypt.hash("Cliente123", 4);

        usuarioRepository.buscarPorCorreo.mockResolvedValue({
            id_usuario: 2,
            nombre: "Cliente 1",
            correo: "cliente1@example.com",
            password_hash: passwordHash,
            rol: "cliente"
        });

        const resultado = await autenticacionService.iniciarSesion(
            "cliente1@example.com",
            "PasswordIncorrecta"
        );

        expect(resultado).toBeNull();
    });

    test("Debe rechazar un usuario inexistente", async () => {

        usuarioRepository.buscarPorCorreo.mockResolvedValue(null);

        const resultado = await autenticacionService.iniciarSesion(
            "inexistente@example.com",
            "Cliente123"
        );

        expect(resultado).toBeNull();
    });

});