const silabusCtl = {}

const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')

silabusCtl.mostrarCurso = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM cours c JOIN pages p ON p.idPage = c.pageIdPage where idCours = ?', [id]);
        const [silabus] = await sql.promise().query('SELECT MAX(idsyllabusEducational) AS Maximo FROM syllabuseducationals')
        res.render('cours/silabus', { listaPagina: pagina, listaSilabus: silabus, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

silabusCtl.mostrarClase = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM cours c JOIN pages p ON p.idPage = c.pageIdPage where idCours = ?', [id]);
        const [silabus] = await sql.promise().query('SELECT MAX(idsyllabusEducational) FROM syllabuseducationals')
        res.render('clases/silabus', { listaPagina: pagina, listaSilabus: silabus, csrfToken: req.csrfToken() })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

silabusCtl.mandarCurso = async (req, res) => {
    const id = req.params.id;
    const ids = req.user.idUsers;
    try {
        const { idsyllabusEducational, objetivesyllabusEducational, moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational } = req.body;

        // Iterar sobre los módulos para insertar cada uno en la base de datos
        for (let i = 0; i < moduleCurrucularContentCourse.length; i++) {
            const newSilabus = {
                idsyllabusEducational,
                objetivesyllabusEducational,
                moduleCurrucularContentCourse: moduleCurrucularContentCourse[i],
                themesyllabusEducational: themesyllabusEducational[i],
                timesyllabusEducational: timesyllabusEducational[i],
                stateSyllabusEducational: 'Activar',
                courIdCours: id
            };

            await orm.curricularContent.create(newSilabus);
        }

        req.flash('success', 'Se guardó con éxito el contenido');
        res.redirect('/cursos/detailList/' + ids);
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

silabusCtl.mandarClase = async (req, res) => {
    const id = req.params.id;
    const ids = req.user.idUsers;
    try {
        const { idsyllabusEducational, objetivesyllabusEducational, moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational } = req.body;

        // Iterar sobre los módulos para insertar cada uno en la base de datos
        for (let i = 0; i < moduleCurrucularContentCourse.length; i++) {
            const newSilabus = {
                idsyllabusEducational,
                objetivesyllabusEducational,
                moduleCurrucularContentCourse: moduleCurrucularContentCourse[i],
                themesyllabusEducational: themesyllabusEducational[i],
                timesyllabusEducational: timesyllabusEducational[i],
                stateSyllabusEducational: 'Activar',
                ClaseIdClases: id
            };

            await orm.curricularContent.create(newSilabus);
        }

        req.flash('success', 'Se guardó con éxito el contenido');
        res.redirect('/clases/detailList/' + ids);
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
};

module.exports = silabusCtl