const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrar, mandar, lista, traerDatos, actualizar, desabilitar, detalle } = require('../controller/class.controller');
const router = express.Router();

router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/list/:id', isLoggedIn, lista)
router.get('/update/:id', isLoggedIn, traerDatos)
router.post('/update/:id', isLoggedIn, actualizar)
router.get('/delete/:id', isLoggedIn, desabilitar)
router.get('/detailList/:id', isLoggedIn, detalle)

module.exports = router