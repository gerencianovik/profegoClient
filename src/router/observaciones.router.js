const express = require("express");
const isLoggedIn = require("../lib/auth");
const { mostrar } = require("../controller/ObservacionesValoración.controller");
const router = express.Router();

router.get('/curso/:id', isLoggedIn, mostrar)

module.exports = router