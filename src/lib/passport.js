const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const orm = require('../Database/dataBase.orm');
const sql = require('../Database/dataBase.sql');
const helpers = require('./helpers');
const bcrypt = require('bcrypt');
const FormData = require('form-data');
const { cifrarDatos, descifrarDatos } = require('./encrypDates');


const guardarYSubirArchivo = async (archivo, filePath, columnName, idEstudent, url, req) => {
    const validaciones = {
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO"],
        pdf: [".pdf", ".PDF"]
    };
    const tipoArchivo = columnName === 'photoEstudent' ? 'imagen' : 'pdf';
    const validacion = path.extname(archivo.name);

    if (!validaciones[tipoArchivo].includes(validacion)) {
        throw new Error('Archivo no compatible.');
    }

    return new Promise((resolve, reject) => {
        archivo.mv(filePath, async (err) => {
            if (err) {
                return reject(new Error('Error al guardar el archivo.'));
            } else {
                try {
                    await sql.promise().query(`UPDATE students SET ${columnName} = ? WHERE idEstudent = ?`, [archivo.name, idEstudent]);

                    const formData = new FormData();
                    formData.append('image', fs.createReadStream(filePath), {
                        filename: archivo.name,
                        contentType: archivo.mimetype,
                    });

                    const response = await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'X-CSRF-Token': req.csrfToken(),
                            'Cookie': req.headers.cookie
                        },
                    });

                    if (response.status !== 200) {
                        throw new Error('Error al subir archivo al servidor externo.');
                    }

                    resolve();
                } catch (uploadError) {
                    console.error('Error al subir archivo al servidor externo:', uploadError.message);
                    reject(new Error('Error al subir archivo al servidor externo.'));
                }
            }
        });
    });
};

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
                const user = await orm.teacher.findOne({ where: { identificationCardTeacher: users[i].identificationCardTeacher } });
                if (user.identificationCardTeacher == username) {
                    if (password == user.passwordTeacher) {
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
    'local.studentSignin',
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

            const users = await sql.query('select * from students')
            for (let i = 0; i < users.length; i++) {
                const user = await orm.student.findOne({ where: { usernameEstudent: users[i].usernameEstudent } });
                let decryptedUsername = descifrarDatos(user.usernameEstudent)
                if (decryptedUsername == username) {
                    const validPassword = await bcrypt.compare(password, user.passwordEstudent);
                    if (validPassword) {
                        return done(null, user, req.flash("success", "Bienvenido" + " " + user.decryptedUsername));
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
    'local.studentSignup',
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
                const existingUser = await orm.student.findOne({ where: { usernameEstudent: cifrarDatos(username) } });
                if (existingUser) {
                    return done(null, false, req.flash('message', 'La cedula del usuario ya existe.'));
                } else {
                    const hashedPassword = await helpers.hashPassword(password);
                    const {
                        idEstudent,
                        completeNameEstudent,
                        emailEstudent,
                        celularEstudent
                    } = req.body;

                    let newClient = {
                        idEstudent: idEstudent,
                        identificationCardTeacher: cifrarDatos(username),
                        celularEstudent: cifrarDatos(celularEstudent),
                        emailEstudent: cifrarDatos(emailEstudent),
                        completeNameEstudent: cifrarDatos(completeNameEstudent),
                        usernameEstudent: cifrarDatos(username),
                        passwordEstudent: hashedPassword,
                        stateEstudent: 'Activar',
                        createStudent: new Date().toLocaleString()
                    };

                    const guardar = await orm.student.create(newClient);

                    if (req.files) {
                        const { photoEstudent } = req.files;

                        // Guardar y subir foto del profesor
                        if (photoEstudent) {
                            const photoFilePath = path.join(__dirname, '/../public/img/usuario/', photoEstudent.name);
                            await guardarYSubirArchivo(photoEstudent, photoFilePath, 'photoEstudent', idEstudent, 'http://localhost:9000/imagenEstudiante', req);
                        }
                    }

                    newClient.id = guardar.insertId
                    return done(null, newClient);
                }
            } catch (error) {
                return done(error);
            }
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
                const existingUser = await orm.teacher.findOne({ where: { identificationCardTeacher: username } });
                if (existingUser) {
                    return done(null, false, req.flash('message', 'La cedula del usuario ya existe.'));
                } else {
                    const {
                        idTeacher,
                        completeNmeTeacher,
                        usernameTeahcer,
                        emailTeacher,
                        phoneTeacher
                    } = req.body;

                    let newClient = {
                        idTeacher: idTeacher,
                        identificationCardTeacher: username,
                        phoneTeacher: cifrarDatos(phoneTeacher),
                        emailTeacher: cifrarDatos(emailTeacher),
                        completeNmeTeacher: cifrarDatos(completeNmeTeacher),
                        usernameTeahcer: usernameTeahcer,
                        passwordTeacher: password,
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