CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL
        CHECK (rol IN ('administrador', 'cliente'))
);

CREATE TABLE IF NOT EXISTS vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    placa VARCHAR(15) UNIQUE NOT NULL,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS mediciones (
    id_medicion BIGSERIAL PRIMARY KEY,
    id_vehiculo INT NOT NULL,
    temperatura_motor NUMERIC(5,2) NOT NULL,
    presion_delantera_izquierda NUMERIC(5,2) NOT NULL,
    presion_delantera_derecha NUMERIC(5,2) NOT NULL,
    presion_trasera_izquierda NUMERIC(5,2) NOT NULL,
    presion_trasera_derecha NUMERIC(5,2) NOT NULL,
    voltaje_bateria NUMERIC(5,2) NOT NULL,
    nivel_combustible NUMERIC(5,2) NOT NULL
        CHECK (nivel_combustible BETWEEN 0 AND 100),
    fecha_medicion TIMESTAMPTZ NOT NULL,

    FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculos(id_vehiculo)
        ON DELETE RESTRICT,

    UNIQUE (id_vehiculo, fecha_medicion)
);


