const passport = require('passport')
const orm = require('../Database/dataBase.orm.js')
const sql = require('../Database/dataBase.sql.js')
const indexCtl = {}

indexCtl.mostrar = async (req, res) => {
    try {
        const [pagina] = await sql.promise().query('SELECT * FROM pagePolicy');
        const [teacher] = await sql.promise().query('SELECT * FROM teachers');
        const [materias] = await sql.promise().query('SELECT * FROM subjects');
        const [tipos] = await sql.promise().query('SELECT * FROM coursclasstypes');
        res.render('inicio', { listaPagina: pagina, profesor: teacher, materiales: materias, tipos: tipos, csrfToken: req.csrfToken() })
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
    passport.authenticate("local.studentSignin", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/RegisterStudents");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/students/eleccion/" + req.user.idEstudent);
        });
    })(req, res, next);
};

indexCtl.login = (req, res, next) => {
    passport.authenticate("local.teacherSignin", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/RegisterTeachers");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/teacher/update/" + req.user.idTeacher);
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

module.exports = indexCtl