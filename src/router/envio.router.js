const express = require("express");
const router = express.Router()

const {isLoggedIn} = require('../lib/auth')
const { sendTeacher, sendArchivos } = require('../controller/archivosGuardados')

router.post('/imagenTeacher', sendTeacher)
router.post('/archivosTeacher', sendArchivos)

module.exports = router