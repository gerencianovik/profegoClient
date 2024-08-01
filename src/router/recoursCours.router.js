const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrar, mandar, lista, traerDatos, actualizar, desabilitar } = require('../controller/recours.controller');
const router = express.Router();

router.get('/clase/:id', isLoggedIn, mostrar)
router.post('/clase/:id', isLoggedIn, mandar)
router.get('/curso/:id', isLoggedIn, mostrar)
router.post('/curso/:id', isLoggedIn, mandar)
router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/clases/:id', isLoggedIn, lista)
router.get('/cursos/:id', isLoggedIn, lista)
router.get('/list/:id', isLoggedIn, lista)
router.get('/updateCurso/:id', isLoggedIn, traerDatos)
router.post('/updateCurso/:id', isLoggedIn, actualizar)
router.get('/updateClase/:id', isLoggedIn, traerDatos)
router.post('/updateClase/:id', isLoggedIn, actualizar)
router.get('/update/:id', isLoggedIn, traerDatos)
router.post('/update/:id', isLoggedIn, actualizar)
router.get('/deleteClase/:id', isLoggedIn, desabilitar)
router.get('/deleteCurso/:id', isLoggedIn, desabilitar)
router.get('/deleteClases/:id', isLoggedIn, desabilitar)

module.exports = router