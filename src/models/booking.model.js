const booking = (sequelize, type) =>{
    return sequelize.define('booking',{
        idBooking: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Reserva'
        },
        typeBooking: {
            type: type.STRING,
            comment: 'Tipo de Reserva'
        },
        stateBooking: {
            type: type.STRING,
            comment: 'Estado de Reserva'
        },
        createBooking: {
            type: type.STRING,
            comment: 'Crear de Reserva'
        },
        updateBooking: {
            type: type.STRING,
            comment: 'Actualizar de Reserva'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Reserva'
    })
}

module.exports = booking