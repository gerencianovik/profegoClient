const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { validationResult } = require('express-validator');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const observacionesCtl = {}

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

observacionesCtl.mostrar = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [curso] = await sql.promise().query('select * from cours where idCours = ?', [id])
        const [mienbros] = await sql.promise().query('SELECT * FROM students')
        const [pruena] = await sql.promise().query('select MAX(idObservation) as maximo from observations')
        const datos = mienbros.map(row => ({
            idEstudent: row.idEstudent,
            photoEstudent: row.photoEstudent,
            completeNameEstudent: row.completeNameEstudent ? descifrarDatos(row.completeNameEstudent) : '',
        }));
        res.render('cours/observation/observaciones', { listaPagina: pagina, estudiantes: datos, listaCurso: curso, maximoPrueba: pruena, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

observacionesCtl.mandar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { idEstudent, observations, valorObservacion } = req.body;
        const newEnvio = {
            observations,
            valorObservacion,
            studentIdEstudent: idEstudent,
            createObservations: new Date().toLocaleString(),
        }
        await orm.observation.create(newEnvio)
        req.flash('success', 'Éxito al guardar');
        res.redirect('/cours/detailList/' + id);
    } catch (error) {
        console.error(error);
        req.flash('message', 'Error al guardar');
        res.redirect('/observacionValoracion/curso/' + ids);
    }
}

module.exports = observacionesCtl