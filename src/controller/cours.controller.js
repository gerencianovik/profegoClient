const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const { validationResult } = require('express-validator');
const cours = {}

const guardarYSubirArchivo = async (archivo, filePath, columnName, idTeacher, url, req) => {
    const validaciones = {
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO", '.webp', ".WEBP"],
        video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".MP4", ".AVI", ".MOV", ".WMV", ".FLV"]
    };
    const tipoArchivo = columnName === 'photoCours' ? 'imagen' : 'video';
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
                    await sql.promise().query(`UPDATE cours SET ${columnName} = ? WHERE idCours = ?`, [archivo.name, idTeacher]);

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

cours.mostrar = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [maxCours] = await sql.promise().query('SELECT MAX(idCours) AS Maximo FROM cours');
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        res.render('cours/add', { listaTipoCurso: tipoCurso, listaPagina: pagina, MaximoCurso: maxCours, listaTeacher: teacher, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};


cours.mandar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.user.idTeacher;
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE teacherIdTeacher = ?', [id]);
        const teacherDetail = detailTeacher[0]
        console.log('holabs', teacherDetail.idDetailTeacherPage);
        const { idCours, ubicacion, neeCours, edadesEscogidas, tipoCurso, nameCours, descriptionCours, dateCoursInit, dateCoursFin, hourCours, shareCours, costCours } = req.body;
        const newPage = {
            idCours,
            ubicacionCurso: ubicacion,
            tipoCurso,
            neeCours,
            nameCours,
            descriptionCours,
            dateCoursInit,
            dateCoursFin,
            hourCours,
            shareCours,
            costCours,
            createCours: new Date().toLocaleString(),
            stateCours: 'Activar',
            detailTeacherPageIdDetailTeacherPage: teacherDetail.idDetailTeacherPage
        };

        // Crear el curso
        await orm.cours.create(newPage);
        // Insertar edades escogidas
        for (let edad of edadesEscogidas) {
            await sql.promise().query('INSERT INTO DetalleCursos(rangoEdadCurso, createDetailCurso, courIdCours) VALUES(?,?,?)', [edad, new Date().toLocaleString(), idCours]);
        }

        // Manejo de archivos
        if (req.files) {
            const { photoCours, videoCours } = req.files;

            if (photoCours) {
                const photoFilePath = path.join(__dirname, '/../public/img/cours/', photoCours.name);
                await guardarYSubirArchivo(photoCours, photoFilePath, 'photoCours', idCours, 'https://central.profego-edu.com/imagenCours', req);
            }

            if (videoCours) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/cours/', videoCours.name);
                await guardarYSubirArchivo(videoCours, endorsementFilePath, 'videoCours', idCours, 'https://central.profego-edu.com/videoCours', req);
            }
        }

        req.flash('success', 'Éxito al guardar');
        res.redirect('/cours/list/' + id);
    } catch (error) {
        console.error(error);
        req.flash('message', 'Error al guardar');
        res.redirect('/cours/add/' + ids);
    }
}

function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

cours.lista = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = ?', [id]);
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE teacherIdTeacher = ?', [id]);
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        const [row] = await sql.promise().query('SELECT * FROM cours WHERE detailTeacherPageIdDetailTeacherPage = ?', [detailTeacher[0].idDetailTeacherPage]);
        const datos = teacher.map(row => ({
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
        res.render('cours/list', { lista: row, listaPagina: pagina, listaTeacher: datos, listaTipoCurso: tipoCurso, })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

cours.studentLista = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = ?', [id]);
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [row] = await sql.promise().query('SELECT * FROM cours ', [id])
        res.render('cours/students/list', { lista: row, listaPagina: pagina, listaTeacher: teacher, })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

cours.detalle = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [row] = await sql.promise().query('SELECT C.* FROM cours C where idCours = ?', [id])
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabusEducationals s JOIN detailCurricularContents d ON s.idsyllabusEducational = d.syllabusEducationalIdsyllabusEducational WHERE courIdCours = ?', [id])
        const [teacher] = await sql.promise().query('SELECT t.* FROM teachers t JOIN detailTeacherPages d ON t.idTeacher = d.teacherIdTeacher JOIN cours c ON d.idDetailTeacherPage = c.detailTeacherPageIdDetailTeacherPage WHERE idCours = ?', [id])
        const [detalle] = await sql.promise().query('SELECT * FROM DetalleCursos WHERE courIdCours = ?', [id])
        const [recursos] = await sql.promise().query('SELECT * FROM recours WHERE courIdCours = ?', [id])
        const [materiales] = await sql.promise().query('SELECT * FROM materials WHERE courIdCours = ?', [id])
        const [tareas] = await sql.promise().query('SELECT * FROM tasks WHERE courIdCours = ?', [id])
        const [pruebas] = await sql.promise().query('SELECT * FROM assessments WHERE courIdCours = ?', [id])
        const datos = teacher.map(row => ({
            photoTeacher: row.photoTeacher,
            endorsementCertificateTeacher: row.endorsementCertificateTeacher,
            pageVitalTeacher: row.pageVitalTeacher,
            criminalRecordTeacher: row.criminalRecordTeacher,
            completeNmeTeacher: row.completeNmeTeacher ? descifrarDatos(row.completeNmeTeacher) : '',
            stateTeacher: row.stateTeacher
        }));

        res.render('cours/detalle', { docenteLista: datos, lista: row, listaPagina: pagina, temario: silabus, listaDetalle: detalle, recursos: recursos, materiales: materiales, tareas: tareas, Pruebas: pruebas })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}


cours.detalleStudent = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [row] = await sql.promise().query('SELECT C.* FROM cours C where idCours = ?', [id])
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabusEducationals s JOIN detailCurricularContents d ON s.idsyllabusEducational = d.syllabusEducationalIdsyllabusEducational WHERE courIdCours = ?', [id])
        const [teacher] = await sql.promise().query('SELECT t.* FROM teachers t JOIN detailTeacherPages d ON t.idTeacher = d.teacherIdTeacher JOIN cours c ON d.idDetailTeacherPage = c.detailTeacherPageIdDetailTeacherPage WHERE idCours = ?', [id])
        const [detalle] = await sql.promise().query('SELECT * FROM DetalleCursos WHERE courIdCours = ?', [id])
        const [recursos] = await sql.promise().query('SELECT * FROM recours WHERE courIdCours = ?', [id])
        const [materiales] = await sql.promise().query('SELECT * FROM materials WHERE courIdCours = ?', [id])
        const [tareas] = await sql.promise().query('SELECT * FROM tasks WHERE courIdCours = ?', [id])
        const [pruebas] = await sql.promise().query('SELECT * FROM assessments WHERE courIdCours = ?', [id])
        const datos = teacher.map(row => ({
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
        res.render('cours/students/detalle', { lista: row, listaPagina: pagina, temario: silabus, listaDetalle: detalle, recursos: recursos, materiales: materiales, tareas: tareas, Pruebas: pruebas, docenteLista: datos })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

cours.traerDatos = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = ?', [id]);
        const [row] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [id]);
        const [detalleCurso] = await sql.promise().query('SELECT * FROM DetalleCursos WHERE courIdCours = ?', [id])
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        res.render('cours/update', { listaTipoCurso: tipoCurso, edadesArray: detalleCurso, lista: row, listaPagina: pagina, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

cours.actualizar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { idCours, ubicacion, neeCours, nameCours, descriptionCours, dateCoursInit, dateCoursFin, hourCours, shareCours, costCours, stateCours } = req.body;
        const newPage = {
            idCours,
            ubicacionCurso: ubicacion,
            neeCours,
            nameCours,
            descriptionCours,
            dateCoursInit,
            dateCoursFin,
            hourCours,
            shareCours,
            costCours,
            updateCours: new Date().toLocaleString(),
            stateCours,
        };
        await orm.cours.findOne({ where: { idCours: ids } })
            .then((result) => {
                result.update(newPage)
            })

        if (req.files) {
            const { photoCours, videoCours } = req.files;

            // Guardar y subir foto del profesor
            if (photoCours) {
                const photoFilePath = path.join(__dirname, '/../public/img/cours/', photoCours.name);
                await guardarYSubirArchivo(photoCours, photoFilePath, 'photoCours', idCours, 'https://central.profego-edu.com/imagenCours', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (videoCours) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/cours/', videoCours.name);
                await guardarYSubirArchivo(videoCours, endorsementFilePath, 'videoCours', idCours, 'https://central.profego-edu.com/videoCours', req);
            }
        }
        req.flash('success', 'Exito al guardar');
        res.redirect('/cours/list/' + ids);
    } catch (error) {
        // Manejo de errores mejorado
        console.error(error);
        req.flash('message', 'Error al guardar');
        res.redirect('/cours/list/' + ids);
    }
}

cours.desabilitar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newSpeciality = {
            stateCours: 'Desactivar',
            updateCours: new Date().toLocaleString(),
        }
        await orm.cours.findOne({ where: { idCours: ids } })
            .then(async (result) => {
                await result.update(newSpeciality)
                req.flash('success', 'Se Desabilitó el Curso')
                res.redirect('/cours/list/' + req.user.idTeacher);
            })
    } catch (error) {
        req.flash('message', 'Error al Desabilitar el Curso')
        res.redirect('/cours/list/' + req.user.idTeacher);
    }
}

cours.habilitar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newSpeciality = {
            stateCours: 'Activar',
            updateCours: new Date().toLocaleString(),
        }
        await orm.cours.findOne({ where: { idCours: ids } })
            .then(async (result) => {
                await result.update(newSpeciality)
                req.flash('success', 'Se Habilitó el Curso')
                res.redirect('/cours/list/' + req.user.idTeacher);
            })
    } catch (error) {
        req.flash('message', 'Error al Habilitar el Curso')
        res.redirect('/cours/list/' + req.user.idTeacher);
    }
}


module.exports = cours