const express = require('express');
const { getEventosPorGym, agregarEvento, getHorariosPorGym, eliminarEvento } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware'); // ✅ Importa el middleware de autenticación

const router = express.Router();

// ✅ Rutas relacionadas con eventos
router.get('/:gym_id', verifyToken, getEventosPorGym); // Obtener eventos del gimnasio seleccionado
router.post('/', verifyToken, agregarEvento); // Crear un nuevo evento
router.get('/horarios/:gym_id', verifyToken, getHorariosPorGym); // Obtener horarios del gimnasio
router.delete('/:id', verifyToken, eliminarEvento); // Eliminar evento

module.exports = router;
