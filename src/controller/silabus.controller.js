const silabusCtl = {}

const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')

silabusCtl.mostrarCurso = async (req, res) => {
    try {
        const id = req.params.id
        const [pagina] = await sql.promise().query('SELECT * FROM cours where idCours = ?', [id]);
        console.log(pagina)
        const [silabus] = await sql.promise().query('SELECT MAX(idsyllabusEducational) AS Maximo FROM syllabusEducationals')
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
        const {
            idsyllabusEducational,
            objetivesyllabusEducational,
            moduleCurrucularContentCourse,
            themesyllabusEducational,
            timesyllabusEducational
        } = req.body;

        const newEnvio = {
            idsyllabusEducational,
            objetivesyllabusEducational,
            stateSyllabusEducational: 'Activar',
            courIdCours: id
        };

        // Crear el registro principal en curricularContent
        await orm.curricularContent.create(newEnvio);

        // Verificar si moduleCurrucularContentCourse es un array o un solo elemento
        if (Array.isArray(moduleCurrucularContentCourse)) {
            // Si es un array, iterar y realizar la inserción para cada elemento
            for (let i = 0; i < moduleCurrucularContentCourse.length; i++) {
                await sql.promise().query(
                    'INSERT INTO detailcurricularcontents (moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational, syllabusEducationalIdsyllabusEducational) VALUES (?, ?, ?, ?)',
                    [
                        moduleCurrucularContentCourse[i],
                        themesyllabusEducational[i],
                        timesyllabusEducational[i],
                        idsyllabusEducational
                    ]
                );
            }
        } else {
            // Si es un solo elemento, realizar una sola inserción
            await sql.promise().query(
                'INSERT INTO detailcurricularcontents (moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational, syllabusEducationalIdsyllabusEducational) VALUES (?, ?, ?, ?)',
                [
                    moduleCurrucularContentCourse,
                    themesyllabusEducational,
                    timesyllabusEducational,
                    idsyllabusEducational
                ]
            );
        }

        req.flash('success', 'Se guardó con éxito el contenido');
        return res.redirect('/cours/detailList/' + id);
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        req.flash('error', 'Error al realizar la consulta');
        return res.redirect('/silabus/curso/' + id);
    }
};

silabusCtl.mandarClase = async (req, res) => {
    const id = req.params.id;
    const ids = req.user.idUsers;
    try {
        const {
            idsyllabusEducational,
            objetivesyllabusEducational,
            moduleCurrucularContentCourse,
            themesyllabusEducational,
            timesyllabusEducational
        } = req.body;

        const newEnvio = {
            idsyllabusEducational,
            objetivesyllabusEducational,
            stateSyllabusEducational: 'Activar',
            ClaseIdClases: id
        };

        // Crear el registro principal en curricularContent
        await orm.curricularContent.create(newEnvio);

        // Verificar si moduleCurrucularContentCourse es un array o un solo elemento
        if (Array.isArray(moduleCurrucularContentCourse)) {
            // Si es un array, iterar y realizar la inserción para cada elemento
            for (let i = 0; i < moduleCurrucularContentCourse.length; i++) {
                await sql.promise().query(
                    'INSERT INTO detailCurricularContent (moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational, syllabusEducationalIdsyllabusEducational) VALUES (?, ?, ?, ?)',
                    [
                        moduleCurrucularContentCourse[i],
                        themesyllabusEducational[i],
                        timesyllabusEducational[i],
                        idsyllabusEducational
                    ]
                );
            }
        } else {
            // Si es un solo elemento, realizar una sola inserción
            await sql.promise().query(
                'INSERT INTO detailCurricularContent (moduleCurrucularContentCourse, themesyllabusEducational, timesyllabusEducational, syllabusEducationalIdsyllabusEducational) VALUES (?, ?, ?, ?)',
                [
                    moduleCurrucularContentCourse,
                    themesyllabusEducational,
                    timesyllabusEducational,
                    idsyllabusEducational
                ]
            );
        }

        req.flash('success', 'Se guardó con éxito el contenido');
        return res.redirect('/clases/detailList/' + ids);
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        req.flash('error', 'Error al realizar la consulta');
        return res.redirect('/silabus/clase/' + id);
    }
};

module.exports = silabusCtl