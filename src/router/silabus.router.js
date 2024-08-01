const express = require('express');
const isLoggedIn = require('../lib/auth');
const { lista, aprobarRechazar, listaClase, detalleClaseCurso } = require('../controller/silabus.controller');
const router = express.Router();


router.get('/courso/:id', isLoggedIn, lista)
router.get('/clases/:id', isLoggedIn, listaClase)
router.post('/detail/:id', isLoggedIn, detalleClaseCurso)
router.get('/aprovar/:id', isLoggedIn, aprobarRechazar)
router.get('/rechazar/:id', isLoggedIn, aprobarRechazar)

module.exports = router