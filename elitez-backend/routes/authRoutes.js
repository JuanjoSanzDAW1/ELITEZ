const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile,
  getGyms,
  deselectGym,
  selectGym,
  getMartialArts,
  selectMartialArt,
  getCuotasByGym,
  updateProfile,
  eliminarCuenta
} = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware'); 
const router = express.Router();


router.post('/register', registerUser);


router.post('/login', loginUser);
router.put('/update', verifyToken, updateProfile);
router.delete('/eliminar-cuenta', verifyToken, eliminarCuenta);
router.get('/profile', verifyToken, getProfile);
router.get('/cuotas', verifyToken, getCuotasByGym);

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado', user: req.user });
});

router.get('/gyms', verifyToken, (req, res, next) => {
  console.log('Ruta /gyms ejecutada');
  next();
}, getGyms);


router.post('/select-gym', verifyToken, selectGym);

router.post('/deselect-gym', verifyToken, deselectGym);

router.get('/martial-arts/:gymId', verifyToken, getMartialArts);


router.post('/select-martial-art', verifyToken, selectMartialArt);


module.exports = router;


