const passport = require('passport')
const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const { validationResult } = require('express-validator');
const indexCtl = {}

indexCtl.mostrar = async (req, res) => {
    try {
        const [pagina] = await sql.promise().query('SELECT * FROM pagePolicy');
        const [teacher] = await sql.promise().query('SELECT * FROM teachers');
        const [materias] = await sql.promise().query('SELECT * FROM subjects');
        const [tipos] = await sql.promise().query('SELECT * FROM coursClassTypes');
        const datos = teacher.map(row => ({
            completeNmeTeacher: row.completeNmeTeacher ? descifrarDatos(row.completeNmeTeacher) : '',
        }))
        res.render('inicio', { listaPagina: pagina, profesor: datos, materiales: materias, tipos: tipos, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

indexCtl.somos = async (req, res) => {
    try {
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        res.render('somos', { listaPagina: pagina, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

indexCtl.funciona = async (req, res) => {
    try {
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        res.render('funciona', { listaPagina: pagina, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

indexCtl.seguridad = async (req, res) => {
    try {
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        res.render('seguridad', { listaPagina: pagina, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

indexCtl.contactos = async (req, res) => {
    try {
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        res.render('contactos', { listaPagina: pagina, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

indexCtl.mostrarRegistroStudents = async (req, res) => {
    try {
        const [rows] = await sql.promise().query('SELECT MAX(idEstudent) AS Maximo FROM students');
        res.render('login/registroestudinates', { lista: rows, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

indexCtl.mostrarLoginStudents = async (req, res) => {
    try {
        const [rows] = await sql.promise().query('SELECT MAX(idEstudent) AS Maximo FROM students');
        res.render('login/estudiates', { lista: rows, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}


indexCtl.mostrarRegistroTeacher = async (req, res) => {
    try {
        const [rows] = await sql.promise().query('SELECT MAX(idTeacher) AS Maximo FROM teachers');
        res.render('login/registroprofes', { lista: rows, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

indexCtl.mostrarLoginTeacher = async (req, res) => {
    try {
        const [rows] = await sql.promise().query('SELECT MAX(idTeacher) AS Maximo FROM teachers');
        res.render('login/profesores', { lista: rows, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

indexCtl.registro = passport.authenticate("local.teacherSignup", {
    successRedirect: "/closeSection",
    failureRedirect: "/RegisterTeachers",
    failureFlash: true,
    failureMessage: true
})

indexCtl.registroEstudiante = passport.authenticate("local.studentSignup", {
    successRedirect: "/closeSection",
    failureRedirect: "/RegisterStudents",
    failureFlash: true,
    failureMessage: true
})

indexCtl.loginEstudiante = (req, res, next) => {
    passport.authenticate("local.studentSignin", (err, usuario, info) => {
        if (err) {
            console.error('Error en autenticación del Estudiante:', err);
            return res.status(500).json({ error: 'Error en autenticación del Estudiante' });
        }
        if (!usuario) {
            req.flash('error', 'Credenciales inválidas');
            return res.redirect("/RegisterStudents");
        }
        req.logIn(usuario, (err) => {
            if (err) {
                console.error('Error en login del Estudiante:', err);
                return res.status(500).json({ error: 'Error al iniciar sesión' });
            }
            return res.redirect("/eleccion-estudiante/" + usuario.idEstudent);
        });
    })(req, res, next);
};

indexCtl.login = (req, res, next) => {
    passport.authenticate("local.teacherSignin", (err, usuario, info) => {
        if (err) {
            console.error('Error en autenticación profesor:', err);
            return res.status(500).json({ error: 'Error en autenticación profesor' });
        }
        if (!usuario) {
            req.flash('error', 'Credenciales inválidas');
            return res.redirect("/RegisterTeachers");
        }
        req.logIn(usuario, (err) => {
            if (err) {
                console.error('Error en login profesor:', err);
                return res.status(500).json({ error: 'Error al iniciar sesión' });
            }
            return res.redirect("/teacher/update/" + usuario.idTeacher);
        });
    })(req, res, next);
};

indexCtl.CerrarSesion = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Cerrada la Sesión con éxito.");
        res.redirect("/");
    });
};

indexCtl.listaPoliticas = async (req, res) => {
    try {
        const [row] = await sql.promise().query('SELECT * FROM pages where idPage = 1')
        const [rows] = await sql.promise().query('SELECT * FROM policies where pageIdPage = 1')
        rows.forEach(policy => {
            policy.formattedDescription = policy.descriptionPolicy.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        });
        res.render('pagina/politicas', { listaPagina: row, politicas: rows, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

module.exports = indexCtl