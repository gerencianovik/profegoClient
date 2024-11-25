const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const orm = require('../Database/dataBase.orm')
const CryptoJS = require('crypto-js')
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
    const ids = req.params.id
    const [pagina] = await sql.promise().query('SELECT * FROM pages WHERE idPage = 1')
    const [estudiante] = await sql.promise().query('SELECT * FROM students WHERE idEstudent = ?', [req.user.idEstudent])
    const [reservar] = await sql.promise().query('SELECT * FROM detailBookings WHERE courIdCours ')
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
        let paymentez_server_application_code = 'LINKTOPAY02-EC-SERVER';
        let paymentez_server_app_key = 'IqtB3TOFLvFXzMdWmDLPP4W5KZFyaQ';
        let unix_timestamp = String(Math.floor(new Date().getTime() / 1000));
        // unix_timestamp = String("1546543146"); 
        console.log("UNIX TIMESTAMP:", unix_timestamp);
        let uniq_token_string = paymentez_server_app_key + unix_timestamp;
        console.log('UNIQ STRING:', uniq_token_string);
        let uniq_token_hash = CryptoJS.SHA256(uniq_token_string);
        console.log('UNIQ STRING:', uniq_token_hash);
        let string_auth_token = btoa(paymentez_server_application_code + ";" + unix_timestamp + ";" + uniq_token_hash);
        console.log('AUTH TOKEN:', string_auth_token);
        const authToken = string_auth_token; // Asegúrate de tener este servicio configurado

        console.log(authToken)
        // Procesar el pago directamente usando la API de Paymentez
        const url = 'https://noccapi-stg.paymentez.com/linktopay/init_order/';

        const { idUsuario, nombreUsuario, emailUsuario, celular, costoCurso, respaldoIva, costoTotal } = req.query;
        console.log(idUsuario, nombreUsuario, emailUsuario, celular, costoCurso, respaldoIva, costoTotal);

        const payload = {
            "user": {
                "id": idUsuario,
                "email": emailUsuario,
                "name": nombreUsuario,
                "last_name": "N/A"
            },
            "order": {
                "dev_reference": "001",
                "description": "reserva de un curso",
                "amount": costoTotal,
                "vat": 15,
                "tax_percentage": respaldoIva,
                "taxable_amount": costoCurso,
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
        console.log(data)
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
exports.notificacionPago2 = async (req, res) => {
    try {
        // Recuperar los datos de la transacción desde req.query
        const [estudiante] = await sql.promise().query('SELECT * FROM students WHERE idEstudent = ?', [req.user.idEstudent])
        const datos = estudiante.map(row => ({
            idEstudent: row.idEstudent,
            photoEstudent: row.photoEstudent,
            completeNameEstudent: safeDecrypt(row.completeNameEstudent),
            emailEstudent: safeDecrypt(row.emailEstudent),
            celularEstudent: safeDecrypt(row.celularEstudent),
            stateEstudent: row.stateEstudent
        }));
    
        const transaction = req.query;
        console.log('Transacción completa:', JSON.stringify(transaction, null, 2));

        // Configura el transporte de correo con Nodemailer utilizando Gmail
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER || 'gerencianovik@gmail.com',
                pass: process.env.SMTP_PASS || 'aqsqzcveokpcbxtx'
            }
        });

        // Crear el cuerpo del mensaje con la información de la transacción
        const mailOptions = {
            from: 'educonecta2@gmail.com',  // Remitente
            to: datos[0].emailEstudent,  // Destinatario
            subject: 'Pago realizado',
            text: `El pago fue realizado correctamente para la orden ${transaction.transaction.id}.
                   Detalles de la transacción:
                   - Estatus: ${transaction.transaction.status}
                   - Número de lote: ${transaction.transaction.lot_number}
                   - Monto pagado: $${transaction.transaction.amount}
                   - Descripción: ${transaction.transaction.order_description}
                   - Fecha de pago: ${transaction.transaction.paid_date}`,
            html: `<p><strong>El pago fue realizado correctamente para la orden ${transaction.transaction.id}.</strong></p>
                   <p><strong>Detalles de la transacción:</strong></p>
                   <ul>
                       <li><strong>Estatus:</strong> ${transaction.transaction.status}</li>
                       <li><strong>Número de lote:</strong> ${transaction.transaction.lot_number}</li>
                       <li><strong>Monto pagado:</strong> $${transaction.transaction.amount}</li>
                       <li><strong>Descripción:</strong> ${transaction.transaction.order_description}</li>
                       <li><strong>Fecha de pago:</strong> ${transaction.transaction.paid_date}</li>
                   </ul>`
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
            }
            console.log('Correo enviado:', info.response);
            res.status(200).json({ message: 'Notificación procesada y correo enviado', transaction });
        });

    } catch (error) {
        console.error('Error al procesar la notificación:', error);
        return res.status(500).json({ message: 'Error al procesar la notificación', error: error.message });
    }
};