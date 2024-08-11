const specialtyType = (sequelize, type) =>{
    return sequelize.define('specialtyTypes', {
        idSpecialType: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tipo de Espesialidad'
        },
        nameSpecialType:{
            type: type.STRING,
            comment: 'Nombre de Tipo de Espesialidad'
        },
        specialType:{
            type: type.STRING,
            comment: 'Estado de Tipo de Espesialidad'
        },
        stateSpecialType:{
            type: type.STRING,
            comment: 'Estado de Tipo de Espesialidad'
        },
        createSpecialType:{
            type: type.STRING,
            comment: 'Crear de Tipo de Espesialidad'
        },
        updateSpecialType:{
            type: type.STRING,
            comment: 'Actualizar de Tipo de Espesialidad'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Tipo de Espesialidad'
    })
}

module.exports = specialtyType