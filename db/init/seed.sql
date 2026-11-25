BEGIN;

-- Registrar usuarios
INSERT INTO usuarios (id_usuario, nombre, correo, password_hash, rol)
VALUES
    (1, 'juan', 'Juan@gmail.com', '$2b$10$PIcEB4YiZG42fPNaZq371OmZNkvQ33QVS4mIUv.H0knHMbtIsZIpG', 'administrador'),
    (2, 'ariadna', 'ariadna@gmail.com', '$2b$10$Ui1.vg67ycECWjCG3QYKl.2k/O4MfHZnt9JpFT4hSPUi0ElkiiIBq', 'cliente'),
    (3, 'rafaella', 'rafaella@gmail.com', '$2b$10$JU9EQvydcfOsRQgtpluFL.7qtNBc/mTb0F4Hz7VaGp/L5svRp47uC', 'cliente');

-- Registrar vehículos
INSERT INTO vehiculos (id_vehiculo, id_usuario, marca, modelo, placa)
VALUES
    (1, 1, 'Toyota', 'Corolla', 'DEMO-001'),
    (2, 2, 'Chevrolet', 'D-Max', 'DEMO-002'),
    (3, 3, 'Kia', 'Sportage', 'DEMO-003');

-- Actualizar las secuencias
SELECT setval(
    pg_get_serial_sequence('usuarios', 'id_usuario'),
    (SELECT MAX(id_usuario) FROM usuarios)
);

SELECT setval(
    pg_get_serial_sequence('vehiculos', 'id_vehiculo'),
    (SELECT MAX(id_vehiculo) FROM vehiculos)
);

COMMIT;

