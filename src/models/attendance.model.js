const attendance = (sequelize, type) =>{
    return sequelize.define('attendance',{
        idAttendance: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Asistencia'
        },
        dateAttendance: {
            type: type.STRING,
            comment: 'Fecha de Asistencia'
        },
        valueAttendance: {
            type: type.STRING,
            comment: 'Valor de Asistencia'
        },
        stateAttendance: {
            type: type.STRING,
            comment: 'Estado de Asistencia'
        },
        createAttendance: {
            type: type.STRING,
            comment: 'Crear de Asistencia'
        },
        updateAttendance: {
            type: type.STRING,
            comment: 'Actualizar de Asistencia'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Asistencia'
    })
}

module.exports = attendance