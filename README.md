# Sistema de Reservas de Restaurante

Un sistema básico de reservas para restaurantes con un CRUD para administrar comensales, mesas y reservas. Desarrollado con Vue.js (TypeScript) en el frontend y Laravel en el backend, con el backend contenido en docker.

## Descripción del Proyecto

Este proyecto implementa un sistema de reservas para restaurantes que permite:
- Gestionar información de comensales
- Gestionar información de las mesas
- Crear y gestionar reservas

La aplicación está estructurada en tres componentes principales:
- Frontend desarrollado en Vue.js con TypeScript
- Backend API RESTful desarrollado en Laravel (incluye test unitarios)
- Entorno de contenedores Docker para desarrollo y despliegue

## Requisitos Previos

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)  
- [Git](https://git-scm.com/downloads)  
- [Node.js (incluye npm)](https://nodejs.org/) – Se recomienda instalar la versión **LTS**

> ⚠️ **Nota para usuarios de Windows**:  
> Se recomienda activar [WSL 2 (Windows Subsystem for Linux)](https://learn.microsoft.com/windows/wsl/install) y configurarlo como backend de Docker para un mejor rendimiento y compatibilidad.  
> Puedes instalar WSL directamente desde PowerShell ejecutando:
>
> ```powershell
> wsl --install
> 

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
- phpMyAdmin - Puerto 8090 (en caso no se tuviese un administrador para verificar los registros de la base de datos)

> Aunque el archivo `docker-compose.yml` define **6 servicios**, solo **4 de ellos se ejecutan de forma persistente** al iniciar la aplicación. Los otros 2 (`composer` y `artisan`) se ejecutan solo cuando es necesario.

### 3. Configurar el Backend (Laravel)

```bash
# Entrar al contenedor de Composer para instalar dependencias
docker-compose run --rm composer install

# Copiar los archivos de variables de entorno

# .env (laravel)
copy .\backend\.env.example .\backend\.env

# .env (docker mysql)
copy .\docker\mysql\.env.example .\docker\mysql\.env

# Los .env ya están configurados con credenciales de muestra, 
# no es necesario editarlos a menos que se tenga 
# el puerto 3306 de Mysql ocupado (si fuera el caso, tambien
# se tendría que editar el docker-compose.yml).

# Ejecutar migraciones
docker-compose run --rm artisan migrate

# Para poblar la base de datos con datos falsos.
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

### Backend (Laravel)
```
backend/
├── app/
│   ├── Http/Controllers/ # Controladores para comensales, mesas y reservas
│   ├── Models/           # Modelos para comensales, mesas y reservas
│   └── Resources/        # Recursos API para transformación de datos
├── database/
│   ├── factories/       # Factories para crear datos falsos
│   ├── migrations/      # Migraciones para crear las tablas
│   └── seeders/         # Seeders para ejecutar los factories
├── tests/
│   ├── Feature/       # Gestión de Tests de características
│   └── Unit/         # Gestión de Tests Unitarios 
└── routes/
    └── api.php          # Definición de rutas API
```

### Frontend (Vue.js + TypeScript)
```
frontend/
├── components/
│   ├── comensales/      # Componentes relacionados con comensales
│   ├── common/          # Componentes comunes reutilizables
│   ├── mesas/           # Componentes relacionados con mesas
│   └── reservas/        # Componentes relacionados con reservas
├── composables/
│   └── usePagination.ts # Composable para manejar la paginación
├── requests/
│   └── reservaRequest.ts # Objetos de request para validación
├── router/
│   └── index.ts         # Configuración de rutas de Vue Router
├── services/
│   ├── api.ts           # Instancia de Axios para las peticiones HTTP
│   ├── comensalService.ts # Servicio para gestionar peticiones de comensales
│   ├── mesaService.ts   # Servicio para gestionar peticiones de mesas
│   └── reservaService.ts # Servicio para gestionar peticiones de reservas
├── stores/
│   ├── comensalStore.ts # Store para estado de comensales (Pinia)
│   ├── mesaStore.ts     # Store para estado de mesas (Pinia)
│   └── reservaStore.ts  # Store para estado de reservas (Pinia)
├── types/
│   └── index.ts         # Definiciones de tipos TypeScript
├── views/
│   └── ReservasManager.vue # Vista principal de gestión
├── App.vue              # Componente raíz
├── main.ts              # Punto de entrada de la aplicación
└── style.css            # Estilos globales
```

### Docker
```
docker/
├── dockerfiles/         # Archivos Dockerfile
├── mysql/               # Almacenamiento de la database
└── nginx/               # Configuración de Nginx
```

## Tecnologías Utilizadas

### Frontend
- Vue.js 3 con Composition API
- TypeScript
- Vue Router para navegación
- Pinia para gestión de estado
- Vite como bundler y servidor de desarrollo
- Patrón de servicios para comunicación con API

### Backend
- Laravel 12
- Eloquent ORM
- API Resources para transformación de respuestas
- Migraciones y Seeders para gestión de base de datos
- PHPUnit y Factories para asegurar las pruebas unitarias

### Infraestructura
- Docker y Docker Compose
- Nginx como servidor web
- MySQL como base de datos
- PHP-FPM para procesamiento PHP

## Acceso a la Aplicación

- **Frontend**: Acceda a la aplicación en [http://localhost:8080](http://localhost:8080)
- **API Backend**: Las rutas API están disponibles en [http://localhost:8080/api](http://localhost:8080/api)
- **phpMyAdmin**: Gestión de base de datos en [http://localhost:8090](http://localhost:8090)

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

# Verificar tipos TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Ejecutar pruebas unitarias (si están configuradas)
npm run test
```

## Flujo de Trabajo de Desarrollo

### Frontend
1. Los componentes se organizan por entidad (comensales, mesas, reservas)
2. Los servicios manejan la comunicación con la API backend
3. Los stores (Pinia) gestionan el estado global de la aplicación
4. Los transformers formatean los datos para su uso en la UI
5. El composable `usePagination` facilita la implementación de paginación en listados

### Backend
1. Los controladores gestionan las peticiones HTTP
2. Los modelos Eloquent definen la estructura de datos y relaciones
3. Los Resources transforman los datos para las respuestas API
4. Las migraciones definen la estructura de la base de datos

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

### Problemas con el frontend

Si tiene problemas con el frontend:

```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Problemas con TypeScript

Si encuentra errores de tipo en TypeScript:

```bash
# Verificar errores de tipo
npm run type-check
```

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
