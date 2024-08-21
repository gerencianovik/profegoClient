const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')
const { validationResult } = require('express-validator');
const classes = {}

const guardarYSubirArchivo = async (archivo, filePath, columnName, idClases, url, req) => {
    const validaciones = {
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO"],
        video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".MP4", ".AVI", ".MOV", ".WMV", ".FLV"]
    };
    const tipoArchivo = columnName === 'photoClases' ? 'imagen' : 'video';
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
                    await sql.promise().query(`UPDATE clases SET ${columnName} = ? WHERE idClases = ?`, [archivo.name, idClases]);

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

classes.mostrar = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [maxCours] = await sql.promise().query('SELECT MAX(idClases) AS Maximo FROM clases')
        res.render('clases/add', { listaPagina: pagina, MaximoCurso: maxCours, listaTeacher: teacher, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

classes.mandar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.user.idUser;
        let idTeacher;

        // Obtener el idTeacher
        const teacher = await sql.query('SELECT * FROM detailteacherpages WHERE pageIdPage = "1"');
        console.log(teacher[0].teacherIdTeacher)
        if (teacher[0].teacherIdTeacher == id) {
            idTeacher = teacherEntry.idDetailTeacherPagex;
        }
        const { idClases, nameClases, ubicacion, edadesEscogidas, tipoClases, descriptionClases, dateClasesInit, dateClasesFin, neeClass, hourClases, shareClases, costClases } = req.body;
        const newPage = {
            idClases,
            nameClases,
            descriptionClases,
            ubicacionClase: ubicacion,
            dateClasesInit,
            dateClasesFin,
            neeClass,
            hourClases,
            shareClases,
            costClases,
            tipoClases,
            createClases: new Date().toLocaleString(),
            stateclasses: 'Activar',
            pageIdPage: id,
            coursClassTypeIdCoursClassType: ids
        };

        await orm.clases.create(newPage);

        for (let edad of edadesEscogidas) {
            await sql.promise().query('INSERT INTO detalleclases(rangoEdadClase, createDetailDetalleClasee, ClaseIdClases) VALUES(?,?,?)', [edad, new Date().toLocaleString(), idClases]);
        }

        if (req.files) {
            const { photoClases, videoClases } = req.files;

            // Guardar y subir foto del profesor
            if (photoClases) {
                const photoFilePath = path.join(__dirname, '/../public/img/clase/', photoClases.name);
                await guardarYSubirArchivo(photoClases, photoFilePath, 'photoClases', idClases, 'http://localhost:5000/imagenClase', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (videoClases) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/clases/', videoClases.name);
                await guardarYSubirArchivo(videoClases, endorsementFilePath, 'videoClases', idClases, 'http://localhost:5000/videoClases', req);
            }
        }

        req.flash('success', 'Exito al guardar');
        res.redirect('/clases/list/' + id);
    } catch (error) {
        // Manejo de errores mejorado
        console.error(error);
        req.flash('message', 'Error al guardar');
        res.redirect('/clases/add/' + ids);
    }
}

classes.lista = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = "1"',);
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [row] = await sql.promise().query('SELECT * FROM Clases')
        res.render('clases/list', { lista: row, listaPagina: pagina, teacherLista: teacher })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

classes.traerDatos = async (req, res) => {
    try {
        const id = req.params.id
        const [row] = await sql.promise().query('SELECT * FROM Clases WHERE idClases = ?', [id])
        res.render('clases/update', { lista: row, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

classes.actualizar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.user.idUser;
        const { idClases, nameClases, ubicacion, descriptionClases, stateclasses, dateClasesInit, dateClasesFin, neeClass, hourClases, shareClases, costClases } = req.body;
        const newPage = {
            idClases,
            nameClases,
            descriptionClases,
            ubicacionClase: ubicacion,
            dateClasesInit,
            dateClasesFin,
            neeClass,
            hourClases,
            shareClases,
            costClases,
            updateClases: new Date().toLocaleString(),
            stateclasses
        };
        await orm.clases.findOne({ where: { idClases: ids } })
            .then((result) => {
                result.update(newPage)
            })

        if (req.files) {
            const { photoClases, videoClases } = req.files;

            // Guardar y subir foto del profesor
            if (photoClases) {
                const photoFilePath = path.join(__dirname, '/../public/img/clase/', photoClases.name);
                await guardarYSubirArchivo(photoClases, photoFilePath, 'photoClases', idClases, 'http://localhost:5000/imagenClase', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (videoClases) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/clases/', videoClases.name);
                await guardarYSubirArchivo(videoClases, endorsementFilePath, 'videoClases', idClases, 'http://localhost:5000/videoClases', req);
            }
        }

        req.flash('success', 'Exito al guardar');
        res.redirect('/clases/list/' + id);
    } catch (error) {
        console.error(error);
        req.flash('message', 'Error al Actualizar');
        res.redirect('/clases/update/' + ids);
    }
}

classes.desabilitar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newSpeciality = {
            stateClases: 'Desactivar',
            updateClases: new Date().toLocaleString(),
        }
        await orm.clases.findOne({ where: { idClases: ids } })
            .then((result) => {
                result.update(newSpeciality)
                req.flash('success', 'Se Desabilito la Clase')
                res.redirect('/clases/list/' + ids);
            })
    } catch (error) {
        req.flash('message', 'Error al Desabilitar la Clase')
        res.redirect('/clases/update/' + ids);
    }
}

classes.detalle = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [row] = await sql.promise().query('SELECT C.*, T.* FROM clases C JOIN coursClassTypes T ON C.coursClassTypeIdCoursClassType = T.idCoursClassType where idClases = ?', [id])
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabuseducationals s JOIN detailcurricularcontents d ON S.idsyllabusEducational = d.syllabusEducationalIdsyllabusEducational WHERE ClaseIdClases = ?', [id])
        const [teacher] = await sql.promise().query('SELECT t.* FROM teachers t JOIN detailteacherpages d ON t.idTeacher = d.teacherIdTeacher JOIN clases c ON d.idDetailTeacherPage = c.detailTeacherPageIdDetailTeacherPage WHERE idClases = ?', [id])
        const [detalle] = await sql.promise().query('SELECT * FROM detalleclases WHERE ClaseIdClases = ?', [id])
        const [recursos] = await sql.promise().query('SELECT * FROM recours WHERE ClaseIdClases = ?', [id])
        const [materiales] = await sql.promise().query('SELECT * FROM materials WHERE ClaseIdClases = ?', [id])
        const [tareas] = await sql.promise().query('SELECT * FROM tasks WHERE ClaseIdClases = ?', [id])
        const [pruebas] = await sql.promise().query('SELECT * FROM assessments WHERE ClaseIdClases = ?', [id])
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
        res.render('clases/detalle', { lista: row, listaPagina: pagina, temario: silabus, listaDetalle: detalle, recursos: recursos, materiales: materiales, tareas: tareas, Pruebas: pruebas, docenteLista: datos })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

module.exports = classes