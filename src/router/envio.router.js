const express = require("express");
const router = express.Router()

const {isLoggedIn} = require('../lib/auth')
const { sendImagenCours, sendVideoCours, sendImagenClass, sendVideoClass, sendImagenPagina } = require('../controller/archivosGuardados')

router.post('/imagenCours', sendImagenCours)
router.post('/videoCours', sendVideoCours)
router.post('/imagenClase', sendImagenClass)
router.post('/videoClases', sendVideoClass)
router.post('/imagenPagina', sendImagenPagina)
module.exports = router