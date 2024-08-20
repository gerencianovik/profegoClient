const observation = (sequelize, type) => {
    return sequelize.define('observation', {
        idObservation: {
            type: type.INTEGER,
            autoIncremnt: true,
            primaryKey: true,
            comment: 'Campo unico de Observation'
        },
        observations: {
            type: type.TEXT,
            comment: 'observacion de Observation'
        },
        valorObservacion: {
            type: type.STRING,
            comment: 'Valor de Observation'
        },
        createObservations: {
            type: type.TEXT,
            comment: 'Crear de Observation'
        },
        updateObservations: {
            type: type.TEXT,
            comment: 'Actualizar de Observation'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Observation'
    })
}

module.exports = observation