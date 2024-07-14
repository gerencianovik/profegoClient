const cours = (sequelize, type) =>{
    return sequelize.define('cours',{
        idCours: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Curso'
        },
        photoCours: {
            type: type.STRING,
            comment: 'Foto de Curso'
        },
        videoCours: {
            type: type.STRING,
            comment: 'Video de Curso'
        },
        nameCours: {
            type: type.STRING,
            comment: 'Nombre de Curso'
        },
        descriptionCours: {
            type: type.TEXT,
            comment: 'Descripcion de Curso'
        },
        dateCours: {
            type: type.STRING,
            comment: 'Date de Curso'
        },
        hourCours: {
            type: type.STRING,
            comment: 'Hora de Curso'
        },
        shareCours: {
            type: type.STRING,
            comment: 'Cupo de Curso'
        },
        costCours: {
            type: type.STRING,
            comment: 'Costo de Curso'
        },
        stateCours: {
            type: type.STRING,
            comment: 'Estado de Curso'
        },
        calificationCours: {
            type: type.STRING,
            comment: 'Calificacion de Curso'
        },
        createCours: {
            type: type.STRING,
            comment: 'Crear de Curso'
        },
        updateCours: {
            type: type.STRING,
            comment: 'Actualizar de Curso'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Curso'
    })
}

module.exports = cours