const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());
app.use(csrf({ cookie: true }));

const guardadoImgenCtl = {}

guardadoImgenCtl.sendImagenCours = (req, res) => {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.image) {
        return res.status(400).send('No se recibió ningún archivo');
    }

    // Obtener la imagen cargada
    const imageFile = req.files.image;

    // Crear el filePath donde se guardará la imagen
    const filePath = __dirname + '/../public/img/cours/' + imageFile.name;

    // Guardar la imagen en el filePath
    imageFile.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la imagen');
        }

        // Enviar una respuesta satisfactoria al servidor A
        res.send('Imagen guardada exitosamente!');
    });
}

guardadoImgenCtl.sendVideoCours = (req, res) => {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.image) {
        return res.status(400).send('No se recibió ningún archivo');
    }

    // Obtener la imagen cargada
    const imageFile = req.files.image;

    // Crear el filePath donde se guardará la imagen
    const filePath = __dirname + '/../public/video/cours/' + imageFile.name;

    // Guardar la imagen en el filePath
    imageFile.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la imagen');
        }

        // Enviar una respuesta satisfactoria al servidor A
        res.send('Imagen guardada exitosamente!');
    });
}

guardadoImgenCtl.sendImagenClass = (req, res) => {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.image) {
        return res.status(400).send('No se recibió ningún archivo');
    }

    // Obtener la imagen cargada
    const imageFile = req.files.image;

    // Crear el filePath donde se guardará la imagen
    const filePath = __dirname + '/../public/img/clase/' + imageFile.name;

    // Guardar la imagen en el filePath
    imageFile.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la imagen');
        }

        // Enviar una respuesta satisfactoria al servidor A
        res.send('Imagen guardada exitosamente!');
    });
}

guardadoImgenCtl.sendVideoClass = (req, res) => {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.image) {
        return res.status(400).send('No se recibió ningún archivo');
    }

    // Obtener la imagen cargada
    const imageFile = req.files.image;

    // Crear el filePath donde se guardará la imagen
    const filePath = __dirname + '/../public/video/clases/' + imageFile.name;

    // Guardar la imagen en el filePath
    imageFile.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la imagen');
        }

        // Enviar una respuesta satisfactoria al servidor A
        res.send('Imagen guardada exitosamente!');
    });
}

guardadoImgenCtl.sendImagenPagina = (req, res) => {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.image) {
        return res.status(400).send('No se recibió ningún archivo');
    }

    // Obtener la imagen cargada
    const imageFile = req.files.image;

    // Crear el filePath donde se guardará la imagen
    const filePath = __dirname + '/../public/img/page/' + imageFile.name;

    // Guardar la imagen en el filePath
    imageFile.mv(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al guardar la imagen');
        }

        // Enviar una respuesta satisfactoria al servidor A
        res.send('Imagen guardada exitosamente!');
    });
}

module.exports = guardadoImgenCtl