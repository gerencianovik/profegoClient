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
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO", ".webp", ".WEBP"],
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
        // 1. Obtener datos del formulario
        const {
            completeNmeTeacher,
            ubicacion,
            eleccion,
            ageTeacher,
            tituloEscogidas,
            especialidadesEscogidas,
            materiasEscogidas,
            edadesEscogidas,
            descriptionTeacher,
            identificationCardTeacher,
            phoneTeacher,
            emailTeacher,
            idPagina,
        } = req.body;

        // 2. Procesamiento de datos recibidos (manteniendo el orden exacto)
        const titulosArray = tituloEscogidas
            ? (Array.isArray(tituloEscogidas) ? tituloEscogidas : [tituloEscogidas]).filter(t => t !== '')
            : [];

        const materiasArray = materiasEscogidas
            ? (Array.isArray(materiasEscogidas)
                ? materiasEscogidas.map(m => m.trim()).filter(m => m !== '')
                : [materiasEscogidas.trim()].filter(m => m !== ''))
            : [];

        const edadesArray = edadesEscogidas
            ? (Array.isArray(edadesEscogidas)
                ? edadesEscogidas.filter(e => e !== '')
                : [edadesEscogidas].filter(e => e !== ''))
            : [];

        console.log('Datos recibidos en orden:', {
            titulos: titulosArray,
            materias: materiasArray,
            edades: edadesArray
        });

        // 3. Actualización de información básica del profesor
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

        const teacherResult = await orm.teacher.findOne({ where: { idTeacher: id } });
        await teacherResult.update(updateTeacher);

        // 4. Actualización de tipo (docente/coach)
        const existingTeachCouch = await orm.teachCouch.findOne({ where: { teacherIdTeacher: id } });
        if (existingTeachCouch) {
            await existingTeachCouch.update({
                stateTeachCouch: cifrarDatos(eleccion),
                updateTeachCouch: new Date().toLocaleString()
            });
        } else {
            await orm.teachCouch.create({
                stateTeachCouch: cifrarDatos(eleccion),
                createTeachCouch: new Date().toLocaleString(),
                teacherIdTeacher: id
            });
        }

        // 5. Actualización de relación con la página
        const teacherDetails = await orm.detailTeachPage.findOne({ where: { teacherIdTeacher: id } });
        if (teacherDetails) {
            await teacherDetails.update({
                pageIdPage: idPagina,
                updateDetailTeacherPage: new Date().toLocaleString()
            });
        } else {
            await orm.detailTeachPage.create({
                crearDetailTeacherPage: new Date().toLocaleString(),
                pageIdPage: idPagina,
                teacherIdTeacher: id
            });
        }

        // 6. Procesamiento de teacherDetails (manteniendo orden exacto)
        await sql.promise().query('DELETE FROM teacherDetails WHERE teacherIdTeacher = ?', [id]);

        // Determinar la longitud máxima de los arrays
        const maxLength = Math.max(
            titulosArray.length,
            materiasArray.length,
            edadesArray.length
        );

        // Insertar datos en el orden exacto recibido
        for (let i = 0; i < maxLength; i++) {
            const titulo = titulosArray[i] || null;
            const materia = materiasArray[i] || null;
            const edad = edadesArray[i] || null;

            await sql.promise().query(
                'INSERT INTO teacherDetails (rangeAgeTeacher, subjetTeacher, teacherIdTeacher, specialtyTypeIdSpecialType) VALUES (?, ?, ?, ?)',
                [edad, materia, id, titulo]
            );
        }

        // 7. Manejo de archivos (opcional)
        if (req.files) {
            const { photoTeacher, endorsementCertificateTeacher, pageVitalTeacher, criminalRecordTeacher } = req.files;

            const handleFile = async (file, fieldName, folder) => {
                if (file) {
                    const filePath = path.join(__dirname, `/../public/${folder}/`, file.name);
                    await guardarYSubirArchivo(
                        file,
                        filePath,
                        fieldName,
                        id,
                        `https://www.central.profego-edu.com/${folder === 'img/user' ? 'imagenTeacher' : 'archivosTeacher'}`,
                        req
                    );
                    console.log(`${fieldName} guardado correctamente`);
                }
            };

            await handleFile(photoTeacher, 'photoTeacher', 'img/user');
            await handleFile(endorsementCertificateTeacher, 'endorsementCertificateTeacher', 'archivos/teacher');
            await handleFile(pageVitalTeacher, 'pageVitalTeacher', 'archivos/teacher');
            
            if (criminalRecordTeacher) {
                await handleFile(criminalRecordTeacher, 'criminalRecordTeacher', 'archivos/teacher');
            }
        }

        res.redirect('/teacher/lista/' + id);
    } catch (error) {
        console.error('Error en la actualización:', error);
        req.flash('error', 'Error al actualizar: ' + error.message);
        res.redirect(`/teacher/update/${id}`);
    }
};

teacher.lista = async (req, res) => {
    try {
        const ids = req.params.id;

        // Consultas a la base de datos
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        const [rows] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [ids]);
        const [listaMaterias] = await sql.promise().query('SELECT t.*, s.* FROM teacherDetails t JOIN specialtyTypes s ON t.specialtyTypeIdSpecialType = s.idSpecialType WHERE teacherIdTeacher = ?', [ids]);
        const [teachCouch] = await sql.promise().query('SELECT * FROM teachCouches WHERE teacherIdTeacher = ?', [ids]);
        const [detalle] = await sql.promise().query('SELECT * FROM teacherDetails WHERE teacherIdTeacher = ?', [ids]);

        // Mapear datos del profesor
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
            usernameTeahcer: row.usernameTeahcer ? safeDecrypt(row.usernameTeahcer) : '',
            stateTeacher: row.stateTeacher
        }));

        // Mapear datos de los detalles del couch
        const datosCouch = teachCouch.map(row => ({
            stateTeachCouch: row.stateTeachCouch ? safeDecrypt(row.stateTeachCouch) : ''
        }));

        // Renderizar la vista con los datos
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