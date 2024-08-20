const orm = require('../Database/dataBase.orm.js');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const student = {};

// Función para guardar y subir archivos
const guardarYSubirArchivo = async (archivo, filePath, columnName, idStudent, url, req) => {
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
                    await orm.student.update({ [columnName]: archivo.name }, { where: { idEstudent: idStudent } });

                    const formData = new FormData();
                    formData.append('file', fs.createReadStream(filePath), {
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

student.mostrar = async (req, res) => {
    try {
        const id = req.params.id;

        // Obtener datos del estudiante
        const studentData = await orm.student.findOne({ where: { idEstudent: id } });

        if (!studentData) {
            return res.status(404).send('Estudiante no encontrado');
        }

        // Crear objeto con datos del estudiante
        const datos = {
            idEstudent: studentData.idEstudent,
            photoEstudent: studentData.photoEstudent,
            completeNameEstudent: studentData.completeNameEstudent ? descifrarDatos(studentData.completeNameEstudent) : '',
            emailEstudent: studentData.emailEstudent ? descifrarDatos(studentData.emailEstudent) : '',
            celularEstudent: studentData.celularEstudent ? descifrarDatos(studentData.celularEstudent) : '',
            usernameEstudent: studentData.usernameEstudent ? descifrarDatos(studentData.usernameEstudent) : '',
            stateEstudent: studentData.stateEstudent,
            createStudent: studentData.createStudent,
            updateStudent: studentData.updateStudent
        };

        res.render('estudiante/perfilUpdate', {
            listaEstudent: datos,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

student.update = async (req, res) => {
    const id = req.params.id;

    try {
        const {
            completeNameEstudent,
            emailEstudent,
            celularEstudent,
            usernameEstudent,
            stateEstudent
        } = req.body;

        const updateStudent = {
            completeNameEstudent: cifrarDatos(completeNameEstudent),
            emailEstudent: cifrarDatos(emailEstudent),
            celularEstudent: cifrarDatos(celularEstudent),
            usernameEstudent: cifrarDatos(usernameEstudent),
            stateEstudent: stateEstudent,
            updateStudent: new Date().toLocaleString()
        };

        // Actualizar estudiante
        await orm.student.update(updateStudent, { where: { idEstudent: id } });

        // Manejo de archivos
        if (req.files) {
            const { photoEstudent } = req.files;

            // Guardar y subir foto del estudiante
            if (photoEstudent) {
                const photoFilePath = path.join(__dirname, '/../public/img/student/', photoEstudent.name);
                await guardarYSubirArchivo(photoEstudent, photoFilePath, 'photoEstudent', id, 'http://localhost:9000/imagenStudent', req);
            }
        }

        res.redirect('/student/lista/' + id);
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

student.lista = async (req, res) => {
    try {
        const id = req.params.id;

        // Consultas a la base de datos
        const studentData = await orm.student.findOne({ where: { idEstudent: id } });

        if (!studentData) {
            return res.status(404).send('Estudiante no encontrado');
        }

        // Crear objeto con datos del estudiante
        const datos = {
            idEstudent: studentData.idEstudent,
            photoEstudent: studentData.photoEstudent,
            completeNameEstudent: studentData.completeNameEstudent ? descifrarDatos(studentData.completeNameEstudent) : '',
            emailEstudent: studentData.emailEstudent ? descifrarDatos(studentData.emailEstudent) : '',
            celularEstudent: studentData.celularEstudent ? descifrarDatos(studentData.celularEstudent) : '',
            usernameEstudent: studentData.usernameEstudent ? descifrarDatos(studentData.usernameEstudent) : '',
            stateEstudent: studentData.stateEstudent,
            createStudent: studentData.createStudent,
            updateStudent: studentData.updateStudent
        };

        // Renderizar la vista con los datos
        res.render('estudiante/perfilList', {
            listaStudent: datos,
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = student;
