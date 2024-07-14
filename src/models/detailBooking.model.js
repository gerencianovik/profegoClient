const detailBooking = (sequelize, type) =>{
    return sequelize.define('detailBooking',{
        idDetailBooking: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Detalle de la Reserva'
        },
        createDetailBooking: {
            type: type.STRING,
            comment: 'Crear de Detalle de la Reserva'
        },
        updateDetailBooking: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de la Reserva'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de la Reserva'
    })
}
module.exports = detailBooking