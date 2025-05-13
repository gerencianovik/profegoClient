const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");
const { mostrar, update, lista } = require("../controller/student.controller");

router.get('/update/:id', isLoggedIn, mostrar)
router.post('/update/:id', isLoggedIn, update)
router.get('/lista/:id', isLoggedIn, lista)
router.get('/lista/:id', isLoggedIn, lista)

module.exports = router