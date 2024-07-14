const bill = (sequelize, type) =>{
    return sequelize.define('bill',{
        idBill: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Tabla de Factura'
        },
        descriptionBill: {
            type: type.STRING,
            comment: 'Descripcion de Factura'
        },
        valueBill: {
            type: type.STRING,
            comment: 'Valor de Factura'
        },
        stateBill: {
            type: type.STRING,
            comment: 'Estado de Factura'
        },
        createBill: {
            type: type.STRING,
            comment: 'Crear de Factura'
        },
        updateBill: {
            type: type.STRING,
            comment: 'Actualizar de Factura'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Factura'
    })
}

module.exports = bill