const aswern = (sequelize, type) => {
    return sequelize.define('aswern', {
        idAswern: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Respuestas'
        },
        aswerns: {
            type: type.STRING,
            comment: 'Respuesta de Respuestas'
        },
        timeAswerns: {
            type: type.STRING,
            comment: 'Tiempo de Respuestas'
        },
        stateAswerns: {
            type: type.STRING,
            comment: 'Estado de Respuestas'
        },
        createAswerns: {
            type: type.STRING,
            comment: 'Crear de Respuestas'
        },
        updateAswerns: {
            type: type.STRING,
            comment: 'Actualizar de Respuestas'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Respuestas'
    })
}

module.exports = aswern