const MYSQLHOST = 'localhost';
const MYSQLUSER = 'robin';
const MYSQLPASSWORD = '0987021692';
const MYSQLDATABASE = 'admin_profeGo';
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