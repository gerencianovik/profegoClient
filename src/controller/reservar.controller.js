const fetch = require('node-fetch');
const {string_auth_token} = require('./authService'); // Servicio para generar el auth token
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
    const [reservar] = await sql.promise().query('SELECT * FROM detailBookings WHERE courIdCours  = ?', [id])
    const [curso] = await sql.promise().query('SELECT * FROM cours WHERE idCours = ?', [reservar[0].courIdCours])
    const datos = estudiante.map(row => ({
        idEstudent: row.idEstudent,
        photoEstudent: row.photoEstudent,
        completeNameEstudent: safeDecrypt(row.completeNameEstudent),
        emailEstudent: safeDecrypt(row.emailEstudent),
        celularEstudent: safeDecrypt(row.celularEstudent),
        stateEstudent: row.stateEstudent
    }));

    res.render('reservas/reservar/reservas', { pagina, estudiante: datos, curso, csrfToken: req.csrfToken() });
}

// Controlador que procesa la reserva y el pago
exports.procesarReserva = async (req, res) => {
    try {
        // Generar el token de autenticación para la API de Paymentez
        const authToken = string_auth_token; // Asegúrate de tener este servicio configurado
        console.log(authToken)
        // Procesar el pago directamente usando la API de Paymentez
        const url = 'https://noccapi-stg.paymentez.com/linktopay/init_order/';

        const payload = {
            "user": {
                "id": "007",
                "email": "test@test.com",
                "name": "TEST",
                "last_name": "TEST"
            },
            "order": {
                "dev_reference": "001",
                "description": "TEST",
                "amount": 212,
                "vat": 12,
                "tax_percentage": 12,
                "taxable_amount": 100,
                "installments_type": 0,
                "currency": "USD"
            },
            "configuration": {
                "partial_payment": false,
                "expiration_time": 36000,
                "allowed_payment_methods": [
                    "All"
                ],
                "success_url": "https://www.paymentez.com.ec/inicio",
                "failure_url": "https://www.paymentez.com.ec/inicio",
                "pending_url": "http://192.168.13.53:4200/summary",
                "review_url": "http://192.168.13.53:4200/summary"
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
        res.json(data)
    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        return res.status(500).send('Hubo un error en el servidor');
    }
};

exports.reservas = async (req, res) => {
    const id = req.params.id
    const ids = req.user.idEstudent
    const newEnvio = {
        studentIdEstudent: ids,
        courIdCours: id,
        createDetailBooking: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    }

    await orm.detailBooking.create(newEnvio)
    req.flash('success', 'reserva consedida')
    res.redirect('/reservar/' + id);
}

// Este es el controlador para recibir notificaciones de Paymentez
exports.notificacionPago = async (req, res) => {
    try {
        // Extrae los detalles de la transacción desde la notificación de Paymentez
        const { transaction, status } = req.body;

        // Verifica que tienes la información necesaria
        if (!transaction || !status) {
            return res.status(400).send('Datos incompletos en la notificación');
        }

        const transactionId = transaction.id;
        const transactionStatus = status;

        // Aquí puedes actualizar el estado de la transacción en tu base de datos
        console.log(`Recibida notificación de transacción ${transactionId} con estado: ${transactionStatus}`);

        // Responde a Paymentez confirmando que recibiste la notificación correctamente
        res.status(200).send('Webhook recibido y procesado');
        res.json('Webhook recibido y procesado')
    } catch (error) {
        console.error('Error al procesar el webhook de pago:', error);
        res.status(500).send('Error al procesar el webhook');
    }
};