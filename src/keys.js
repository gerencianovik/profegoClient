const MYSQLHOST = '82.112.244.23';
const MYSQLUSER = 'u675912406_sofiGo';
const MYSQLPASSWORD = 'profeGo@Sofi2024';
const MYSQLDATABASE = 'u675912406_profego';
const MYSQLPORT = '3306'; // Puerto de la base de datos
const MYSQL_URI = process.env.MYSQL_URI ?? ''; // URI de conexión a la base de datos (si es necesario)

// Exportar las variables de configuración
module.exports = {
    MYSQLHOST,
    MYSQLUSER,
    MYSQLPASSWORD,
    MYSQLDATABASE,
    MYSQLPORT,
    MYSQL_URI
};