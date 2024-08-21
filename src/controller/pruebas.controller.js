const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { validationResult } = require('express-validator');
const pruebaCtl = {}

const guardarYSubirArchivo = async (archivo, filePath, columnName, idTeacher, url, req) => {
    const validaciones = {
        imagen: [".PNG", ".JPG", ".JPEG", ".GIF", ".TIF", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".ico", ".ICO"],
        video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".MP4", ".AVI", ".MOV", ".WMV", ".FLV"]
    };
    const tipoArchivo = columnName === 'photoMultimediaTask' ? 'imagen' : 'video';
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
                    await sql.promise().query(`UPDATE multimediaTasks SET ${columnName} = ? WHERE idMultimediaTask = ?`, [archivo.name, idTeacher]);

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

pruebaCtl.mostrar = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [curso] = await sql.promise().query('select * from cours where idCours = ?', [id])
        const [pruena] = await sql.promise().query('select MAX(idAssessment) as maximo from assessments')
        res.render('pruebas/agregar', { listaPagina: pagina, listaCurso: curso, Maximo: pruena, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
}

pruebaCtl.mandar = async (req, res) => {
    const id = req.params.id
    try {
        const { idEvaluaciones, nameAssessment, descriptionAssessment, timeAssessment, dateAssessment, qualification } = req.body
        const newEnvio = {
            nameAssessment,
            descriptionAssessment,
            timeAssessment,
            dateAssessment,
            qualification,
            courIdCours: id,
        }
        await orm.assessment.create(newEnvio)
        req.flash('success', 'Exito al Guardar')
        res.redirect('/pruebas/cursos/' + idEvaluaciones);
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
}

pruebaCtl.lista = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [pruena] = await sql.promise().query('select * from assessments WHERE courIdCours = ?', [id])
        res.render('pruebas/lista', { listaPagina: pagina, pruebas: pruena, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
}

pruebaCtl.traer = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [pruena] = await sql.promise().query('select * from assessments WHERE idAssessment = ?', [id])
        res.render('pruebas/lista', { listaPagina: pagina, idAssessment: pruena, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
}

pruebaCtl.actualizar = async (req, res) => {
    const id = req.params.id
    try {
        const { idEvaluaciones, nameAssessment, descriptionAssessment, timeAssessment, dateAssessment, qualification } = req.body
        const newEnvio = {
            nameAssessment,
            descriptionAssessment,
            timeAssessment,
            dateAssessment,
            qualification,
            courIdCours: id,
        }
        await orm.assessment.findOne({ where: { idAssessment: id } })
            .then((result) => {
                result.update(newEnvio)
            })
        req.flash('success', 'Exito al Guardar')
        res.redirect('/pruebas/cursos/' + idEvaluaciones);
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
}

module.exports = pruebaCtl