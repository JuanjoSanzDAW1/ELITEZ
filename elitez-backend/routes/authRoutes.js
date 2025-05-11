const express = require('express');
const { registerUser, loginUser, Nomusuario, getGyms, selectGym, getMartialArts, selectMartialArt } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware'); 

const router = express.Router();


router.post('/register', registerUser);


router.post('/login', loginUser);

router.get('/profile', verifyToken, Nomusuario);


router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado', user: req.user });
});

router.get('/gyms', verifyToken, (req, res, next) => {
  console.log('Ruta /gyms ejecutada');
  next();
}, getGyms);


router.post('/select-gym', verifyToken, selectGym);


router.get('/martial-arts/:gymId', verifyToken, getMartialArts);


router.post('/select-martial-art', verifyToken, selectMartialArt);


module.exports = router;


