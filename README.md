# Sistema de Reservas de Restaurante

Un sistema completo de gestión de reservas para restaurantes con un CRUD para administrar comensales, mesas y reservas. Desarrollado con Vue.js (TypeScript) en el frontend y Laravel en el backend, contenido en Docker para facilitar su despliegue.

## Descripción del Proyecto

Este proyecto implementa un sistema de reservas para restaurantes que permite:
- Gestionar información de comensales
- Administrar las mesas disponibles
- Crear y gestionar reservas

La aplicación está estructurada en tres componentes principales:
- Frontend desarrollado en Vue.js con TypeScript
- Backend API RESTful desarrollado en Laravel
- Entorno de contenedores Docker para desarrollo y despliegue

## Requisitos Previos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistema-reservas-restaurante.git
cd sistema-reservas-restaurante
```

### 2. Iniciar los contenedores Docker

```bash
docker-compose up -d
```

Este comando iniciará los siguientes servicios:
- Servidor web (Nginx) - Puerto 8080
- PHP-FPM para ejecutar Laravel
- MySQL - Puerto 3306
- phpMyAdmin - Puerto 8090

### 3. Configurar el Backend (Laravel)

```bash
# Entrar al contenedor de Composer para instalar dependencias
docker-compose run --rm composer install

# Copiar archivo de variables de entorno
docker-compose run --rm php cp .env.example .env

# Generar clave de aplicación
docker-compose run --rm artisan key:generate

# Ejecutar migraciones
docker-compose run --rm artisan migrate

# Cargar datos de prueba
docker-compose run --rm artisan db:seed
```

### 4. Configurar el Frontend (Vue.js)

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

```
sistema-reservas-restaurante/
├── backend/                  # Código del backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # Controladores para comensales, mesas y reservas
│   │   ├── Models/           # Modelos para comensales, mesas y reservas
│   │   └── Resources/        # Recursos API para transformación de datos
│   ├── database/
│   │   ├── migrations/       # Migraciones para crear las tablas
│   │   └── seeders/         # Seeders para datos de prueba
│   └── routes/
│       └── api.php          # Definición de rutas API
├── frontend/                 # Código del frontend Vue.js
│   ├── src/
│   │   ├── components/       # Componentes Vue
│   │   ├── views/            # Vistas de la aplicación
│   │   └── services/         # Servicios para comunicación con API
│   └── package.json          # Dependencias del frontend
├── docker/                   # Configuración de Docker
│   ├── dockerfiles/          # Archivos Dockerfile
│   └── nginx/                # Configuración de Nginx
└── docker-compose.yml        # Definición de servicios Docker
```

## Acceso a la Aplicación

- **Frontend**: Acceda a la aplicación en [http://localhost:8080](http://localhost:8080)
- **API Backend**: Las rutas API están disponibles en [http://localhost:8080/api](http://localhost:8080/api)
- **phpMyAdmin**: Gestión de base de datos en [http://localhost:8090](http://localhost:8090)
  - Usuario: root
  - Contraseña: root.pa55

## API Reference

### Comensales

#### Obtener todos los comensales

```http
GET /api/comensales
```

#### Obtener un comensal

```http
GET /api/comensales/{id}
```

#### Crear un comensal

```http
POST /api/comensales
```

| Parámetro | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| `nombre`  | `string` | **Requerido**. Nombre del comensal |
| `email`   | `string` | **Requerido**. Email del comensal |
| `telefono`| `string` | **Requerido**. Teléfono de contacto |

#### Actualizar un comensal

```http
PUT /api/comensales/{id}
```

#### Eliminar un comensal

```http
DELETE /api/comensales/{id}
```

### Mesas

#### Obtener todas las mesas

```http
GET /api/mesas
```

#### Obtener una mesa

```http
GET /api/mesas/{id}
```

#### Crear una mesa

```http
POST /api/mesas
```

| Parámetro | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| `numero`  | `integer`| **Requerido**. Número de la mesa |
| `capacidad`| `integer`| **Requerido**. Capacidad de comensales |
| `ubicacion`| `string`| Ubicación de la mesa en el restaurante |

#### Actualizar una mesa

```http
PUT /api/mesas/{id}
```

#### Eliminar una mesa

```http
DELETE /api/mesas/{id}
```

### Reservas

#### Obtener todas las reservas

```http
GET /api/reservas
```

#### Obtener una reserva

```http
GET /api/reservas/{id}
```

#### Crear una reserva

```http
POST /api/reservas
```

| Parámetro | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| `comensal_id`| `integer`| **Requerido**. ID del comensal |
| `mesa_id`| `integer`| **Requerido**. ID de la mesa |
| `fecha`| `date`| **Requerido**. Fecha de la reserva (YYYY-MM-DD) |
| `hora`| `time`| **Requerido**. Hora de la reserva (HH:MM) |
| `num_personas`| `integer`| **Requerido**. Número de personas |
| `observaciones`| `string`| Observaciones adicionales |

#### Actualizar una reserva

```http
PUT /api/reservas/{id}
```

#### Eliminar una reserva

```http
DELETE /api/reservas/{id}
```

## Comandos Útiles

### Comandos Docker

```bash
# Ver los contenedores en ejecución
docker-compose ps

# Detener todos los contenedores
docker-compose down

# Reiniciar todos los contenedores
docker-compose restart

# Ver logs de los contenedores
docker-compose logs -f
```

### Comandos Laravel (a través de Artisan)

```bash
# Ejecutar migraciones
docker-compose run --rm artisan migrate

# Revertir migraciones
docker-compose run --rm artisan migrate:rollback

# Recrear la base de datos
docker-compose run --rm artisan migrate:fresh --seed

# Limpiar caché
docker-compose run --rm artisan cache:clear
```

### Comandos Vue.js

```bash
# Compilar para producción
cd frontend
npm run build
```

## Solución de Problemas Comunes

### Problemas de permisos

Si encuentra problemas de permisos en Laravel:

```bash
# Ajustar permisos en el directorio del backend
docker-compose run --rm php chmod -R 777 storage bootstrap/cache
```

### Problemas de conexión a la base de datos

Verifique que:
1. El servicio MySQL esté funcionando (`docker-compose ps`)
2. Las credenciales en el archivo `.env` coincidan con las del `docker-compose.yml`
3. La base de datos haya sido creada correctamente

## Contribuciones

Las contribuciones son bienvenidas. Por favor, siga estos pasos:

1. Fork el repositorio
2. Cree una rama para su característica (`git checkout -b feature/nueva-caracteristica`)
3. Haga commit de sus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haga push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abra un Pull Request

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

## Contacto

Si tiene alguna pregunta o sugerencia, por favor contacte con el equipo de desarrollo.
