const eleccionServicios = {}
const orm = require('../Database/dataBase.orm.js');
const sql = require('../Database/dataBase.sql.js');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');

eleccionServicios.mostrarEleccion = async (req, res) => {
    try {
        const ids = req.user.idTeacher;

        // Consultas a la base de datos
        const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
        const [rows] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [ids]);
        const [cursos] = await sql.promise().execute('SELECT * FROM cours WHERE stateCours = "pendienteAsignacion"');
        const [clases] = await sql.promise().execute('SELECT * FROM Clases WHERE stateClases = "pendienteAsignacion"');

        // Mapear datos del profesor con manejo seguro de desciframiento
        const datos = rows.map(row => ({
            idTeacher: row.idTeacher,
            photoTeacher: row.photoTeacher,
            endorsementCertificateTeacher: row.endorsementCertificateTeacher,
            pageVitalTeacher: row.pageVitalTeacher,
            criminalRecordTeacher: row.criminalRecordTeacher,
            completeNmeTeacher: row.completeNmeTeacher ? safeDecrypt(row.completeNmeTeacher) : '',
            identificationCardTeacher: row.identificationCardTeacher ? safeDecrypt(row.identificationCardTeacher) : '',
            ageTeacher: row.ageTeacher ? safeDecrypt(row.ageTeacher) : '',
            descriptionTeacher: row.descriptionTeacher ? safeDecrypt(row.descriptionTeacher) : '',
            emailTeacher: row.emailTeacher ? safeDecrypt(row.emailTeacher) : '',
            addressTeacher: row.addressTeacher ? safeDecrypt(row.addressTeacher) : '',
            phoneTeacher: row.phoneTeacher ? safeDecrypt(row.phoneTeacher) : '',
            usernameTeahcer: row.usernameTeahcer ? safeDecrypt(row.usernameTeahcer) : ''
        }));

        // Renderizar la vista con los datos obtenidos
        res.render('eleccion/eleccionServicios', {
            listaPagina: pagina,
            listaTeacher: datos,
            listaCursos: cursos,
            listaClases: clases,
            csrfToken: req.csrfToken()
        });

    } catch (error) {
        console.error('Error en la consulta SQL:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

// Función de descifrado segura
function safeDecrypt(data) {
    try {
        return JSON.parse(data); // Asegúrate de que descifrarDatos devuelva una cadena JSON válida
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devuelve una cadena vacía en caso de error
    }
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
    res.render('servicios/eleccionServiciosEstudiante', { listaPagina: pagina, listaEstudent: datos, listaCursos: cursos, listaClases: clases, csrfToken: req.csrfToken() });
}

eleccionServicios.clasesCursos = async (req, res) => {
    const [pagina] = await sql.promise().execute('SELECT * FROM pagePolicy');
    const [cursos] = await sql.promise().execute('SELECT * FROM cours');
    const [clases] = await sql.promise().execute('SELECT * FROM Clases');
    res.render('servicios/cursos', { listaPagina: pagina, listaCursos: cursos, listaClases: clases, csrfToken: req.csrfToken() });
}

module.exports = eleccionServicios