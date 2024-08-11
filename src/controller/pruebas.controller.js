const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { validationResult } = require('express-validator');
const tareasCtl = {}

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

tareasCtl.mostrar = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [teacher] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [id]);
        const [maxCours] = await sql.promise().query('SELECT MAX(idTask) AS Maximo FROM tasks')
        res.render('cours/tareas/tareasAgregar', { listaPagina: pagina, MaximoCurso: maxCours, listaTeacher: teacher, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

tareasCtl.mandar = async (req, res) => {
    const ids = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.user.idUser;

        const { idTask, nameTask, descriptionTask, idMultimediaTask, photoMultimediaTask, videoMultimediaTask, linkMultimediaTask, documentMultimediaTask, otherMultimediaTask } = req.body;

        const newMultimedia = {
            linkMultimediaTask,
            otherMultimediaTask,
            createMultimediaTask: new Date().toLocaleString(),
            taskIdTask: idTask
        }

        const newPage = {
            idTask,
            nameTask,
            descriptionTask,
            CreateTask: new Date().toLocaleString(),
            stateTask: 'Activar',
            courIdCours: ids,
        };

        // Crear el curso
        await orm.taskClass.create(newPage);
        await orm.multimediaCourse.create(newMultimedia)

        // Manejo de archivos
        if (req.files) {
            const { photoMultimediaTask, videoCours } = req.files;

            if (photoMultimediaTask) {
                const photoFilePath = path.join(__dirname, '/../public/img/multimedia/', photoMultimediaTask.name);
                await guardarYSubirArchivo(photoMultimediaTask, photoFilePath, 'photoMultimediaTask', idMultimediaTask, 'http://localhost:5000/imagenMultimedia', req);
            }

            if (videoMultimediaTask) {
                const endorsementFilePath = path.join(__dirname, '/../public/video/multimedia/', videoMultimediaTask.name);
                await guardarYSubirArchivo(videoMultimediaTask, endorsementFilePath, 'videoMultimediaTask', idMultimediaTask, 'http://localhost:5000/cursoMultimedia', req);
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

tareasCtl.lista = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [tarea] = await sql.promise().query('SELECT * FROM tasks WHERE courIdCours	= ?', [id])
        res.render('cours/tareas/tareas', { listaPagina: pagina, listaTarea: tarea, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

tareasCtl.detalle = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1');
        const [tarea] = await sql.promise().query('SELECT * FROM tasks WHERE idTask	= ?', [id])
        res.render('cours/tareas/tareasEntregadas', { listaPagina: pagina, listaTarea: tarea, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}


module.exports = tareasCtl