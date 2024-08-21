const express = require("express");
const { lista } = require("../controller/filtros.controller");
const router = express.Router();

router.get('/list', lista)

module.exports = router