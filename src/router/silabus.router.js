const express = require('express');
const isLoggedIn = require('../lib/auth');
const { mostrarCurso, mostrarClase, mandarCurso, mandarClase, } = require('../controller/silabus.controller');
const router = express.Router();


router.get('/curso/:id', isLoggedIn, mostrarCurso)
router.get('/clase/:id', isLoggedIn, mostrarClase )
router.post('/curso/:id', isLoggedIn, mandarCurso )
router.get('/clase/:id', isLoggedIn, mandarClase )


module.exports = router