const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrar, mandar, lista, traerDatos, actualizar, desabilitar, detalle, detalleStudnets, listaStudents, habilitar } = require('../controller/class.controller');
const router = express.Router();

router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/list/:id', isLoggedIn, lista)
router.get('/listStudent/:id', isLoggedIn, listaStudents)
router.get('/update/:id', isLoggedIn, traerDatos)
router.post('/update/:id', isLoggedIn, actualizar)
router.get('/delete/:id', isLoggedIn, desabilitar)
router.get('/enable/:id', isLoggedIn, habilitar)
router.get('/detailList/:id', isLoggedIn, detalle)
router.get('/detailStudent/:id', isLoggedIn, detalleStudnets)

module.exports = router