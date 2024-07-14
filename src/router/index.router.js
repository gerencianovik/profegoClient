const express = require('express');
const { mostrar, login, registro, CerrarSesion, mostrarLoginTeacher, mostrarRegistroTeacher, mostrarRegistroStudents, mostrarLoginStudents } = require('../controller/index.controller');
const router = express.Router();

router.get('/', mostrar)
router.post('/', login)
router.get('/loginStudents', mostrarLoginStudents)
router.post('/loginStudents', login)
router.get('/loginTeachers', mostrarLoginTeacher)
router.post('/loginTeachers', login)
router.get('/RegisterTeachers', mostrarRegistroTeacher)
router.post('/RegisterTeachers', registro)
router.get('/RegisterStudents', mostrarRegistroStudents)
router.post('/RegisterStudents', registro)
router.post('/login', registro)
router.get('/closeSection', CerrarSesion)

module.exports = router