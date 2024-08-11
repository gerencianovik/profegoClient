const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')
const { validationResult } = require('express-validator');

const materialCours = {}

materialCours.mostrar = async (req, res) => {
    const id = req.params.id;
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    try {
        let curso = [];
        let clase = [];
        let pagina = [];

        if (tipoEleccion == 'curso') {
            const [resultadoCurso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [id]);
            curso = resultadoCurso;

        } else if (tipoEleccion == 'clase') {
            const [resultadoClase] = await sql.promise().query('SELECT * FROM Clases WHERE idClases = ?', [id]);
            clase = resultadoClase;

        } else {
            const [pagina] = await sql.promise().query('select * from pages where idPage = ?', [id])
            pagina = pagina;
        }

        const [maximo] = await sql.promise().query('SELECT MAX(idMaterial) AS Maximo FROM materials');

        res.render('material/add', {
            listaPagina: pagina,
            listaCurso: curso,
            listaClase: clase,
            maximo: maximo,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta')
    }
}

materialCours.mandar = async (req, res) => {
    const ids = req.params.id;
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    const { idMaterial, nameMaterial, descriptionMaterial, quantyMaterailClass, idCours, idClases, valueMaterial } = req.body
    if (tipoEleccion == 'list') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const newSpeciality = {
                idMaterial,
                nameMaterial,
                descriptionMaterial,
                stateMaterial: 'Activar',
                quantyMaterailClass,
                valueMaterial,
                pageIdPage: ids,
                createMaterial: new Date().toLocaleString(),
            }
            await orm.material.create(newSpeciality)
            req.flash('success', 'Se creo la materia')
            res.redirect('/material/list/' + ids);

        } catch (error) {
            req.flash('message', 'Error al guardar la materia')
            res.redirect('/material/add/' + ids);
        }
    } else {
        if (tipoEleccion == 'clase') {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const newSpeciality = {
                    idMaterial,
                    nameMaterial,
                    descriptionMaterial,
                    stateMaterial: 'Activar',
                    quantyMaterailClass,
                    valueMaterial,
                    ClaseIdClases: ids,
                    createMaterial: new Date().toLocaleString(),
                }
                await orm.material.create(newSpeciality)
                req.flash('success', 'Se creo la materia')
                res.redirect('/material/clases/' + ids);
            } catch (error) {
                req.flash('message', 'Error al guardar la materia')
                res.redirect('/material/clase/' + ids);
            }
        } else {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const newSpeciality = {
                    idMaterial,
                    nameMaterial,
                    descriptionMaterial,
                    stateMaterial: 'Activar',
                    quantyMaterailClass,
                    valueMaterial,
                    courIdCours: ids,
                    createMaterial: new Date().toLocaleString(),
                }
                await orm.material.create(newSpeciality)
                req.flash('success', 'Se creo la materia')
                res.redirect('/material/cursos/' + ids);
            } catch (error) {
                req.flash('message', 'Error al guardar la materia')
                res.redirect('/material/curso/' + ids);
            }
        }
    }
}

materialCours.lista = async (req, res) => {
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

            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM materials WHERE courIdCours = ? OR pageIdPage = ?', [id, id]);
            row = resultadoRecursos;
        } else if (tipoEleccion == 'clases') {
            const [resultadoClase] = await sql.promise().query('SELECT * FROM Clases WHERE idClases = ?', [id]);
            clase = resultadoClase;

            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM materials WHERE ClaseIdClases = ? OR pageIdPage = ?', [id, id]);
            row = resultadoRecursos;
        } else {
            const [resultadoRecursos] = await sql.promise().query('SELECT * FROM materials');
            row = resultadoRecursos;

            const [paginas] = await sql.promise().query('SELECT * FROM pages');
            pagina = paginas;
        }

        res.render('material/list', {
            listaPagina: pagina,
            listaCurso: curso,
            listaClase: clase,
            lista: row,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta')
    }
}

materialCours.traerDatos = async (req, res) => {
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    if (tipoEleccion == 'updateCurso') {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM materials where idMaterial = ?', [id])
            res.render('material/update', { listaCurso: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    } else if (tipoEleccion == 'updateClase') {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM materials where idMaterial = ?', [id])
            res.render('material/update', { listaClase: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    } else {
        try {
            const id = req.params.id
            const [row] = await sql.promise().query('SELECT * FROM materials where idMaterial = ?', [id])
            res.render('material/update', { lista: row, csrfToken: req.csrfToken() });
        } catch (error) {
            console.error('Error en la consulta:', error.message);
            res.status(500).send('Error al realizar la consulta')
        }
    }
}

materialCours.actualizar = async (req, res) => {
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
            const { nameMaterial, descriptionMaterial, quantyMaterailClass, valueMaterial, stateMaterial } = req.body
            const newSpeciality = {
                nameMaterial,
                descriptionMaterial,
                stateMaterial,
                quantyMaterailClass,
                valueMaterial,
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idMaterial: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/material/cursos/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/material/updateCurso/' + ids);
        }
    } else if (tipoEleccion == 'updateClase') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { nameMaterial, descriptionMaterial, quantyMaterailClass, valueMaterial, stateMaterial } = req.body
            const newSpeciality = {
                nameMaterial,
                descriptionMaterial,
                stateMaterial,
                quantyMaterailClass,
                valueMaterial,
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idMaterial: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/material/clases/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/material/updateClase/' + ids);
        }
    } else {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { nameMaterial, descriptionMaterial, quantyMaterailClass, valueMaterial, stateMaterial } = req.body
            const newSpeciality = {
                nameMaterial,
                descriptionMaterial,
                stateMaterial,
                quantyMaterailClass,
                valueMaterial,
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idMaterial: ids } })
                .then((result) => {
                    result.update(newSpeciality)
                    req.flash('success', 'Se Actualizo la materia')
                    res.redirect('/material/list/' + ids);
                })
        } catch (error) {
            req.flash('message', 'Error al Actualizar la materia')
            res.redirect('/material/update/' + ids);
        }
    }
}

materialCours.desabilitar = async (req, res) => {
    const ids = req.params.id;
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
                stateMaterial: 'Desactivar',
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idRecours: ids } })
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
                stateMaterial: 'Desactivar',
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idRecours: ids } })
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
                stateMaterial: 'Desactivar',
                updateMaterial: new Date().toLocaleString(),
            }
            await orm.material.findOne({ where: { idRecours: ids } })
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

module.exports = materialCours