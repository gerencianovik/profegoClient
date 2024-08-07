const express = require('express');
const isLoggedIn = require('../lib/auth');
const { lista, mostrar, mandar, detalle } = require('../controller/tareas.controller');
const router = express.Router();


router.get('/add/:id', isLoggedIn, mostrar)
router.post('/add/:id', isLoggedIn, mandar)
router.get('/list/:id', isLoggedIn, lista)
router.get('/detail/:id', isLoggedIn, detalle)

module.exports = router