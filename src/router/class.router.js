const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrar, mandar, lista, traerDatos, actualizar, desabilitar } = require('../controller/class.controller');
const router = express.Router();

router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/list/:id', isLoggedIn, lista)
router.get('/update/:id', isLoggedIn, traerDatos)
router.post('/update/:id', isLoggedIn, actualizar)
router.get('/delete/:id', isLoggedIn, desabilitar)

module.exports = router