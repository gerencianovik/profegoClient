const result = (sequelize, type) =>{
    return sequelize.define('result',{
        idResult: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Resultados'
        },
        valueResult: {
            type: type.STRING,
            comment: 'Valor de Resultados'
        },
        stateResult: {
            type: type.STRING,
            comment: 'Estate de Resultados'
        },
        createResult: {
            type: type.STRING,
            comment: 'Crear de Resultados',
        },
        updateResult: {
            type: type.STRING,
            comment: 'Actualizar de Resultados'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Resultados'
    })
}

module.exports = result