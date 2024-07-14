const orm = require('../Database/dataBase.orm.js')
const sql = require('../Database/dataBase.sql.js')

const teacher = {}

teacher.mostrar = async(req, res) =>{
    try {
        const ids= req.params.id
        const [rows] = await sql.promise().query('SELECT * FROM teachers where idTeacher = ?', [ids])
        const [listaTitulos] = await sql.promise().query('SELECT * FROM specialtyTypes where stateSpecialType = "titulo"')
        const [listaTitulosEspecial] = await sql.promise().query('SELECT * FROM specialtyTypes where stateSpecialType = "especial"')
        const [listaMaterias] = await sql.promise().query('SELECT * FROM subjects')
        res.render('profesor/perfilUpdate', {listaTeacher: rows, listaEspecialidades: listaTitulosEspecial,listaTitulos: listaTitulos, listaMaterias: listaMaterias, csrfToken: req.csrfToken()});
    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor', error.message);
    }
}


module.exports = teacher