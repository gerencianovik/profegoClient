const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const { validationResult } = require('express-validator');
const classes = {}

const guardarYSubirArchivo = async (archivo, filePath, columnName, idClases, url, req) => {
    const validaciones = {
        image: [
            // Formatos estándar web
            ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
            ".bmp", ".tif", ".tiff", ".ico", ".heic", ".heif",

            // Formatos profesionales y RAW
            ".raw", ".cr2", ".nef", ".orf", ".sr2", ".arw",
            ".dng", ".rw2", ".raf", ".pef", ".x3f", ".crw",
            ".erf", ".mrw", ".dcr", ".kdc", ".mos", ".iiq",

            // Formatos de diseño gráfico
            ".psd", ".ai", ".eps", ".indd", ".cdr", ".svgz",

            // Formatos médicos y científicos
            ".dcm", ".dicom", ".nii", ".nrrd",

            // Formatos 3D y HDR
            ".hdr", ".exr", ".dds", ".ktx", ".ptex",

            // Formatos antiguos o especializados
            ".pcx", ".pbm", ".pgm", ".ppm", ".pnm", ".tga",

            // Extensiones en mayúsculas
            ".PNG", ".JPG", ".JPEG", ".GIF", ".WEBP", ".SVG",
            ".BMP", ".TIF", ".TIFF", ".ICO", ".HEIC", ".HEIF",
            ".RAW", ".CR2", ".NEF", ".ORF", ".SR2", ".ARW",
            ".DNG", ".RW2", ".RAF", ".PEF", ".X3F", ".CRW",
            ".ERF", ".MRW", ".DCR", ".KDC", ".MOS", ".IIQ",
            ".PSD", ".AI", ".EPS", ".INDD", ".CDR", ".SVGZ",
            ".DCM", ".DICOM", ".NII", ".NRRD",
            ".HDR", ".EXR", ".DDS", ".KTX", ".PTEX",
            ".PCX", ".PBM", ".PGM", ".PPM", ".PNM", ".TGA",

            // Formatos menos comunes
            ".jxr", ".wdp", ".jpf", ".jpx", ".jpm", ".j2k",
            ".j2c", ".jpc", ".pgf", ".ico", ".cur",

            // Formatos de documentos como imágenes
            ".ppt", ".pptx"
        ],
        video: [
            // Formatos comunes
            ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv",
            ".webm", ".mpeg", ".mpg", ".m4v", ".3gp", ".3g2",

            // Formatos profesionales
            ".prores", ".dnxhd", ".cineform", ".r3d", ".ari",

            // Formatos de alta calidad
            ".hevc", ".vp9", ".av1", ".ogv", ".yuv",

            // Formatos antiguos
            ".rm", ".rmvb", ".asf", ".vob", ".ts", ".m2ts", ".mts",

            // Variantes de los formatos principales
            ".divx", ".xvid", ".h264", ".h265", ".mp4v", ".mp4a",

            // Extensiones en mayúsculas
            ".MP4", ".AVI", ".MOV", ".WMV", ".FLV", ".MKV",
            ".WEBM", ".MPEG", ".MPG", ".M4V", ".3GP", ".3G2",
            ".PRORES", ".DNXHD", ".CINEFORM", ".R3D", ".ARI",
            ".HEVC", ".VP9", ".AV1", ".OGV", ".YUV",
            ".RM", ".RMVB", ".ASF", ".VOB", ".TS", ".M2TS", ".MTS",
            ".DIVX", ".XVID", ".H264", ".H265", ".MP4V", ".MP4A",

            // Formatos menos comunes pero existentes
            ".nut", ".swf", ".amv", ".mxf", ".roq", ".nsv",
            ".NUT", ".SWF", ".AMV", ".MXF", ".ROQ", ".NSV"
        ]
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
                    await sql.promise().query(`UPDATE Clases SET ${columnName} = ? WHERE idClases = ?`, [archivo.name, idClases]);

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
        const [maxCours] = await sql.promise().query('SELECT MAX(idClases) AS Maximo FROM Clases')
        res.render('clases/add', { listaPagina: pagina, MaximoCurso: maxCours, listaTeacher: teacher, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

classes.mandar = async (req, res) => {
    const ids = req.params.id;
    try {
        const id = req.user.idTeacher;
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE teacherIdTeacher = ?', [id]);
        const teacherDetail = detailTeacher[0]
        console.log('holabs', teacherDetail.idDetailTeacherPage);
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
            stateCours: 'Activar',
            detailTeacherPageIdDetailTeacherPage: teacherDetail.idDetailTeacherPage
        };

        await orm.clases.create(newPage);

        for (let edad of edadesEscogidas) {
            await sql.promise().query('INSERT INTO DetalleClases(rangoEdadClase, createDetailDetalleClasee, ClaseIdClases) VALUES(?,?,?)', [edad, new Date().toLocaleString(), idClases]);
        }

        if (req.files) {
            const { photoClases, videoClases } = req.files;

            // Guardar y subir foto del profesor
            if (photoClases) {
                const photoFilePath = path.join(__dirname, '/../public/img/clase/', photoClases.name);
                await guardarYSubirArchivo(photoClases, photoFilePath, 'photoClases', idClases, 'https://central.profego-edu.com/imagenClase', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (videoClases) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/clases/', videoClases.name);
                await guardarYSubirArchivo(videoClases, endorsementFilePath, 'videoClases', idClases, 'https://central.profego-edu.com/videoClases', req);
            }
        }

        req.flash('success', 'Exito al guardar');
        res.redirect('/clases/list/' + ids);
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
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE teacherIdTeacher = ?', [id]);
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        const [row] = await sql.promise().query('SELECT * FROM Clases WHERE detailTeacherPageIdDetailTeacherPage = ?', [detailTeacher[0].idDetailTeacherPage]);
        res.render('clases/list', { lista: row, listaPagina: pagina, teacherLista: teacher, listaTipoCurso: tipoCurso, })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

classes.listaStudents = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = "1"',);
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [row] = await sql.promise().query('SELECT * FROM Clases')
        res.render('clases/students/list', { lista: row, listaPagina: pagina, teacherLista: teacher })
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
        const { idClases, nameClases, ubicacion, descriptionClases, stateClases, dateClasesInit, dateClasesFin, neeClass, hourClases, shareClases, costClases } = req.body;
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
            stateClases
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
                await guardarYSubirArchivo(photoClases, photoFilePath, 'photoClases', idClases, 'https://central.profego-edu.com/imagenClase', req);
            }

            // Guardar y subir certificado de aval de enseñanza
            if (videoClases) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/clases/', videoClases.name);
                await guardarYSubirArchivo(videoClases, endorsementFilePath, 'videoClases', idClases, 'https://central.profego-edu.com/videoClases', req);
            }
        }

        req.flash('success', 'Exito al guardar');
        res.redirect('/clases/list/' + req.user.idTeacher);
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
            .then(async (result) => {
                await result.update(newSpeciality);
                res.redirect('/clases/list/' + req.user.idTeacher);
                req.flash('success', 'Se Desabilitó la Clase');
            })
    } catch (error) {
        req.flash('message', 'Error al Desabilitar la Clase')
        res.redirect('/clases/list/' + req.user.idTeacher);
    }
}

classes.habilitar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const newSpeciality = {
            stateClases: 'Activar',
            updateClases: new Date().toLocaleString(),
        }
        await orm.clases.findOne({ where: { idClases: ids } })
            .then(async (result) => {
                await result.update(newSpeciality);
                res.redirect('/clases/list/' + req.user.idTeacher);
                req.flash('success', 'Se Habilitó la Clase');
            })
    } catch (error) {
        req.flash('message', 'Error al Habilitar la Clase')
        res.redirect('/clases/list/' + req.user.idTeacher);
    }
}

classes.detalle = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [row] = await sql.promise().query('SELECT C.* FROM Clases C where idClases = ?', [id])
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabusEducationals s JOIN detailCurricularContents d ON s.idsyllabusEducational = d.syllabusEducationalIdsyllabusEducational WHERE ClaseIdClases = ?', [id])
        const [teacher] = await sql.promise().query('SELECT t.* FROM teachers t JOIN detailTeacherPages d ON t.idTeacher = d.teacherIdTeacher JOIN Clases c ON d.idDetailTeacherPage = c.detailTeacherPageIdDetailTeacherPage WHERE idClases = ?', [id])
        const [detalle] = await sql.promise().query('SELECT * FROM DetalleClases WHERE ClaseIdClases = ?', [id])
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
            stateTeacher: row.stateTeacher
        }));
        res.render('clases/detalle', { lista: row, listaPagina: pagina, temario: silabus, listaDetalle: detalle, recursos: recursos, materiales: materiales, tareas: tareas, Pruebas: pruebas, docenteLista: datos })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

classes.detalleStudnets = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [row] = await sql.promise().query('SELECT C.* FROM clases C where idClases = ?', [id])
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabusEducationals s JOIN detailcurricularcontents d ON S.idsyllabusEducational = d.syllabusEducationalIdsyllabusEducational WHERE ClaseIdClases = ?', [id])
        const [teacher] = await sql.promise().query('SELECT t.* FROM teachers t JOIN detailTeacherPages d ON t.idTeacher = d.teacherIdTeacher JOIN clases c ON d.idDetailTeacherPage = c.detailTeacherPageIdDetailTeacherPage WHERE idClases = ?', [id])
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
        res.render('clases/students/detalle', { lista: row, listaPagina: pagina, temario: silabus, listaDetalle: detalle, recursos: recursos, materiales: materiales, tareas: tareas, Pruebas: pruebas, docenteLista: datos })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

module.exports = classes