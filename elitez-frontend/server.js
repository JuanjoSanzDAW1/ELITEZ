const express = require('express');
const path = require('path');

const app = express();

// Servir los archivos estáticos desde la carpeta 'browser'
app.use(express.static(path.join(__dirname, 'dist/elitez/browser')));

// Manejar todas las rutas con el archivo 'index.html'
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/elitez/browser/index.html'));
});

// Inicia el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
