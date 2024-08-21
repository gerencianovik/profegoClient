const express = require("express");
const isLoggedIn = require("../lib/auth");
const { mostrar, mandar, lista, traer, actualizar, detalle } = require("../controller/pruebas.controller");
const router = express.Router();

router.get('/curso/:id', isLoggedIn, mostrar)
router.post('/curso/:id', isLoggedIn, mandar)
router.get('/cursos/:id', isLoggedIn, lista)
router.get('/cursosUpdate/:id', isLoggedIn, traer)
router.post('/cursosUpdate/:id', isLoggedIn, actualizar)
router.get('/preguntas/:id', isLoggedIn, detalle)

module.exports = router