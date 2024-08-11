const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrarTareaCurso, mostrarTareaClase, mandarCurso, mandarClase, listaTaskCurso, listaTaskClase, detalleCurso, detalleClase } = require('../controller/tareas.controller');
const router = express.Router();


router.get('/curso/:id', isLoggedIn, mostrarTareaCurso)
router.get('/clase/:id', isLoggedIn, mostrarTareaClase)
router.post('/curso/:id', isLoggedIn, mandarCurso)
router.post('/curso/:id', isLoggedIn, mandarClase)
router.get('/cursos/:id', isLoggedIn, listaTaskCurso)
router.get('/clases/:id', isLoggedIn, listaTaskClase)
router.get('/detailCurso/:id', isLoggedIn, detalleCurso)
router.get('/detailClase/:id', isLoggedIn, detalleClase)

module.exports = router