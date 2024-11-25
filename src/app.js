// Importar módulos necesarios
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
                    "'unsafe-inline'",  // Permite scripts inline para la ejecución de JavaScript
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
                    "blob:",  // Permite blobs en las imágenes
                    "https://maps.gstatic.com",
                    "https://*.googleapis.com"
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
        referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    })
);


// Configurar almacenamiento de sesiones MySQL
const mysqlOptions = {
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    createDatabaseTable: true
};
const sessionStore = new MySQLStore(mysqlOptions);

app.use(session({
    store: sessionStore,
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Strict'
    }
}));

// Configurar Handlebars
const handlebars = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
});

// Configurar motor de vistas
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

// Configurar middleware
app.use(cookieParser());
app.use(fileUpload({ createParentPath: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Middleware de seguridad y rendimiento
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use(compression());

// Middleware para minificar HTML
app.use(async (req, res, next) => {
    const originalSend = res.send.bind(res);
    res.send = async function (body) {
        if (typeof body === 'string') {
            try {
                body = await minify(body, {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                });
            } catch (err) {
                console.error('Error minifying HTML:', err);
            }
        }
        return originalSend(body);
    };
    next();
});


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

    // Manejo del error CSRF aquí
    res.status(403);
    res.send('La validación del token CSRF ha fallado. Por favor, recarga la página.');
});

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src/public', express.static(path.join(__dirname, 'src/public')));

// Configurar sistema de logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

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