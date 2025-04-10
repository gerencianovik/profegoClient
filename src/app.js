// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);
const bodyparser = require('body-parser');
const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { minify } = require('html-minifier-terser');
const winston = require('winston');
const cors = require('cors');
const { Loader } = require('@googlemaps/js-api-loader')

// Importar módulos locales
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('./keys');
require('./lib/passport');

// Crear aplicación Express
const app = express();

// Configurar helmet y Content Security Policy
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https://maps.googleapis.com",
                    "https://cdnjs.cloudflare.com",
                    "https://cdn.jsdelivr.net"
                ],
                "style-src": [
                    "'self'",
                    "'unsafe-inline'",  // Permite estilos inline
                    "https://fonts.googleapis.com",
                    "https://cdn.jsdelivr.net"
                ],
                "img-src": [
                    "'self'",
                    "data:",
                    "blob:",
                    "https://maps.gstatic.com",
                    "https://*.googleapis.com"
                ],
                "media-src": [
                    "'self'",
                    "blob:" 
                ],
                "connect-src": [
                    "'self'",  // Permite que fetch funcione desde el mismo origen
                    "https://maps.googleapis.com"
                ],
                "frame-src": [
                    "'self'", 
                    "blob:", 
                    "https://www.google.com", 
                    "https://link-stg.paymentez.com",
                    "https://link.paymentez.com"  // Permite cargar iframes de este dominio
                ],
                "object-src": ["'none'"],
                "default-src": ["'self'"]
            }
        },
        hsts: {
            maxAge: 63072000,
            includeSubDomains: true,
            preload: true
        },
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
);

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://www.profego-edu.com', 'https://profego-edu.com'] : 
        ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};
app.use(cors(corsOptions));

// Configuración de almacenamiento de sesiones MySQL mejorada
const mysqlOptions = {
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutos
    expiration: 86400000 // 1 día
};
const sessionStore = new MySQLStore(mysqlOptions);

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "fallback_secret_but_change_in_production",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Necesario cuando hay un proxy inverso
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.profego-edu.com' : undefined,
        maxAge: 86400000 // 1 día
    },
    rolling: true // Renueva la cookie con cada petición
}));

// Configurar Handlebars
const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b,
    }
});

// Configurar motor de vistas
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');


// Middlewares esenciales
app.use(cookieParser());
app.use(fileUpload({ createParentPath: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// Inicialización de Passport (DEBE ir después de session)
app.use(passport.initialize());
app.use(passport.session());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Datos inválidos.' });
    }

    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('La validación del token CSRF ha fallado. Por favor, recarga la página.');
    } else {
        console.error(err.stack);
        res.status(500).send('Error interno del servidor');
    }
});

// Configurar variables globales
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user || null;
    next();
});

// Middleware de protección CSRF
const csrfMiddleware = csrf({ cookie: true });
app.use(cookieParser());
app.use(csrfMiddleware);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    res.status(403);
    res.send('La validación del token CSRF ha fallado. Por favor, recarga la página.');
});

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' })); // Cacheo de archivos estáticos
app.use('/src/public', express.static(path.join(__dirname, 'src/public'), { maxAge: '1d' }));

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rutas - Definir tus rutas aquí
app.use(require('./router/index.router'));
app.use(require('./router/envio.router'));
app.use('/teacher', require('./router/teacher.router'));
app.use('/clases', require('./router/class.router'));
app.use('/cours', require('./router/cours.router'));
app.use('/recours', require('./router/recoursCours.router'));
app.use('/material', require('./router/materialCours.router'));
app.use('/silabus', require('./router/silabus.router'))
app.use('/tareas', require('./router/tareas.router'))
app.use('/students', require('./router/students.router'))
app.use(require('./router/eleccion.router'))
app.use(require('./router/reservar.router'))
app.use('/pruebas', require('./router/pruebas.router'))
app.use('/observacionValoracion', require('./router/observaciones.router'))
app.use('/asistencia', require('./router/asistencia.router'))
app.use('/general', require('./router/filtros.router'))
// Exportar la aplicación
module.exports = app;