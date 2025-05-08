const orm = require('../Database/dataBase.orm')
const sql = require('../Database/dataBase.sql')
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { descifrarDatos, cifrarDatos } = require('../lib/encrypDates.js');
const { validationResult } = require('express-validator');
const cours = {}

function safeDecrypt(data) {
    try {
        return descifrarDatos(data);
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        return ''; // Devolver una cadena vacía si ocurre un error
    }
}

cours.curso = async (req, res) => {
    try {
        const [row] = await sql.promise().query('SELECT * FROM cours')
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE idDetailTeacherPage = ?', [row[0].detailTeacherPageIdDetailTeacherPage])
        const [teacher] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [detailTeacher[0].teacherIdTeacher])
        const datos = teacher.map(row => ({
            completeNmeTeacher: row.completeNmeTeacher ? safeDecrypt(row.completeNmeTeacher) : '',
        }));
        res.render('servicios/cursos', { cursos: row, listaTipoCurso: tipoCurso, listaTeacher: datos })
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

cours.clase = async (req, res) => {
    try {
        const [rows] = await sql.promise().query('SELECT * FROM Clases')
        const [tipoCurso] = await sql.promise().query('SELECT * FROM coursClassTypes');
        const [detailTeacher] = await sql.promise().query('SELECT * FROM detailTeacherPages WHERE idDetailTeacherPage = ?', [rows[0].detailTeacherPageIdDetailTeacherPage])
        const [teacher] = await sql.promise().query('SELECT * FROM teachers WHERE idTeacher = ?', [detailTeacher[0].teacherIdTeacher])
        const datos = teacher.map(row => ({
            completeNmeTeacher: row.completeNmeTeacher ? safeDecrypt(row.completeNmeTeacher) : '',
        }));
        res.render('servicios/clase', { clases: rows, listaTipoCurso: tipoCurso, teacherLista: datos})
    } catch (error) {
        console.error('Error en la consulta:', error.message);
        res.status(500).send('Error al realizar la consulta');
    }
}

module.exports = cours