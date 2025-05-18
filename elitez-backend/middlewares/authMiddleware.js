// Importamos la librería JWT para verificar tokens
const jwt = require('jsonwebtoken');

// Middleware para verificar si el token JWT es válido
const verifyToken = (req, res, next) => {
  // Obtenemos el encabezado Authorization de la petición
  const authHeader = req.header('Authorization');

  // Verificamos si el encabezado existe y comienza con "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Acceso denegado. Token no proporcionado o mal formateado.' 
    });
  }

  // Extraemos el token después de la palabra "Bearer"
  const token = authHeader.split(' ')[1]; 
  console.log('Extracted Token:', token);

  try {
    // Verificamos el token usando la clave secreta almacenada en .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, lo guardamos en req.user para usarlo después
    req.user = verified;
    console.log('Token válido:', verified);

    // Continuamos con la siguiente función del middleware o ruta
    next();
  } catch (err) {
    // Si el token no es válido, devolvemos un error 400
    console.error('Error al verificar el token:', err.message);
    res.status(400).json({ error: 'Token inválido.' });
  }
};

// Exportamos el middleware para usarlo en rutas protegidas
module.exports = verifyToken;
