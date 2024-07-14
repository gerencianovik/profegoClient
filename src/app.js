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
const helmet = require('helmet');  // Solo requerir helmet una vez
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const minifyHTML = require('express-minify-html');
const winston = require('winston');

// Importar módulos locales
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require('./keys');
require('./lib/passport');

// Crear aplicación Express
const app = express();

// Configurar helmet y Content Security Policy
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "blob:"],
            "frame-src": ["'self'", "blob:"], // Permitir blobs en frames
            "object-src": ["'none'"], // Desactivar objetos
            "default-src": ["'self'"] // Default para todo lo demás
        }
    },
}));

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
app.use(minifyHTML({
    override: true,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limitar a 5 intentos de inicio de sesión por ventana por IP
    message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente nuevamente después de 15 minutos.'
});
app.use('/login', loginLimiter);

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
    app.locals.user = req.user;
    next();
});

// Middleware de protección CSRF
const csrfMiddleware = csurf({ cookie: true });
app.use(csrfMiddleware);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
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
app.use('/teacher', require('./router/teacher.router'))

// Exportar la aplicación
module.exports = app;