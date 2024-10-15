const crypto = require('crypto');

// Credenciales de Paymentez
const CLIENT_ID = 'NUVEISTG-EC-CLIENT';  // Reemplaza con tus credenciales
const SERVER_ID = 'NUVEISTG-EC-SERVER';  // Reemplaza con tus credenciales
const SECRET = 'rvpKAv2tc49x6YL38fvtv5jJxRRiPs';  // Reemplaza con tu secreto

// Función para generar el token de autenticación
function generateAuthToken() {
    const timestamp = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

    // Crear la firma con el secret
    const signature = crypto.createHmac('sha256', SECRET)
        .update(`${CLIENT_ID}${SERVER_ID}${timestamp}`)
        .digest('hex');

    // Retornar el token de autenticación
    return `${CLIENT_ID}:${SERVER_ID}:${timestamp}:${signature}`;
}

module.exports = generateAuthToken;