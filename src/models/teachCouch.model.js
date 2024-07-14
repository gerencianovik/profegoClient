const teachCouch = (sequelize, type) => {
    return sequelize.define('teachCouch',{
        idTeachCouch: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Profesor Couch'
        },
        stateTeachCouch: {
            type: type.STRING,
            comment: 'Estadi de Profesor Couch'
        },
        createTeachCouch: {
            type: type.STRING,
            comment: 'Crear de Profesor Couch'
        },
        updateTeachCouch: {
            type: type.STRING,
            comment: 'Actualizar de Profesor Couch'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Profesor Couch'
    })
}

module.exports = teachCouch