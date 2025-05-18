// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Middleware para permitir solicitudes desde otros orígenes (CORS)
const cors = require('cors');

// Framework principal del backend
const express = require('express');

// Módulo de Node.js para trabajar con rutas de archivos
const path = require('path');

// Conexión a la base de datos (MySQL)
const db = require('../config/db'); 

// Rutas de autenticación
const authRoutes = require('../routes/authRoutes');

// Rutas de login (alternativo o pruebas)
const loginRoutes = require('../routes/loginRoutes');

// Rutas para eventos y horarios
const eventRoutes = require('../routes/eventRoutes');

// Middleware para verificar el token JWT
const verifyToken = require('../middlewares/authMiddleware');

// Rutas de videoclases
const videoRoutes = require('../routes/videoRoutes');

// Inicializamos la app de Express
const app = express();

// Mostramos en consola la clave JWT usada (útil para depuración)
console.log('Clave JWT_SECRET:', process.env.JWT_SECRET);


/* ========== Middlewares ========== */

// Configuración de CORS para permitir acceso desde el frontend en localhost:4200
app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());


/* ========== Rutas API ========== */

// Prefijo /auth para rutas como login, registro, perfil, seleccionar gimnasio, etc.
app.use('/auth', authRoutes); 

// Rutas auxiliares de login (se podría unificar con authRoutes)
app.use('/login', loginRoutes);

// Rutas para eventos (requieren token JWT)
app.use('/api/eventos', verifyToken, eventRoutes);

// Rutas para horarios (mismo controlador que eventos, también requiere token)
app.use('/api/horarios', verifyToken, eventRoutes);

// Rutas para videoclases (también protegidas)
app.use(videoRoutes);


/* ========== Servir el frontend (Angular) ========== */

// Ruta absoluta a la carpeta generada por Angular tras build (dist)
const frontendPath = path.join(__dirname, '../../elitez-frontend/dist/elitez');

// Servimos los archivos estáticos del frontend Angular
app.use(express.static(frontendPath));

// Para cualquier otra ruta (SPA), devolvemos el index.html de Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Middleware para mostrar que se ha recibido una solicitud en /gyms (debug)
app.use('/gyms', (req, res, next) => {
    console.log('Solicitud recibida en /gyms');
    next();
});   


/* ========== Iniciar Servidor ========== */

// Puerto de escucha (usa .env o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Levantamos el servidor Express
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
