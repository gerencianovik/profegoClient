const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrar, mandar, lista, traerDatos, actualizar, desabilitar, detalle, detalleStudent, studentLista, habilitar } = require('../controller/cours.controller');
const router = express.Router();

router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/list/:id', isLoggedIn, lista)
router.get('/listStudent/:id', studentLista)
router.get('/update/:id', isLoggedIn, traerDatos)
router.post('/update/:id', isLoggedIn, actualizar)
router.get('/delete/:id', isLoggedIn, desabilitar)
router.get('/enable/:id', isLoggedIn, habilitar)
router.get('/detailList/:id', isLoggedIn, detalle)
router.get('/detailStudent/:id', isLoggedIn, detalleStudent)

module.exports = router