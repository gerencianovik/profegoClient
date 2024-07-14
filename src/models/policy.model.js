const policy = (sequelize, type) => {
    return sequelize.define('policy',{
        idPolicy: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Politica'         
        },
        namePolicy: {
            type: type.STRING,
            comment: 'Nombre de Politica'
        },
        descriptionPolicy: {
            type: type.TEXT,
            comment: 'Description de Politica'
        },
        statePolicy: {
            type: type.STRING,
            comment: 'estado de Politica'
        },
        createPolicy: {
            type: type.STRING,
            comment: 'crear de Politica'
        },
        updatePolicy: {
            type: type.STRING,
            comment: 'Actualizacion de Politica'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Politica'
    })
}

module.exports = policy