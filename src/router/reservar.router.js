const express = require('express');
const router = express.Router();
const reservaController = require('../controller/reservar.controller');

// Ruta para procesar la reserva
router.get('/reservas/:id', reservaController.reservas);
router.get('/reservar', reservaController.procesarReserva);
router.get('/reservar/:id', reservaController.reservar);
router.get('/notificaciones', reservaController.notificacionPago2);
router.get('/transaccion', reservaController.notificacionPago2);
module.exports = router;