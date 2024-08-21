const express = require("express");
const { clase, curso } = require("../controller/filtros.controller");
const router = express.Router();

router.get('/listCurso', curso)
router.get('/listClase', clase)

module.exports = router