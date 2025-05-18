const express = require('express');
const router = express.Router();
const { getVideosByGym } = require('../controllers/videoController'); // ✅ OJO: path correcto
const verifyToken = require('../middlewares/authMiddleware'); // ✅ Asegúrate de que esto existe

// ✅ Ruta protegida
router.get('/api/videos/:gymId', verifyToken, getVideosByGym);

module.exports = router;

