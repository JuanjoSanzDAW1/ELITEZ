const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o mal formateado.' });
  }

  const token = authHeader.split(' ')[1]; 
  console.log('Extracted Token:', token);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('Token válido:', verified);
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    res.status(400).json({ error: 'Token inválido.' });
  }
};

module.exports = verifyToken;
