const mysql = require('mysql2');

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',       // Cambia si usas un servidor remoto
    port: 3307,              // Asegúrate de que es el puerto correcto
    user: 'root',            // Usuario de MySQL
    password: '123',         // Contraseña del usuario
    database: 'elitez',      // Nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporta el pool con promesas
module.exports = pool.promise();
