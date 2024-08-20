const orm = require('../Database/dataBase.orm');
const sql = require('../Database/dataBase.sql');
const { validationResult } = require('express-validator');

const assessmentsController = {};

assessmentsController.mostrar = async (req, res) => {
    try {
        const id = req.params.id;

        const [pagina] = await sql.promise().query('SELECT * FROM pages WHERE idPage = ?', [id]);
        const [curso] = await sql.promise().query('SELECT * FROM cours');
        const [clase] = await sql.promise().query('SELECT * FROM Clases');
    
        res.render('assessments/add', {
            listaPagina: pagina,
            listaCurso: curso,
            listaClase: clase,
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error al mostrar el formulario:', error.message);
        res.status(500).send('Error al cargar el formulario');
    }
};

assessmentsController.mandar = async (req, res) => {
    const ids = req.params.id;
    console.log(ids)
    try {
        // Validar entradas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // Extraer datos del body
        const { idAssessment, nameAssessment, descriptionAssessment, timeAssessment, dateAssessment, qualificationAssessment, courIdCours, ClaseIdClases } = req.body;
        
        // Preparar el nuevo registro de evaluación
        const nuevaEvaluacion = {
            idAssessment,
            nameAssessment,
            descriptionAssessment,
            timeAssessment,
            dateAssessment,
            qualificationAssessment,
            courIdCours,
            ClaseIdClases,
            createAssessments: new Date(),
            stateAssessments: 'Activar',
        };

        // Crear la evaluación usando ORM
        await orm.Assessment.create(nuevaEvaluacion);
        
        // Mensaje de éxito y redirección
        req.flash('success', 'Éxito al guardar');
        res.redirect('/assessments/list/' + courIdCours);
    } catch (error) {
        console.error('Error al crear la evaluación:', error.message);
        req.flash('message', 'Error al guardar');
        res.redirect('/assessments/add/' + ids);
    }
};

assessmentsController.lista = async (req, res) => {
    try {
        const id = req.params.id;
        const pagina = await orm.Page.findOne({ where: { idPage: id } });
        const evaluaciones = await orm.Assessment.findAll({ where: { courIdCours: id } });

        res.render('assessments/list', {
            lista: evaluaciones,
            listaPagina: pagina
        });
    } catch (error) {
        console.error('Error al listar las evaluaciones:', error.message);
        res.status(500).send('Error al listar las evaluaciones');
    }
};

assessmentsController.traerDatos = async (req, res) => {
    try {
        const id = req.params.id;
        const[evaluacion] = await sql.promise().query('SELECT * FROM assessments where idAssessment = ?', [id])
        res.render('assessments/update', {
            lista:evaluacion,
            
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error al cargar el formulario de actualización:', error.message);
        res.status(500).send('Error al cargar el formulario de actualización');
    }
};

assessmentsController.actualizar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { idAssessment, nameAssessment, descriptionAssessment, dateAssessment, stateAssessment, courIdCours, ClaseIdClases } = req.body;
        const evaluacionActualizada = {
            idAssessment,
            nameAssessment,
            descriptionAssessment,
            dateAssessment,
            stateAssessment,
            courIdCours,
            ClaseIdClases,
            updateAssessment: new Date()
        };

        await orm.Assessment.update(evaluacionActualizada, { where: { idAssessment } });

        req.flash('success', 'Evaluación actualizada exitosamente');
        res.redirect(`/assessments/list/${req.body.courIdCours}`);
    } catch (error) {
        console.error('Error al actualizar la evaluación:', error.message);
        req.flash('error', 'Error al actualizar la evaluación');
        res.redirect(`/assessments/update/${req.params.id}`);
    }
};

assessmentsController.desabilitar = async (req, res) => {
    try {
        const id = req.params.id;
        const evaluacionDeshabilitada = {
            stateAssessment: 'Inactive',
            updateAssessment: new Date()
        };

        await orm.Assessment.update(evaluacionDeshabilitada, { where: { idAssessment: id } });

        req.flash('success', 'Evaluación deshabilitada exitosamente');
        res.redirect(`/assessments/list/${id}`);
    } catch (error) {
        console.error('Error al deshabilitar la evaluación:', error.message);
        req.flash('error', 'Error al deshabilitar la evaluación');
        res.redirect(`/assessments/update/${id}`);
    }
};

module.exports = assessmentsController;
