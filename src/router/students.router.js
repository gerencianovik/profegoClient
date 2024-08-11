const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");
const { mostrarEleccionEstudiante } = require('../controller/eleccion.controller')

router.get('/eleccion/:id', isLoggedIn, mostrarEleccionEstudiante)

module.exports = router