const express = require('express');
const { mostrar, login, registro, CerrarSesion, mostrarLoginTeacher, mostrarRegistroTeacher, mostrarRegistroStudents, mostrarLoginStudents, loginEstudiante, registroEstudiante, somos, funciona, seguridad, contactos } = require('../controller/index.controller');
const router = express.Router();

router.get('/', mostrar)
router.post('/', login)
router.get('/loginStudents', mostrarLoginStudents)
router.post('/loginStudents', loginEstudiante)
router.get('/loginTeachers', mostrarLoginTeacher)
router.post('/loginTeachers', login)
router.get('/RegisterTeachers', mostrarRegistroTeacher)
router.post('/RegisterTeachers', registro)
router.get('/RegisterStudents', mostrarRegistroStudents)
router.post('/RegisterStudents', registroEstudiante)
router.get('/closeSection', CerrarSesion)
router.get('/somos', somos)
router.get('/funciona', funciona)
router.get('/seguridad', seguridad)
router.get('/contactos', contactos)

module.exports = router