const multimediaCourse = (sequelize, type) =>{
    return sequelize.define('multimediaCourse',{
        idMultimediaCourse: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de la Multimedia de Cursos'
        },
        photoMultimediaCourse: {
            type: type.STRING,
            comment: 'Foto de Multimedia de Cursos'
        },
        videoMultimediaCourse: {
            type: type.STRING,
            comment: 'Video de Multimedia de Cursos'
        },
        linkMultimediaCourse: {
            type: type.STRING,
            comment: 'Enlace de Multimedia de Cursos'
        },
        documentMultimediaCourse: {
            type: type.STRING,
            comment: 'Docmuento de Multimedia de Cursos'
        },
        videoMultimediaCourse: {
            type: type.STRING,
            comment: 'Video de Multimedia de Cursos'
        },
        otherMultimediaCourse: {
            type: type.STRING,
            comment: 'Otro de Multimedia de Cursos'
        },
        createMultimediaCourse: {
            type: type.STRING,
            comment: 'Crear de Multimedia de Cursos'
        },
        updateMultimediaCourse: {
            type: type.STRING,
            comment: 'Actualizar de Multimedia de Cursos'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Multimedia de Cursos'
    })
}

module.exports = multimediaCourse