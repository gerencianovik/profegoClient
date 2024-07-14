const detailTeacherPage = (sequelize, type) =>{
    return sequelize.define('detailTeacherPage',{
        idDetailTeacherPage: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unica de Detalle de Profesores de la Pagina'
        },
        crearDetailTeacherPage:{
            type: type.STRING,
            comment: 'Crear de Detalle de Profesores de la Pagina'
        },
        updateDetailTeacherPage: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Profesores de la Pagina'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Profesores de la Pagina'
    })
}

module.exports = detailTeacherPage