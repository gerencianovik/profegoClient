const Clases = (sequelize, type) =>{
    return sequelize.define('Clases',{
        idClases: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de la Clase'
        },
        photoClases: {
            type: type.STRING,
            comment: 'Foto de la Clase'
        },
        videoClases: {
            type: type.STRING,
            comment: 'Video de la Clase'
        },
        nameClases: {
            type: type.STRING,
            comment: 'Nombre de la Clase'
        },
        descriptionClases: {
            type: type.TEXT,
            comment: 'Descripcion de la Clase'
        },
        dateClases: {
            type: type.STRING,
            comment: 'Date de la Clase'
        },
        hourClases: {
            type: type.STRING,
            comment: 'Hora de la Clase'
        },
        shareClases: {
            type: type.STRING,
            comment: 'Cupo de la Clase'
        },
        costClases: {
            type: type.STRING,
            comment: 'Costo de la Clase'
        },
        stateClases: {
            type: type.STRING,
            comment: 'Estado de la Clase'
        },
        calificationClases: {
            type: type.STRING,
            comment: 'Calificacion de la Clase'
        },
        createClases: {
            type: type.STRING,
            comment: 'Crear de la Clase'
        },
        updateClases: {
            type: type.STRING,
            comment: 'Actualizar de la Clase'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de la Clase'
    })
}

module.exports = Clases