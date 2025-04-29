const express = require("express");
const router = express.Router();
const isLoggedIn = require("../lib/auth");

const { mostrarEleccion, mostrarEleccionEstudiante, clasesCursos } = require("../controller/eleccion.controller");

router.get('/general', isLoggedIn, clasesCursos)

router.get('/eleccion', isLoggedIn, async (req, res) => {
    const user = req.user;
    if (user.rolTeacher == 'teacher') {
        return res.redirect(`/eleccion/${user.idTeacher}`);
    } else if (user.rolStudent === 'student') {
        return res.redirect(`/eleccion-estudiante/${user.id}`);
    } else {
        return res.status(403).send('Rol no autorizado');
    }
});

router.get('/eleccion/:id', isLoggedIn, mostrarEleccion);

router.get('/eleccion-estudiante/:id', isLoggedIn, mostrarEleccionEstudiante);

module.exports = router;
