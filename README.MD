# API REST - Lista de Tareas

Trabajo práctico integrador del módulo Node.js — BootCamp 5.0.

API REST para gestionar tareas, con registro y login de usuarios. Cada usuario ve y edita solo sus propias tareas, y solo un usuario `admin` puede eliminarlas.

## Tecnologías

- Node.js + Express + TypeScript
- MongoDB Atlas + Mongoose
- Bcrypt (hash de contraseñas) y JSON Web Token (autenticación)
- dotenv (variables de entorno)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Valentin277278/tp-api-tareas.git
   cd tp-api-tareas
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en la raíz, copiando `.env.example` y completando los valores:

   | Variable | Descripción |
   |---|---|
   | `PORT` | Puerto del servidor (por ejemplo `3000`) |
   | `MONGO_URI` | Cadena de conexión de MongoDB Atlas |
   | `JWT_SECRET` | Clave secreta para firmar los tokens |
   | `JWT_EXPIRES_IN` | Duración del token (por ejemplo `1h`) |

## Ejecución

| Comando | Descripción |
|---|---|
| `npm run dev` | Modo desarrollo (se reinicia al guardar) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta la versión compilada |

El servidor queda en `http://localhost:3000`.

## Estructura del proyecto

```
src/
├── app.ts                  # Configuración de Express y rutas
├── server.ts               # Punto de entrada: conecta la DB y levanta el servidor
├── config/                 # Variables de entorno y conexión a MongoDB
├── middlewares/            # auth (JWT), role (admin) y logger
├── utils/                  # Manejo de errores HTTP
└── components/
    ├── tasks/              # model · repository · service · controller · routes
    └── users/              # model · repository · service · controller · routes
```

Cada componente sigue una arquitectura en capas: **rutas → controlador → servicio → acceso a datos (repository)**.

## Endpoints

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Registra un usuario |
| POST | `/api/auth/login` | — | Devuelve un token JWT |

### Tareas

Todas requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/api/tasks` | user | Lista las tareas del usuario |
| GET | `/api/tasks/:id` | user | Obtiene una tarea propia |
| POST | `/api/tasks` | user | Crea una tarea |
| PUT | `/api/tasks/:id` | user | Modifica una tarea propia |
| DELETE | `/api/tasks/:id` | admin | Elimina una tarea |

**Filtros** (query params en `GET /api/tasks`):
- `?priority=low|medium|high`
- `?completed=true|false`

Ejemplo: `GET /api/tasks?priority=high&completed=false`

### Ejemplo de body para crear una tarea

```json
{
  "title": "Estudiar Node",
  "priority": "high",
  "dueDate": "2026-12-01"
}
```

## Validaciones de negocio

- El título es obligatorio y debe tener al menos 3 caracteres.
- La prioridad solo puede ser `low`, `medium` o `high`.
- La fecha límite debe ser válida y no puede ser anterior a hoy.
- No se puede registrar dos veces el mismo email, y la contraseña debe tener al menos 6 caracteres.

## Códigos de estado

| Código | Cuándo |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado (registro, nueva tarea) |
| 400 | Datos inválidos o id con formato incorrecto |
| 401 | Falta el token, es inválido o las credenciales son incorrectas |
| 403 | El usuario no tiene permisos (eliminar sin ser admin) |
| 404 | Tarea o ruta no encontrada |
| 500 | Error interno del servidor |

## Extras implementados

- **Filtros** con `req.query` (`priority`, `completed`).
- **Roles**: solo un usuario `admin` puede eliminar tareas.
- **Relación entre modelos**: cada tarea pertenece al usuario que la creó y cada uno ve solo las suyas.
- **Middleware de logging**: muestra en consola el método y la URL de cada petición.

### Cómo crear un usuario admin

Por seguridad no hay un endpoint para asignar roles. Registrar un usuario y luego, en MongoDB Atlas, cambiar su campo `role` de `"user"` a `"admin"`. Después hay que volver a hacer login para obtener un token con el rol actualizado.

## Pruebas

La colección de Thunder Client está en `thunder-tests/`. Incluye todos los endpoints y los casos de error (400, 401, 403 y 404).

Para importarla: Thunder Client → Collections → `⋯` → Import.