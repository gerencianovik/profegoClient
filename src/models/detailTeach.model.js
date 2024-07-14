const detailTeacher = (sequelize, type) =>{
    return sequelize.define('detail',{
        idDetailTeacher: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Detalle de Profesores'
        },
        crearDetailTeacher: {
            type: type.STRING,
            comment: 'Crear de Detalle de Profesores'
        },
        updateDetailTeacher: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Profesores'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Profesores'
    })
}

module.exports = detailTeacher