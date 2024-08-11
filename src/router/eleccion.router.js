const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");
const { clasesCursos } = require('../controller/eleccion.controller')

router.get('/general', isLoggedIn, clasesCursos)

module.exports = router