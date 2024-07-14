const diplomasType = (sequelize, type) =>{
    return sequelize.define('diplomasType',{
        idDiplomasType: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tipos de diplomas'
        },
        nameDiplomasType: {
            type: type.STRING,
            comment: 'Nombre de Tipos de diplomas'
        },
        stateDiplomasType: {
            type: type.STRING,
            comment: 'Estado de Tipos de diplomas'
        },
        createDiplomasType: {
            type: type.STRING,
            comment: 'Create de Tipos de diplomas'
        },
        updateDiplomasType: {
            type: type.STRING,
            comment: 'Actualizar de Tipos de diplomas'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Tipos de diplomas'
    })
}

module.exports = diplomasType