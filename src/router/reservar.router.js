const express = require('express');
const router = express.Router();
const reservaController = require('../controller/reservar.controller');

// Ruta para procesar la reserva
router.get('/reservas/:id', reservaController.reservas);
router.post('/reservar', reservaController.procesarReserva);
router.get('/reservar/:id', reservaController.reservar);

module.exports = router;