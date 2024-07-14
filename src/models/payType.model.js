const payType = (sequelize, type) =>{
    return sequelize.define('payType',{
        idPayType: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tipo de Pago'
        },
        namePayType: {
            type: type.STRING,
            comment: 'Nombre de Tipo de Pago'
        },
        statePayType: {
            type: type.STRING,
            comment: 'Estado de Tipo de Pago'
        },
        createPayType: {
            type: type.STRING,
            comment: 'crear de Tipo de Pago'
        },
        updatePayType: {
            type: type.STRING,
            comment: 'update de Tipo de Pago'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Tipo de Pago'
    })
}

module.exports = payType