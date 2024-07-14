const askAswern =(sequelize, type) =>{
    return sequelize.define('preguntasAswern',{
        idAskAswern: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de PreguntaRespuesta'
        },
        createAskAswern: {
            type: type.STRING,
            comment: 'Create de PreguntaRespuesta'
        },
        updateAskAswern: {
            type: type.STRING,
            comment: 'Actualizar de PreguntaRespuesta'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de PreguntaRespuesta'
    })
}

module.exports = askAswern