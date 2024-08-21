const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const { validationResult } = require('express-validator');
const cours = {}

cours.lista = async (req, res) => {
    try {
        const [pagina] = await sql.promise().query('SELECT * FROM pages where idPage = 1',);
        const [row] = await sql.promise().query('SELECT * FROM cours')
        const [rows] = await sql.promise().query('SELECT * FROM Clases')
        res.render('servicios/cursos', { cursos: row, listaPagina: pagina, clases: rows })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

module.exports = cours