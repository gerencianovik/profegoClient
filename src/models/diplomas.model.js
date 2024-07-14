const diplomas = (sequelize, type) =>{
    return sequelize.define('diplomas',{
        idDiplomas: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Diplomas'
        },
        nameDiploma: {
            type: type.STRING,
            comment: 'Nombre de Diplomas'
        },
        descriptionDiploma: {
            type: type.TEXT,
            comment: 'Descripcion de Diplomas'
        },
        dateDiploma: {
            type: type.STRING,
            comment: 'Fecha de Diplomas'
        },
        valueDiploma: {
            type: type.STRING,
            comment: 'Valor de Diplomas'
        },
        stateDiploma: {
            type:  type.STRING,
            comment: 'Estado de Diploma'
        },
        createDiploma: {
            type: type.STRING,
            comment: 'Crear de la Diploma'
        },
        updateDiploma: {
            type: type.STRING,
            comment: 'Actualizar de la Diploma'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Diplomas'
    })
}

module.exports = diplomas