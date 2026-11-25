
# Sistema Inteligente de Monitoreo Vehicular

## 1. Descripción del proyecto

El Sistema Inteligente de Monitoreo Vehicular permite consultar el estado de vehículos mediante mediciones simuladas en Node-RED, almacenadas en PostgreSQL y procesadas mediante una API REST desarrollada con Node.js y Express.

El sistema permite consultar la temperatura del motor, presión de los cuatro neumáticos, voltaje de batería y nivel de combustible. Además, identifica anomalías, permite consultar el historial de mediciones y controla el acceso a la información mediante roles de usuario.

Proyecto desarrollado para la asignatura de Arquitectura de Software de la Pontificia Universidad Católica del Ecuador (PUCE).

## 2. Objetivo

Desarrollar un sistema de monitoreo vehicular que permita consultar mediciones, identificar anomalías y acceder a información histórica, considerando atributos de calidad como seguridad, confiabilidad y modificabilidad.

## 3. Casos de uso principales

| Código | Caso de uso | Descripción |
|---|---|---|
| CU-01 | Consultar estado actual | Permite consultar las últimas mediciones registradas de un vehículo. |
| CU-02 | Identificar anomalías | Permite identificar mediciones fuera de los rangos establecidos y fallos de comunicación. |
| CU-03 | Consultar historial | Permite consultar las mediciones almacenadas dentro de un rango de fechas. |

## 4. Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| Node.js | Entorno de ejecución del backend. |
| Express | Implementación de la API REST. |
| JavaScript | Lenguaje de programación. |
| PostgreSQL | Almacenamiento de usuarios, vehículos y mediciones. |
| Node-RED | Simulación de mediciones vehiculares. |
| JWT | Autenticación y control de acceso. |
| bcrypt | Hash y verificación de contraseñas. |
| OpenAPI 3.0.3 | Documentación del contrato de API. |
| Swagger UI | Visualización y ejecución de operaciones HTTP. |
| Jest | Ejecución de pruebas automatizadas. |
| Git y GitHub | Control de versiones. |
| HTML, CSS y JavaScript | Tecnologías previstas para la interfaz web. |

## 5. Arquitectura del sistema

El sistema utiliza una arquitectura monolítica organizada en tres capas.

### Presentation

Responsable de recibir solicitudes HTTP, validar parámetros, verificar tokens de autenticación y devolver respuestas al cliente.

### Application

Responsable de coordinar los casos de uso, aplicar las reglas de negocio, verificar permisos y detectar anomalías.

### Persistence

Responsable de acceder a PostgreSQL y obtener las mediciones simuladas mediante la API interna de Node-RED.

### Flujo de una solicitud

Cliente HTTP / Swagger UI
        |
        v
Presentation
        |
        v
Application
        |
        v
Persistence
        |
        v
PostgreSQL

Node-RED funciona como un servicio externo encargado de generar las mediciones simuladas.

El backend consulta periódicamente las mediciones de Node-RED y las almacena en PostgreSQL, independientemente de las solicitudes realizadas por los usuarios.

## 6. Estructura del proyecto

```text
Sistema_monitoreo_Vehicular/
├── db/
│   └── init/
│       ├── schema.sql
│       └── seed.sql
├── docs/
│   ├── openapi.yaml
│   └── bitacora.md
├── node-red/
│   └── flows.json
├── public/
│   ├── assets/
│   └── index.html
├── src/
│   ├── application/
│   │   ├── autenticacionService.js
│   │   ├── vehiculoService.js
│   │   ├── medicionesService.js
│   │   └── alertaService.js
│   ├── persistence/
│   │   ├── database.js
│   │   ├── usuarioRepository.js
│   │   ├── vehiculoRepository.js
│   │   ├── medicionesRepository.js
│   │   └── nodeRedClient.js
│   ├── presentation/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   ├── app.js
│   └── server.js
├── test/
│   ├── autenticacion.test.js
│   ├── vehiculos.test.js
│   ├── mediciones.test.js
│   └── alertas.test.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 7. Requisitos previos

- Node.js (versión utilizada durante el desarrollo: 24.13.1).
- npm.
- PostgreSQL.
- pgAdmin 4 o un cliente SQL equivalente.
- Node-RED.
- Git.

## 8. Instalación y configuración

### 8.1. Clonar el repositorio

```bash
git clone https://github.com/juanespin369-boop/Sistema_monitoreo_Vehicular.git

cd Sistema_monitoreo_Vehicular
```

### 8.2. Instalar las dependencias

```bash
npm ci
```

### 8.3. Configurar las variables de entorno

Crear un archivo `.env` a partir de `.env.example`.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=monitoreo_vehicular
DB_USER=postgres
DB_PASSWORD=
NODE_RED_URL=http://localhost:1880
JWT_SECRET=
```

Completar DB_PASSWORD con la contraseña local de PostgreSQL.

Generar una clave JWT mediante el siguiente comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Colocar el resultado en JWT_SECRET.

El archivo `.env` no debe publicarse en GitHub.

### 8.4. Configurar PostgreSQL

Crear la base de datos:

```sql
CREATE DATABASE monitoreo_vehicular;
```

Conectarse a la base de datos creada y ejecutar los siguientes archivos en orden:

1. `db/init/schema.sql`
2. `db/init/seed.sql`

El primer archivo crea las tablas y restricciones necesarias.

El segundo registra los datos iniciales de tres usuarios y tres vehículos.

Las cuentas utilizadas para las pruebas deben contener datos ficticios. Las contraseñas de demostración deben configurarse localmente y sus hashes deben generarse mediante bcrypt.

Para generar un hash de una contraseña de prueba:

```bash
node -e "require('bcrypt').hash('CONTRASENA_DE_PRUEBA', 10).then(console.log)"
```

Sustituir el hash correspondiente en el script de datos iniciales antes de ejecutarlo, si se desea establecer una contraseña de prueba propia.

## 9. Configuración de Node-RED

Si Node-RED no está instalado, ejecutar:

```bash
npm install -g node-red
```

Iniciar Node-RED:

```bash
node-red
```

Acceder al editor:

http://localhost:1880

Importar el archivo:

```text
node-red/flows.json
```

Desde el menú de Node-RED, seleccionar Import, cargar el archivo y presionar Deploy.

El flujo contiene la simulación de tres vehículos con los siguientes identificadores:

- Vehículo 1: Toyota Corolla.
- Vehículo 2: Chevrolet D-Max.
- Vehículo 3: Kia Sportage.

La API interna de Node-RED permite consultar las últimas mediciones simuladas mediante:

```http
GET /api/vehiculo/:id
```

Ejemplo:

```text
http://localhost:1880/api/vehiculo/1
```

Node-RED genera mediciones cada segundo. El backend realiza ciclos de sincronización con un intervalo de cinco segundos después de finalizar cada ciclo.

Las mediciones son simuladas; no se utilizan sensores físicos.

Node-RED debe utilizarse como servicio interno y no exponerse directamente a los usuarios finales.

## 10. Ejecución del sistema

Verificar que PostgreSQL y Node-RED estén ejecutándose.

Desde la raíz del proyecto, iniciar el backend:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:3000
```

Servicios necesarios:

| Servicio | Puerto |
|---|---|
| Express | 3000 |
| Node-RED | 1880 |
| PostgreSQL | 5432 |

## 11. Documentación de la API

El contrato de API está definido mediante OpenAPI 3.0.3 en:

```text
docs/openapi.yaml
```

La documentación interactiva está disponible mediante Swagger UI:

```text
http://localhost:3000/api-docs
```

### Endpoints disponibles

| Método | Endpoint | Descripción | Autenticación |
|---|---|---|---|
| POST | /api/login | Iniciar sesión. | No |
| GET | /api/vehiculos | Consultar vehículos autorizados. | Sí |
| GET | /api/vehiculos/:id/mediciones/actual | Consultar la última medición. | Sí |
| GET | /api/vehiculos/:id/alertas | Consultar anomalías y fallos de comunicación. | Sí |
| GET | /api/vehiculos/:id/historial | Consultar historial por rango de fechas. | Sí |

### Autenticación

Realizar una solicitud POST al endpoint `/api/login` utilizando las credenciales de una cuenta de prueba configurada localmente.

La respuesta contiene un token JWT que debe enviarse en las solicitudes protegidas mediante la cabecera:

```http
Authorization: Bearer TOKEN_JWT
```

En Swagger UI, utilizar el botón Authorize para introducir el token obtenido.

### Consulta del historial

El endpoint de historial requiere los parámetros inicio y fin.

Ejemplo:

```http
GET /api/vehiculos/1/historial?inicio=2026-11-25T00:00:00-05:00&fin=2026-11-25T23:59:59-05:00
```

## 12. Roles y permisos

### Administrador

- Consultar todos los vehículos registrados.
- Consultar las mediciones actuales de todos los vehículos.
- Consultar alertas e historial de todos los vehículos.

### Cliente

- Consultar únicamente su vehículo asignado.
- Consultar las mediciones, alertas e historial de su vehículo.
- No puede acceder a vehículos pertenecientes a otros usuarios.

La autorización se verifica en el backend. Una solicitud a un vehículo ajeno devuelve HTTP 403.

## 13. Reglas de detección de anomalías

| Variable | Condición de alerta |
|---|---|
| Temperatura del motor | Superior a 100 °C. |
| Presión de neumáticos | Inferior a 32 PSI o superior a 35 PSI. |
| Voltaje de batería | Inferior a 12.4 V o superior a 14.5 V. |
| Nivel de combustible | Igual o inferior al 15%. |
| Comunicación | Ausencia de nuevas mediciones durante 15 segundos o más. |

Los rangos corresponden a las reglas establecidas para la simulación del proyecto y no constituyen especificaciones universales de vehículos reales.

Cuando no se reciben nuevas mediciones, el servicio de alertas devuelve:

```json
[
    {
        "tipo": "comunicacion",
        "mensaje": "No se reciben nuevas mediciones"
    }
]
```

La alerta se evalúa al consultar el endpoint correspondiente.

## 14. Atributos de calidad

### Seguridad

- Autenticación mediante JWT.
- Contraseñas almacenadas mediante hashes bcrypt.
- Control de acceso basado en roles y propiedad del vehículo.
- Consultas SQL parametrizadas.
- Protección de variables de entorno mediante `.gitignore`.

### Confiabilidad

- Almacenamiento periódico de mediciones.
- Detección de ausencia de nuevas mediciones durante 15 segundos.
- Manejo de errores de comunicación con Node-RED.
- Disponibilidad de las últimas mediciones almacenadas en PostgreSQL.

### Modificabilidad

- Separación de responsabilidades en tres capas.
- Organización modular de servicios, controladores y repositorios.
- Contrato de API documentado mediante OpenAPI.
- Pruebas automatizadas de las reglas de aplicación.

## 15. Pruebas automatizadas

Las pruebas unitarias fueron desarrolladas mediante Jest.

Para ejecutarlas:

```bash
npm test
```

Las pruebas utilizan dependencias simuladas mediante mocks, por lo que no requieren mantener PostgreSQL ni Node-RED ejecutándose.

### Resultados registrados

| Archivo | Pruebas exitosas |
|---|---:|
| autenticacion.test.js | 3 |
| vehiculos.test.js | 5 |
| mediciones.test.js | 5 |
| alertas.test.js | 9 |
| Total | 22 |

Resultado registrado el 25 de noviembre de 2026:

```text
Test Suites: 4 passed, 4 total
Tests:       22 passed, 22 total
Time:        0.572 s
```

Las pruebas cubren escenarios exitosos y casos de error relacionados con autenticación, permisos, consulta de mediciones, historial y detección de anomalías.

## 16. Pruebas funcionales

Se realizaron comprobaciones funcionales mediante Swagger UI con Express, PostgreSQL y Node-RED.

| Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|
| Inicio de sesión del administrador | HTTP 200 | Exitoso |
| Consulta de todos los vehículos | HTTP 200 y tres vehículos | Exitoso |
| CU-01: Consultar estado actual | HTTP 200 y última medición | Exitoso |
| CU-02: Identificar anomalías | HTTP 200 y alertas | Exitoso |
| CU-03: Consultar historial | HTTP 200 y registros históricos | Exitoso |
| Inicio de sesión del cliente | HTTP 200 y rol cliente | Exitoso |
| Acceso a un vehículo ajeno | HTTP 403 | Exitoso |
| Ausencia de nuevas mediciones | HTTP 200 y alerta de comunicación | Exitoso |

El umbral de 15 segundos fue comprobado mediante pruebas unitarias. La prueba funcional confirmó la generación de la alerta al detener Node-RED.

## 17. Bitácora de incrementos

El registro de incrementos, cambios, drivers atendidos y resultados de pruebas se encuentra en:

```text
docs/bitacora.md
```

## 18. Estado actual y pendientes

Los tres casos de uso principales se encuentran implementados y fueron comprobados funcionalmente mediante Swagger UI.

Actividades pendientes de validación final:

- Comprobar la recuperación de la comunicación después de reiniciar Node-RED.
- Confirmar individualmente las mediciones de los vehículos 2 y 3.
- Completar las comprobaciones de acceso a historial y alertas con el rol cliente.
- Verificar la importación del flujo exportado de Node-RED.
- Restringir el acceso directo a Node-RED.
- Ejecutar nuevamente las pruebas automatizadas antes de la entrega.

## 19. Repositorio

https://github.com/juanespin369-boop/Sistema_monitoreo_Vehicular

## 20. Información académica

- Universidad: Pontificia Universidad Católica del Ecuador.
- Carrera: Software.
- Asignatura: Arquitectura de Software.
- Actividad: Criterio 2 del RdA 1.
- Proyecto: Sistema Inteligente de Monitoreo Vehicular.
- Versión: 1.0.0.
