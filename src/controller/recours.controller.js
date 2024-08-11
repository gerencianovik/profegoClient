const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')
const { validationResult } = require('express-validator');

const recoursCours = {}

recoursCours.mostrar = async (req, res) => {
    try {
        const id = req.params.id;
        const parts = req.originalUrl.split('/').filter(part => part !== '');
        let tipoEleccion
        if (parts.length >= 3) {
            tipoEleccion = parts[1]; // La parte intermedia
        }
        let curso = [];
        let clase = [];
        let pagina = []
        
        if (tipoEleccion == 'curso') {
            const [resultadoCurso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [id]);
            curso = resultadoCurso;

        } else if (tipoEleccion == 'clase') {
            const [resultadoClase] = await sql.promise().query('SELECT * FROM Clases WHERE idClases = ?', [id]);
            clase = resultadoClase;

        } else {
            const [paginas] = await sql.promise().query('SELECT * FROM pages WHERE idPage = ?', [id]);
            pagina = paginas;
        }
        const [maximo] = await sql.promise().query('SELECT MAX(idRecours) AS Maximo FROM recours');

        res.render('recours/add', {
            listaPagina: pagina,
            listaCurso: curso,
            listaClase: clase,
            maximo: maximo,
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

recoursCours.mandar = async (req, res) => {
    const ids = req.params.id;
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    try {
        // Validar los errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructuración de los datos del cuerpo de la solicitud
        const { idRecours, nameRecours, descriptionRecourse, quantyRecours, idCours, idClases, valueRecours } = req.body;

        // Comprobar si el recurso se va a asociar a una página específica
        if (tipoEleccion == 'list') {
            const newResource = {
                idRecours,
                nameRecours,
                descriptionRecourse,
                stateRecours: 'Activar',
                quantyRecours,
                valueRecours,
                pageIdPage: ids,
                createRecours: new Date().toLocaleString(),
            };

            // Crear el recurso en la base de datos
            await orm.recours.create(newResource);
            req.flash('success', 'Se creó el recurso');
            res.redirect('/recours/list/' + ids);
        } else {
            // Si el recurso se va a asociar a una clase
            if (tipoEleccion == 'clase') {
                const newResource = {
                    idRecours,
                    nameRecours,
                    descriptionRecourse,
                    stateRecours: 'Activar',
                    quantyRecours,
                    valueRecours,
                    ClaseIdClases: ids,
                    createRecours: new Date().toLocaleString(),
                };

                // Crear el recurso en la base de datos
                await orm.recours.create(newResource);
                req.flash('success', 'Se creó el recurso');
                res.redirect('/recours/clases/' + idClases);
            } else {
                // Si el recurso se va a asociar a un curso
                const newResource = {
                    idRecours,
                    nameRecours,
                    descriptionRecourse,
                    stateRecours: 'Activar',
                    quantyRecours,
                    valueRecours,
                    courIdCours: ids,
                    createRecours: new Date().toLocaleString(),
                };

                // Crear el recurso en la base de datos
                await orm.recours.create(newResource);
                req.flash('success', 'Se creó el recurso');
                res.redirect('/recours/cursos/' + ids);
            }
        }
    } catch (error) {
        console.error('Error al guardar el recurso:', error);
        req.flash('message', 'Error al guardar el recurso');
    }
};

recoursCours.lista = async (req, res) => {
    try {
        const id = req.params.id;
        const parts = req.originalUrl.split('/').filter(part => part !== '');
        let tipoEleccion
        if (parts.length >= 3) {
            tipoEleccion = parts[1]; // La parte intermedia
        }

        let curso = [];
        let clase = [];
        let row = [];
        let pagina = []
        
        if (tipoEleccion == 'cursos') {
            const [resultadoCurso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [id]);
            curso = resultadoCurso;

            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM recours WHERE courIdCours = ?', [id]);
            row = resultadoRecursos;

        } else if (tipoEleccion == 'clases') {
            const [resultadoClase] = await sql.promise().query('SELECT * FROM Clases WHERE idClases = ?', [id]);
            clase = resultadoClase;

            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM recours WHERE ClaseIdClases = ?', [id, id]);
            row = resultadoRecursos;
        } else {
            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM recours');
            row = resultadoRecursos;

            const [paginas] = await sql.promise().query('SELECT * FROM pages');
            pagina = paginas;
        }
        res.render('recours/list', {
            listaPagina: pagina,
            listaCurso: curso,
            listaClase: clase,
            lista: row,
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};


recoursCours.traerDatos = async (req, res) => {
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    if (tipoEleccion == 'updateCurso') {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM recours where idRecours = ?', [id])
            res.render('recours/update', { listaCurso: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    } else if (tipoEleccion == 'updateClase') {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM recours where idRecours = ?', [id])
            res.render('recours/update', { listaClase: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    } else {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM recours where idRecours = ?', [id])
            res.render('recours/update', { lista: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    }
}

recoursCours.actualizar = async (req, res) => {
    const ids = req.params.id;
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1];
    }
    if (tipoEleccion == 'updateCurso') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { nameRecours, descriptionRecourse, quantyRecours, valueRecours, stateRecours } = req.body
            const newSpeciality = {
                nameRecours,
                descriptionRecourse,
                stateRecours,
                quantyRecours,
                valueRecours,
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/recours/cursos/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/recours/updateCurso/' + ids);
        }
    } else if (tipoEleccion == 'updateClase') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { nameRecours, descriptionRecourse, quantyRecours, valueRecours, stateRecours } = req.body
            const newSpeciality = {
                nameRecours,
                descriptionRecourse,
                stateRecours,
                quantyRecours,
                valueRecours,
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/recours/clases/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/recours/updateClase/' + ids);
        }
    } else {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { nameRecours, descriptionRecourse, quantyRecours, valueRecours, stateRecours } = req.body
            const newSpeciality = {
                nameRecours,
                descriptionRecourse,
                stateRecours,
                quantyRecours,
                valueRecours,
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/recours/list/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/recours/update/' + ids);
        }
    }
}

recoursCours.desabilitar = async (req, res) => {
    const ids = req.params.id;
    const id = req.user.idUser
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    if (tipoEleccion == 'deleteCurso') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newSpeciality = {
                stateRecours: 'Desactivar',
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Desabilito la materia')
                    res.redirect('/recours/cursos/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Desabilitar la materia')
            res.redirect('/recours/cursos/' + ids);
        }
    } else if (tipoEleccion == 'deleteClases') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newSpeciality = {
                stateRecours: 'Desactivar',
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Desabilito la materia')
                    res.redirect('/recours/clases/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Desabilitar la materia')
            res.redirect('/recours/clases/' + ids);
        }
    } else {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newSpeciality = {
                stateRecours: 'Desactivar',
                updateRecursCourse: new Date().toLocaleString(),
            }
            await orm.recours.findOne({ where: { idRecours: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Desabilito la materia')
                    res.redirect('/recours/list/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Desabilitar la materia')
            res.redirect('/recours/update/' + ids);
        }
    }
}

module.exports = recoursCours