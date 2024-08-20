const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");
const { mostrar, update, lista } = require("../controller/student.controller");
const {mostrarEleccionEstudiante} = require("../controller/eleccion.controller");

router.get('/update/:id', isLoggedIn, mostrar)
router.post('/update/:id', isLoggedIn, update)
router.get('/lista/:id', isLoggedIn, lista)
router.get('/eleccion/:id', isLoggedIn, mostrarEleccionEstudiante)

module.exports = router