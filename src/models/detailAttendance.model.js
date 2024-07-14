const detailAttendance = (sequelize, type) => {
    return sequelize.define('detailAttendance',{
        idDetailAttendance: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Detalle de Asistencia'
        },
        createDetailAttendacce: {
            type: type.STRING,
            comment: 'Crear de Detalle de Asistencia'
        },
        updateDetailAttendance: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Asistencia'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Asistencia'
    })
}

module.exports = detailAttendance