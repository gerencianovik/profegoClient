const multimediaTask = (sequelize, type) =>{
    return sequelize.define('multimediaTask',{
        idMultimediaTask: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de la Multimedia de Tareas'
        },
        photoMultimediaTask: {
            type: type.STRING,
            comment: 'Foto de Multimedia de Tareas'
        },
        videoMultimediaTask: {
            type: type.STRING,
            comment: 'Video de Multimedia de Tareas'
        },
        linkMultimediaTask: {
            type: type.STRING,
            comment: 'Enlace de Multimedia de Tareas'
        },
        documentMultimediaTask: {
            type: type.STRING,
            comment: 'Docmuento de Multimedia de Tareas'
        },
        videoMultimediaTask: {
            type: type.STRING,
            comment: 'Video de Multimedia de Tareas'
        },
        otherMultimediaTask: {
            type: type.STRING,
            comment: 'Otro de Multimedia de Tareas'
        },
        createMultimediaTask: {
            type: type.STRING,
            comment: 'Crear de Multimedia de Tareas'
        },
        updateMultimediaTask: {
            type: type.STRING,
            comment: 'Actualizar de Multimedia de Tareas'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Multimedia de Tareas'
    })
}

module.exports = multimediaTask