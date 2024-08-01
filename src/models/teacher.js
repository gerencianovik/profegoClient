const teacher = (sequelize, type) => {
    return sequelize.define('teachers',{
        idTeacher: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Profesor'
        },
        photoTeacher: {
            type: type.STRING,
            comment: 'Foto de Profesor'
        },
        addressTeacher: {
            type: type.STRING,
            comment: 'direccion del profesor'
        },
        completeNmeTeacher: {
            type: type.STRING,
            comment: 'Nombre completo de Profesor'
        },
        identificationCardTeacher: {
            type: type.STRING,
            comment: 'Identificacion de Profesor'
        },
        ageTeacher: {
            type: type.STRING,
            comment: 'Edad de Profesor'
        },
        criminalRecordTeacher: {
            type: type.STRING,
            comment: 'Antecedentes penales de Profesor'
        },
        endorsementCertificateTeacher: {
            type: type.STRING,
            comment: 'Certificado de aval de Profesor'
        },
        descriptionTeacher: {
            type: type.TEXT,
            comment: 'Descripcion de Profesor'
        },
        emailTeacher: {
            type: type.STRING,
            comment: 'Correo de Profesor'
        },
        pageVitalTeacher: {
            type: type.STRING,
            comment: 'Hoja de vida de Profesor'
        },
        phoneTeacher: {
            type: type.STRING,
            comment: 'Numeo de Profesor'
        },
        addressTeacher: {
            type: type.STRING,
            comment: 'Direccion de Profesor'
        },
        CalificationTeacher: {
            type: type.STRING,
            comment: 'Calificacion de Profesor'
        },
        usernameTeahcer: {
            type: type.STRING,
            comment: 'Sobre nombre de Profesor'
        },
        passwordTeacher: {
            type: type.STRING,
            comment: 'Contraseña de Profesor'
        },
        stateTeacher: {
            type: type.STRING,
            comment: 'Estado de Profesor'
        },
        createTeahcer: {
            type: type.STRING,
            comment: 'Creacion de Profesor'
        },
        updateTeacher: {
            type: type.STRING,
            comment: 'Actualizacion de Profesor'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Profesor'
    })
}

module.exports = teacher