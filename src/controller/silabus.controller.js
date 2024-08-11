const silabusCtl = {}

const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const path = require('path')

silabusCtl.lista = async (req, res) => {
    const id = req.params.id
    try {
        const [pagina] = await sql.promise().query('SELECT * FROM cours c JOIN pages p ON p.idPage = c.pageIdPage where idCours = ?', [id]);
        const [curso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [id])
        const [silabus] = await sql.promise().query('SELECT * FROM syllabuseducationals WHERE courIdCours = ?', [id])
        res.render('listStudent/syllabusEducational', { listaPagina: pagina, listaSilabusCurso: curso, listaSyllabi: silabus, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

silabusCtl.listaClase = async (req, res) => {
    const id = req.params.id
    try {
        const [pagina] = await sql.promise().query('SELECT * FROM clases c JOIN pages p ON p.idPage = c.pageIdPage where idClases = ?', [id]);
        const [clases] = await sql.promise().query('SELECT * FROM clases WHERE idClases = ?', [id])
        const [silabus] = await sql.promise().query('SELECT * FROM syllabuseducationals WHERE ClaseIdClases = ?', [id])
        res.render('listStudent/syllabusEducational', { listaPagina: pagina, listaSilabusClase: clases, listaSyllabi: silabus, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

silabusCtl.detalleClaseCurso = async (req, res) => {
    const id = req.params.id
    try {
        const [silabus] = await sql.promise().query('SELECT s.*, d.* FROM syllabuseducationals s JOIN detailcurricularcontents d ON s.syllabuseducationals = d.syllabusEducationalIdsyllabusEducational WHERE idsyllabusEducational = ?', [id])
        res.render('listStudent/detailSyllabusEducational', { detailSilabus: silabus, csrfToken: req.csrfToken() });
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

silabusCtl.aprobarRechazar = async (req, res) => {
    const id = req.params.id
    const parts = req.originalUrl.split('/').filter(part => part !== '');
    let tipoEleccion
    if (parts.length >= 3) {
        tipoEleccion = parts[1]; // La parte intermedia
    }
    if (tipoEleccion == 'aprovar') {
        const newActualizar = {
            stateSyllabusEducational: 'aprovar'
        }
        await orm.curricularContent.findOne({ where: { idsyllabusEducational: id } })
            .then((result) => {
                result.update(newActualizar)
                req.flash('success', 'Se aprovo el contenido curricular')
                res.redirect('/silabus/detail/' + id);
            })
    }
    if (tipoEleccion == 'rechazar') {
        const newActualizar = {
            stateSyllabusEducational: 'rechazar'
        }
        await orm.curricularContent.findOne({ where: { idsyllabusEducational: id } })
            .then((result) => {
                result.update(newActualizar)
                req.flash('success', 'Se rechazo el contenido curricular')
                res.redirect('/silabus/detail/' + id);
            })
    }
}

module.exports = silabusCtl