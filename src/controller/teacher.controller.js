const orm = require('../Database/dataBase.orm.js');
const sql = require('../Database/dataBase.sql.js');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');

const teacher = {};

// Función para guardar y subir archivos
const guardarYSubirArchivo = async (archivo, filePath, columnName, idTeacher, url, req) => {
    const validaciones = {
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO"],
        pdf: [".pdf", ".PDF"]
    };
    const tipoArchivo = columnName === 'photoTeacher' ? 'imagen' : 'pdf';
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
                    await sql.promise().query(`UPDATE teachers SET ${columnName} = ? WHERE idTeacher = ?`, [archivo.name, idTeacher]);

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

teacher.mostrar = async (req, res) => {
    try {
        const ids = req.params.id;
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        const [rows] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [ids]);
        const [listaTitulo] = await sql.promise().query('SELECT * FROM specialtyTypes WHERE specialType = "titulo"');
        const [listaTitulosEspecial] = await sql.promise().query('SELECT * FROM specialtyTypes WHERE specialType = "especial"');
        const [listaMaterias] = await sql.promise().query('SELECT * FROM subjects');

        const datos = rows.map(row => ({
            idTeacher: row.idTeacher,
            photoTeacher: row.photoTeacher,
            endorsementCertificateTeacher: row.endorsementCertificateTeacher,
            pageVitalTeacher: row.pageVitalTeacher,
            criminalRecordTeacher: row.criminalRecordTeacher,
            completeNmeTeacher: row.completeNmeTeacher ? safeDecrypt(row.completeNmeTeacher) : '',
            identificationCardTeacher: row.identificationCardTeacher ? safeDecrypt(row.identificationCardTeacher) : '',
            ageTeacher: row.ageTeacher ? safeDecrypt(row.ageTeacher) : '',
            descriptionTeacher: row.descriptionTeacher ? safeDecrypt(row.descriptionTeacher) : '',
            emailTeacher: row.emailTeacher ? safeDecrypt(row.emailTeacher) : '',
            addressTeacher: row.addressTeacher ? safeDecrypt(row.addressTeacher) : '',
            phoneTeacher: row.phoneTeacher ? safeDecrypt(row.phoneTeacher) : '',
            usernameTeahcer: row.usernameTeahcer ? safeDecrypt(row.usernameTeahcer) : ''
        }));

        res.render('profesor/perfilUpdate', {
            listaPagina: pagina,
            listaTeacher: datos,
            listaEspecialidades: listaTitulosEspecial,
            listaTitulos: listaTitulo,
            listaMaterias: listaMaterias,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

// Nueva función de descifrado segura
function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

teacher.update = async (req, res) => {
    const id = req.params.id;

    try {
        const {
            completeNmeTeacher,
            ubicacion,
            eleccion,
            ageTeacher,
            tituloEscogidas = [],
            especialidadesEscogidas = [],
            materiasEscogidas = [],
            edadesEscogidas = [],
            descriptionTeacher,
            identificationCardTeacher,
            phoneTeacher,
            emailTeacher,
            idPagina,
        } = req.body;

        console.log(id)
        const updateTeacher = {
            completeNmeTeacher: cifrarDatos(completeNmeTeacher),
            addressTeacher: cifrarDatos(ubicacion),
            ageTeacher: cifrarDatos(ageTeacher),
            descriptionTeacher: cifrarDatos(descriptionTeacher),
            identificationCardTeacher: cifrarDatos(identificationCardTeacher),
            phoneTeacher: cifrarDatos(phoneTeacher),
            emailTeacher: cifrarDatos(emailTeacher),
            stateTeacher: 'pendiente',
            updateTeacher: new Date().toLocaleString()
        };

        const newchouTeacher = {
            stateTeachCouch: cifrarDatos(eleccion),
            createTeachCouch: new Date().toLocaleString(),
            teacherIdTeacher: id
        };

        const newUnion = {
            crearDetailTeacherPage: Date().toLocaleString(),
            pageIdPage: idPagina,
            teacherIdTeacher: id
        }

        // Actualizar profesor
        const teacherResult = await orm.teacher.findOne({ where: { idTeacher: id } });
        await teacherResult.update(updateTeacher);

        await orm.detailTeachPage.create(newUnion)

        const existingTeachCouch = await orm.teachCouch.findOne({ where: { teacherIdTeacher: id } });

        if (existingTeachCouch) {
            await existingTeachCouch.update({
                stateTeachCouch: cifrarDatos(eleccion),
                updateTeachCouch: new Date().toLocaleString()
            });
        } else {
            await orm.teachCouch.create(newchouTeacher);
    }
        // Insertar títulos escogidos con validación
        const tituloPromises = tituloEscogidas.map(async (titulo, i) => {
            const [results] = await sql.promise().query(
                'SELECT * FROM teacherDetails WHERE rangeAgeTeacher = ? AND subjetTeacher = ? AND teacherIdTeacher = ? AND specialtyTypeIdSpecialType = ?',
                [edadesEscogidas[i], materiasEscogidas[i], id, titulo]
            );
            if (results.length > 0) {
                console.log('Título ya existe');
                return Promise.reject('Título ya existe');
            } else {
                return sql.promise().query(
                    'INSERT INTO teacherDetails(rangeAgeTeacher, subjetTeacher, teacherIdTeacher, specialtyTypeIdSpecialType) VALUES (?,?,?,?)',
                    [edadesEscogidas[i], materiasEscogidas[i], id, titulo]
                );
            }
        });
        await Promise.all(tituloPromises);

        // Insertar especialidades escogidas si existen en el cuerpo de la solicitud
        if (especialidadesEscogidas.length > 0) {
            const especialidadPromises = especialidadesEscogidas.map(async (especialidad, i) => {
                const [results] = await sql.promise().query(
                    'SELECT * FROM teacherDetails WHERE rangeAgeTeacher = ? AND subjetTeacher = ? AND teacherIdTeacher = ? AND specialtyTypeIdSpecialType = ?',
                    [edadesEscogidas[i], materiasEscogidas[i], id, especialidad]
                );
                if (results.length > 0) {
                    console.log('Especialidad ya existe');
                } else {
                    return sql.promise().query(
                        'INSERT INTO teacherDetails(rangeAgeTeacher, subjetTeacher, teacherIdTeacher, specialtyTypeIdSpecialType) VALUES (?,?,?,?)',
                        [edadesEscogidas[i], materiasEscogidas[i], id, especialidad]
                    );
                }
            });
            await Promise.all(especialidadPromises);
        }

        // Manejo de archivos
        if (req.files) {
            const { photoTeacher, endorsementCertificateTeacher, pageVitalTeacher, criminalRecordTeacher } = req.files;

            // Guardar y subir foto del profesor
            if (photoTeacher) {
                const photoFilePath = path.join(__dirname, '/../public/img/user/', photoTeacher.name);
                await guardarYSubirArchivo(photoTeacher, photoFilePath, 'photoTeacher', id, 'http://localhost:9000/imagenTeacher', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (endorsementCertificateTeacher) {
                const endorsementFilePath = path.join(__dirname, '/../public/archivos/teacher/', endorsementCertificateTeacher.name);
                await guardarYSubirArchivo(endorsementCertificateTeacher, endorsementFilePath, 'endorsementCertificateTeacher', id, 'http://localhost:9000/archivosTeacher', req);
            }

            // Guardar y subir hoja de vida
            if (pageVitalTeacher) {
                const pageVitalFilePath = path.join(__dirname, '/../public/archivos/teacher/', pageVitalTeacher.name);
                await guardarYSubirArchivo(pageVitalTeacher, pageVitalFilePath, 'pageVitalTeacher', id, 'http://localhost:9000/archivosTeacher', req);
            }

            // Guardar y subir certificado de antecedentes penales
            if (criminalRecordTeacher) {
                const criminalRecordFilePath = path.join(__dirname, '/../public/archivos/teacher/', criminalRecordTeacher.name);
                await guardarYSubirArchivo(criminalRecordTeacher, criminalRecordFilePath, 'criminalRecordTeacher', id, 'http://localhost:9000/archivosTeacher', req);
            }
        }

        res.redirect('/teacher/lista/' + id);
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

teacher.lista = async (req, res) => {
    try {
        const ids = req.params.id;
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        const [rows] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [ids]);
        const [listaMaterias] = await sql.promise().query('SELECT t.*, s.* FROM teacherDetails t JOIN specialtyTypes s ON t.specialtyTypeIdSpecialType = s.idSpecialType WHERE teacherIdTeacher = ?', [ids]);
        const [teachCouch] = await sql.promise().query('SELECT * FROM teachCouches WHERE teacherIdTeacher = ?', [ids])
        const [detalle] = await sql.promise().query('SELECT * FROM teacherDetails WHERE teacherIdTeacher = ?', [ids])

        const datos = rows.map(row => ({
            idTeacher: row.idTeacher,
            photoTeacher: row.photoTeacher,
            endorsementCertificateTeacher: row.endorsementCertificateTeacher,
            pageVitalTeacher: row.pageVitalTeacher,
            criminalRecordTeacher: row.criminalRecordTeacher,
            completeNmeTeacher: row.completeNmeTeacher ? descifrarDatos(row.completeNmeTeacher) : '',
            identificationCardTeacher: row.identificationCardTeacher ? descifrarDatos(row.identificationCardTeacher) : '',
            ageTeacher: row.ageTeacher ? descifrarDatos(row.ageTeacher) : '',
            descriptionTeacher: row.descriptionTeacher ? descifrarDatos(row.descriptionTeacher) : '',
            emailTeacher: row.emailTeacher ? descifrarDatos(row.emailTeacher) : '',
            addressTeacher: row.addressTeacher ? descifrarDatos(row.addressTeacher) : '',
            phoneTeacher: row.phoneTeacher ? descifrarDatos(row.phoneTeacher) : '',
            usernameTeahcer: row.usernameTeahcer ? descifrarDatos(row.usernameTeahcer) : '',
            stateTeacher: row.stateTeacher
        }));
        const datosCouch =teachCouch.map(row => ({ 
            stateTeachCouch: descifrarDatos(row.stateTeachCouch)
        }));
        res.render('profesor/perfilList', {
            listaPagina: pagina,
            listaTeacher: datos,
            listaChouch: datosCouch,
            listaMaterias: listaMaterias,
            listaDetalle: detalle,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = teacher;