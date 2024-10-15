const fetch = require('node-fetch');
const generateAuthToken = require('./authService'); // Servicio para generar el auth token
const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');

function safeDecrypt(data) {
    try {
        console.log('Datos cifrados:', data); // Verificar los datos antes de descifrar
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message, 'Datos:', data);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

exports.reservar = async (req, res) => {
    const id = req.user.idEstudent
    const ids = req.params.id
    const [pagina] = await sql.promise().query('SELECT * FROM pages')
    const [estudiante] = await sql.promise().query('SELECT * FROM students WHERE idEstudent = ?', [id])
    const [reservar] = await sql.promise().query('SELECT * FROM detailbookings WHERE courIdCours  = ?', [id])
    const [curso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [reservar[0].courIdCours])
    const datos = estudiante.map(row => ({
        idEstudent: row.idEstudent,
        photoEstudent: row.photoEstudent,
        completeNameEstudent: safeDecrypt(row.completeNameEstudent),
        emailEstudent: safeDecrypt(row.emailEstudent),
        celularEstudent: safeDecrypt(row.celularEstudent),
        stateEstudent: row.stateEstudent
    }));

    res.render('reservas/reservar/reservas', {pagina, estudiante: datos, curso, csrfToken: req.csrfToken()});
}

// Controlador que procesa la reserva y el pago
exports.procesarReserva = async (req, res) => {
    try {
        // Obtener los datos del formulario
        const { nombre, email, telefono, curso, precio, numero_tarjeta, cvv, fecha_vencimiento } = req.body;

        // Validar datos (nombre, email, tarjeta, etc.)
        if (!nombre || !email || !numero_tarjeta || !cvv || !fecha_vencimiento) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        // Generar el token de autenticación para la API de Paymentez
        const authToken = generateAuthToken(); // Asegúrate de tener este servicio configurado

        // Procesar el pago directamente usando la API de Paymentez
        const url = 'https://ccapi-stg.paymentez.com/v2/transaction/debit';

        const payload = {
            "user": {
                "id": email, // Puedes usar el email como identificador único del usuario
                "email": email,
                "name": nombre
            },
            "order": {
                "amount": precio,
                "description": `Reserva para ${curso}`,
                "dev_reference": "ReferenciaDeTuSistema"
            },
            "card": {
                "number": numero_tarjeta,
                "holder_name": nombre,
                "expiry_month": fecha_vencimiento.split("/")[0], // MM
                "expiry_year": "20" + fecha_vencimiento.split("/")[1], // YY -> YYYY
                "cvc": cvv
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Auth-Token': authToken
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.transaction.status === 'success') {
            // Aquí puedes registrar la reserva en la base de datos
            return res.status(200).send('Reserva realizada con éxito');
        } else {
            return res.status(500).send(`Error al procesar el pago: ${data.transaction.message}`);
        }
    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        return res.status(500).send('Hubo un error en el servidor');
    }
};

exports.reservas =  async(req, res) =>{
    const id = req.params.id
    const ids = req.user.idEstudent
    const newEnvio = {
        studentIdEstudent: ids,
        courIdCours: id,
        createDetailBooking: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    }
    
    await orm.detailBooking.create(newEnvio)
    req.flash('success', 'reserva consedida')
    res.redirect('/reservar/'+ id);
}