const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");
const { mostrar, update, lista } = require("../controller/teacher.controller");
const {mostrarEleccion} = require("../controller/eleccion.controller");

router.get('/update/:id', mostrar)
router.post('/update/:id', isLoggedIn, update)
router.get('/lista/:id', isLoggedIn, lista)
router.get('/eleccion/:id', isLoggedIn, mostrarEleccion)

module.exports = router