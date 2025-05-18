# ELITEZ

**ELITEZ** es una aplicación web completa (full stack) desarrollada como proyecto final del Grado Superior en Desarrollo de Aplicaciones Web. Su objetivo es gestionar gimnasios de artes marciales en Zaragoza, permitiendo a los usuarios registrarse, elegir gimnasio, consultar horarios, acceder a videoclases, pagar cuotas, editar su perfil y gestionar su cuenta.

## Características Principales

* Registro e inicio de sesión de usuarios (JWT).
* Selección de gimnasio y artes marciales.
* Vista de calendario con clases y eventos.
* Acceso a videoclases organizadas por gimnasio.
* Visualización de planes de pago (cuotas).
* Formulario visual de pago simulado.
* Edición del perfil del usuario.
* Eliminación de cuenta con confirmación.
* Control de acceso mediante guardas de ruta (AuthGuard).

## Tecnologías Utilizadas

### Frontend

* Angular 17 (standalone components)
* Bootstrap 5 + CSS personalizado
* FullCalendar (componente de calendario)

### Backend

* Node.js + Express
* MySQL 
* JWT para autenticación
* Docker Desktop para la gestión de la base de datos

## 📂 Estructura del Proyecto

```
ELITEZ/
├── elitez-backend/
│   ├── controllers/         # Lógica de control y acceso a base de datos
│   ├── middlewares/         # Middleware JWT
│   ├── routes/              # Definición de rutas
│   ├── config/              # Conexión a la base de datos
│   ├── .env                 # Variables de entorno
│   └── index.js             # Archivo principal del backend
│
├── elitez-frontend/
│   ├── src/app/
│   │   ├── auth/            # Login y registro
│   │   ├── sidebar/         # Barra lateral de navegación
│   │   ├── calendar/        # Calendario de clases
│   │   ├── cuotas/          # Vista de planes de pago
│   │   ├── ajustes/         # Ajustes de cuenta
│   │   ├── video/           # Videoclases
│   │   ├── guards/          # AuthGuard
│   │   └── services/        # Servicios HTTP
│   ├── assets/              # Imágenes y estilos
│   └── environments/        # Configuraciones de entorno
```

## Seguridad y Control de Acceso

* El backend valida los tokens JWT en rutas protegidas.
* El frontend incluye AuthGuard que bloquea rutas si no se ha iniciado sesión.
* Encriptado de contraseñas.

## Flujo de Uso

1. El usuario se registra e inicia sesión.
2. Selecciona un gimnasio de la lista.
3. Puede ver:

   * El calendario con clases y eventos.
   * Videoclases disponibles.
   * Cuotas y planes de pago visuales.
4. Tiene acceso a su perfil en "Ajustes" para editar datos o eliminar su cuenta.

## Ejecución Local

### Backend

1. Ir a la carpeta del backend:

```
cd elitez-backend
```

2. Instalar dependencias:

```
npm install
```

3. Crear archivo `.env` con:

```
JWT_SECRET=******
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=elitez
```

4. Iniciar servidor:

```
node server.js
```
Acceder a `http://localhost:3000`

### Base de Datos

* Iniciar Docker Desktop (MySQL + DBeaver)
* Acceder a `localhost:3307`
* Crear base de datos `elitez`
* Importar el script de tablas.

### Frontend

1. Ir al frontend:

```
cd elitez-frontend
```

2. Instalar dependencias:

```
npm install
```

3. Iniciar Angular:

```
ng serve
```

4. Acceder a `http://localhost:4200`

## 📜 Autor

Proyecto desarrollado por [JuanjoSanzDAW1](https://github.com/JuanjoSanzDAW1)

## 📄 Licencia

Este proyecto es educativo y está liberado bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente.

---

## 🖼️ Capturas de pantalla

### 📌 Login
![Login](./elitez-frontend/src/assets/ScreenShots/login.png)

### 📌 Registro
![Registro](./elitez-frontend/src/assets/ScreenShots/registro.png)

### 📌 Home
![Home](./elitez-frontend/src/assets/ScreenShots/home.png)

### 📌 Calendar
![Calendar](./elitez-frontend/src/assets/ScreenShots/calendar.png)

### 📌 Eventos
![Eventos](./elitez-frontend/src/assets/ScreenShots/eventos.png)

### 📌 Videos
![Videos](./elitez-frontend/src/assets/ScreenShots/videos.png)

### 📌 Cuotas
![Cuotas](./elitez-frontend/src/assets/ScreenShots/cuotas.png)

### 📌 Pagos
![Pagos](./elitez-frontend/src/assets/ScreenShots/pagos.png)

### 📌 Chatbot
![Chatbot](./elitez-frontend/src/assets/ScreenShots/chatbot.png)

### 📌 Ajustes
![Ajustes](./elitez-frontend/src/assets/ScreenShots/ajustes.png)


