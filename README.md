# CoreTask ✅

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Podman](https://img.shields.io/badge/Podman-892CA0?style=for-the-badge&logo=podman&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

CoreTask es un gestor de tareas multiusuario con arquitectura full-stack contenerizada. Utiliza una interfaz Kanban moderna e intuitiva para gestionar flujos de trabajo, ordenando las tareas dinámicamente mediante señales reactivas según su prioridad y estado.

## 🚀 Características Principales

* **Tablero Kanban Dinámico:** Organización de tareas en 3 columnas (Pendientes, En Proceso, Completadas).
* **Gestor de Usuarios Integrado:** Creación, edición y eliminación de perfiles de usuario desde la barra de navegación.
* **Integridad Relacional (Cascade Delete):** Al eliminar un perfil, el sistema purga físicamente de la base de datos todas las tareas asociadas al usuario.
* **Ordenamiento Inteligente:** Motor de filtrado en el frontend mediante `computed signals` que acomoda las tareas automáticamente de mayor a menor prioridad.
* **UI/UX Moderna:** Diseño responsivo con bordes curvos, temas pasteles por estado y tipografía estilizada utilizando Angular Material.

## 🛠️ Stack Tecnológico

**Frontend (Client-side)**

* Angular 17+ (Standalone Components, Signals, esbuild)
* Angular Material & Material Icons
* HTML5 / CSS3 / SVG Branding

**Backend (Server-side)**

* Java 21
* Spring Boot 3
* Spring Data JPA / Hibernate

**Infraestructura & Datos (DevOps)**

* PostgreSQL 16 (Base de datos relacional)
* Nginx (Reverse Proxy & API Gateway)
* Podman / Docker Compose (Despliegue contenerizado)
* pgAdmin 4 (Administración de base de datos)

## ⚙️ Arquitectura de Red y Puertos

El proyecto utiliza un proxy inverso Nginx para enrutar el tráfico de forma transparente, evitando conflictos de CORS y unificando el ecosistema bajo un solo puerto externo.

| Servicio | Puerto Interno | Puerto Expuesto | Descripción |
| :--- | :--- | :--- | :--- |
| **Nginx (Proxy)** | 80 | `8000` | Punto de entrada principal (UI y API). |
| **Angular App** | 4200 | *Oculto* | Servidor de desarrollo frontend. |
| **Spring Boot** | 8080 | *Oculto* | API RESTful backend. |
| **PostgreSQL** | 5432 | *Oculto* | Base de datos persistente. |
| **pgAdmin** | 80 | `5050` | Interfaz gráfica de administración de BD. |

## 📦 Instalación y Despliegue

### Prerrequisitos

Asegúrate de tener instalado **Podman** (o Docker) y **Docker Compose** en tu sistema operativo (compatible con WSL2).

### Ejecutar el entorno

1. Clona este repositorio y navega al directorio raíz:

   ```bash
   git clone <tu-repositorio>
   cd CoreTask
   ```

2. Construye y levanta todos los contenedores en segundo plano:

   ```bash
   podman compose up -d --build
   ```

3. Accede a la aplicación a través del navegador:
   * **CoreTask App:** [http://localhost:8000](http://localhost:8000)
   * **pgAdmin:** [http://localhost:5050](http://localhost:5050)

### Comandos Útiles

**Forzar una reconstrucción total (limpiando caché):**

```bash
podman compose up -d --build --force-recreate
podman restart coretask-nginx
```

**Detener el entorno:**

```bash
podman compose down
```

**Ver logs del backend:**

```bash
podman logs -f coretask-backend-springboot
```

## 📡 Endpoints de la API REST

Todas las peticiones del frontend pasan por Nginx y son redirigidas al backend mediante el prefijo `/api/`.

### Usuarios (`/api/users`)

* `GET /api/users` - Obtiene la lista de usuarios.
* `POST /api/users` - Crea un nuevo perfil.
* `PUT /api/users/{id}` - Edita el nombre de usuario.
* `DELETE /api/users/{id}` - Elimina un usuario y sus tareas en cascada.

### Tareas (`/api/tasks`)

* `GET /api/tasks/user/{userId}` - Obtiene todas las tareas de un usuario específico.
* `POST /api/tasks` - Crea una nueva tarea (requiere ID de usuario y prioridad).
* `PUT /api/tasks/{id}` - Actualiza el título, prioridad y estado (PENDIENTE, EN_PROCESO, COMPLETADA).
* `DELETE /api/tasks/{id}` - Elimina una tarea permanentemente.
