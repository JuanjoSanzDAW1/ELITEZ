require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const db = require('../config/db'); 
const authRoutes = require('../routes/authRoutes');
const loginRoutes = require('../routes/loginRoutes');
const eventRoutes = require('../routes/eventRoutes');
const verifyToken = require('../middlewares/authMiddleware');

const app = express();

console.log('Clave JWT_SECRET:', process.env.JWT_SECRET);


app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));


app.use(express.json());

app.use('/auth', authRoutes); 
app.use('/login',  loginRoutes);
app.use('/api/eventos', verifyToken, eventRoutes);
app.use('/api/horarios', verifyToken, eventRoutes);


app.use(express.static('C:/Users/juanj/elitez/elitez-frontend/dist/elitez'));


app.get('*', (req, res) => {
    res.sendFile('C:/Users/juanj/elitez/elitez-frontend/dist/elitez/index.html');
});
app.use('/gyms', (req, res, next) => {
    console.log('Solicitud recibida en /gyms');
    next();
  });   

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



