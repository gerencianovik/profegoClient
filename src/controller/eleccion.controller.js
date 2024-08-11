const eleccionServicios = {}
const orm = require('../Database/dataBase.orm.js');
const sql = require('../Database/dataBase.sql.js');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');

eleccionServicios.mostrarEleccion = async (req, res) => {
    const ids = req.params.id;
    const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
    const [rows] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [ids]);
    const [cursos] = await sql.promise().execute('SELECT * FROM cours WHERE stateCours = "pendienteAsignacion"');
    const [clases] = await sql.promise().execute('SELECT * FROM Clases WHERE stateClases = "pendienteAsignacion"');
    const datos = rows.map(row => ({
        idTeacher: row.idTeacher,
        photoTeacher: row.photoTeacher,
        endorsementCertificateTeacher: row.endorsementCertificateTeacher,
        pageVitalTeacher: row.pageVitalTeacher,
        criminalRecordTeacher: row.criminalRecordTeacher,
        completeNmeTeacher: row.completeNmeTeacher ? descifrarDatos(row.completeNmeTeacher) : '',
        identificationCardTeacher: row.identificationCardTeacher ? descifrarDatos(row.identificationCardTeacher) : '',
        ageTeacher: row.ageTeacher ? descifrarDatos(row.ageTeacher) : '',
        descriptionTeacher: row.descriptionTeacher ? descifrarDatos(row.descriptionTeacher) : '',
        emailTeacher: row.emailTeacher ? descifrarDatos(row.emailTeacher) : '',
        addressTeacher: row.addressTeacher ? descifrarDatos(row.addressTeacher) : '',
        phoneTeacher: row.phoneTeacher ? descifrarDatos(row.phoneTeacher) : '',
        usernameTeahcer: row.usernameTeahcer ? descifrarDatos(row.usernameTeahcer) : ''
    }));
    res.render('eleccion/eleccionServicios', { listaPagina: pagina, listaTeacher: datos, listaCursos:cursos, listaClases: clases, csrfToken: req.csrfToken() });
}

eleccionServicios.mostrarEleccionEstudiante = async (req, res) => {
    const ids = req.params.id;
    const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
    const [rows] = await sql.promise().query('SELECT * FROM students WHERE idEstudent = ?', [ids]);
    const [cursos] = await sql.promise().execute('SELECT * FROM cours');
    const [clases] = await sql.promise().execute('SELECT * FROM Clases');
    const datos = rows.map(row => ({
        idEstudent: row.idEstudent,
        photoEstudent: row.photoEstudent,
        completeNameEstudent: row.completeNameEstudent ? descifrarDatos(row.completeNameEstudent) : '',
        emailEstudent: row.emailEstudent ? descifrarDatos(row.emailEstudent) : '',
        celularEstudent: row.celularEstudent ? descifrarDatos(row.celularEstudent) : '',
        usernameEstudent: row.usernameEstudent ? descifrarDatos(row.usernameEstudent) : '',
    }));
    res.render('servicios/leccionEstudiante', { listaPagina: pagina, listaTeacher: datos, listaCursos:cursos, listaClases: clases, csrfToken: req.csrfToken() });
}

eleccionServicios.clasesCursos = async(req, res) =>{
    const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
    const [cursos] = await sql.promise().execute('SELECT * FROM cours');
    const [clases] = await sql.promise().execute('SELECT * FROM Clases');
    res.render('servicios/cursos', { listaPagina: pagina, listaCursos:cursos, listaClases: clases, csrfToken: req.csrfToken() });
}

module.exports = eleccionServicios