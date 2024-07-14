const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const orm = require('../Database/dataBase.orm');
const sql = require('../Database/dataBase.sql');
const helpers = require('./helpers');
const bcrypt = require('bcrypt');
const { cifrarDatos, descifrarDatos } = require('./encrypDates');

// Validación de entrada
const validateInput = (input) => {
    // Verifica que la entrada no esté vacía
    if (!input) {
        console.log('La entrada no puede estar vacía.');
        return false;
    }

    // Verifica que la entrada tenga al menos 8 caracteres
    if (input.length < 8) {
        console.log('La entrada debe tener al menos 8 caracteres.');
        return false;
    }

    // Si todas las validaciones pasan, la entrada es válida
    return true;
};


passport.use(
    'local.teacherSignin',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            if (!validateInput(username) || !validateInput(password)) {
                return done(null, false, req.flash("message", "Entrada inválida."));
            }

            const users = await sql.query('select * from teachers')
            for (let i = 0; i < users.length; i++) {
                const user = await orm.teacher.findOne({ where: { identificationCardTeacher: users[i].identificationCardTeacher} });
                let decryptedUsername = descifrarDatos(user.identificationCardTeacher)
                if (decryptedUsername == username) {
                    const validPassword = await bcrypt.compare(password, user.passwordTeacher);
                    if (validPassword) {
                        return done(null, user, req.flash("success", "Bienvenido" + " " + user.username));
                    } else {
                        return done(null, false, req.flash("message", "Datos incorrecta"));
                    }
                }
            }
            return done(null, false, req.flash("message", "El nombre de usuario no existe."));
        }
    )
);

passport.use(
    'local.teacherSignup',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, username, password, done) => {
            try {
                if (!validateInput(username) || !validateInput(password)) {
                    return done(null, false, req.flash("message", "Entrada inválida."));
                }
                const existingUser = await orm.teacher.findOne({ where: { identificationCardTeacher: cifrarDatos(username) } });
                if (existingUser) {
                    return done(null, false, req.flash('message', 'La cedula del usuario ya existe.'));
                } else {
                    const hashedPassword = await helpers.hashPassword(password);
                    const {
                        idTeacher,
                        completeNmeTeacher,
                        usernameTeahcer,
                        emailTeacher,
                        phoneTeacher
                    } = req.body;

                    let newClient = {
                        idTeacher: idTeacher,
                        identificationCardTeacher: cifrarDatos(username),
                        phoneTeacher: cifrarDatos(phoneTeacher),
                        emailTeacher: cifrarDatos(emailTeacher),
                        completeNmeTeacher: cifrarDatos(completeNmeTeacher),
                        usernameTeahcer: cifrarDatos(usernameTeahcer),
                        passwordTeacher: hashedPassword,
                        createTeahcer: new Date().toLocaleString()
                    };

                    const guardar = await orm.teacher.create(newClient);
                    newClient.id = guardar.insertId
                    return done(null, newClient);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;