const multimediaClass = (sequelize, type) =>{
    return sequelize.define('multimediaClass',{
        idMultimediaClass: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de la Multimedia de Clases'
        },
        photoMultimediaClass: {
            type: type.STRING,
            comment: 'Foto de Multimedia de Clases'
        },
        videoMultimediaClass: {
            type: type.STRING,
            comment: 'Video de Multimedia de Clases'
        },
        linkMultimediaClass: {
            type: type.STRING,
            comment: 'Enlace de Multimedia de Clases'
        },
        documentMultimediaClass: {
            type: type.STRING,
            comment: 'Docmuento de Multimedia de Clases'
        },
        videoMultimediaClass: {
            type: type.STRING,
            comment: 'Video de Multimedia de Clases'
        },
        otherMultimediaClass: {
            type: type.STRING,
            comment: 'Otro de Multimedia de Clases'
        },
        createMultimediaClass: {
            type: type.STRING,
            comment: 'Crear de Multimedia de Clases'
        },
        updateMultimediaClass: {
            type: type.STRING,
            comment: 'Actualizar de Multimedia de Clases'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Multimedia de Clases'
    })
}

module.exports = multimediaClass