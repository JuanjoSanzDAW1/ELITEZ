const express = require('express');
const { getEventosPorGym, agregarEvento, getHorariosPorGym } = require('../controllers/eventController');

const router = express.Router();

router.get('/eventos/:gym_id', getEventosPorGym); // Obtener eventos del gimnasio seleccionado
router.post('/eventos', agregarEvento); // Crear un nuevo evento
router.get('/horarios/:gym_id', getHorariosPorGym); // Obtener horarios del gimnasio

module.exports = router;
