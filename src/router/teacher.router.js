const express = require("express");
const router = require("./index.router");
const isLoggedIn = require("../lib/auth");
const { mostrar } = require("../controller/teacher.controller");

router.get('/update/:id', isLoggedIn, mostrar)

module.exports = router