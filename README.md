# Sistema Inteligente de Monitoreo Vehicular

Sistema web de monitoreo vehicular que permite consultar el estado de tres vehículos mediante mediciones simuladas en Node-RED.

## Objetivo

Monitorear los parámetros de los vehículos, identificar condiciones anómalas y consultar el historial de mediciones mediante una interfaz web.

## Tecnologías

- HTML, CSS y JavaScript: frontend.
- Node.js y Express: backend principal.
- Node-RED: servicio externo de simulación vehicular.
- PostgreSQL: base de datos.
- Jest: pruebas unitarias.
- Swagger/OpenAPI: documentación de la API REST.
- Git y GitHub: control de versiones.

## Parámetros monitoreados

- Temperatura del motor.
- Presión de los cuatro neumáticos.
- Voltaje de la batería.
- Nivel de combustible.

## Roles de usuario

- **Administrador:** puede consultar las mediciones y el historial de todos los vehículos.
- **Cliente:** únicamente puede consultar las mediciones y el historial de su vehículo asignado.

## Arquitectura

El sistema utiliza una arquitectura por capas, separando las responsabilidades de presentación, aplicación, dominio, persistencia e integración con servicios externos.

## Estructura del proyecto

| Directorio | Responsabilidad |
|---|---|
| `db/` | Scripts de inicialización de PostgreSQL. |
| `docs/` | Documentación del proyecto. |
| `frontend/` | Interfaz web. |
| `node-red/` | Flujos de simulación vehicular. |
| `src/application/` | Casos de uso. |
| `src/domain/` | Reglas de negocio. |
| `src/infrastructure/` | Integración con Node-RED. |
| `src/persistence/` | Acceso a PostgreSQL. |
| `src/presentation/` | Rutas, controladores y middleware. |
| `tests/` | Pruebas automatizadas. |

## Estado del proyecto

Actualmente en desarrollo.

Proyecto académico de la asignatura Arquitectura de Software.