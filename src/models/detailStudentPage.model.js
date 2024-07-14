const detailEstudentPage = (sequelize, type) =>{
    return sequelize.define('detailEstudentPage',{
        idDetailEstudentPage: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Detalle de Estudiante en la Pagina'
        },
        createDetailEstudentPage: {
            type: type.STRING,
            comment: 'Crear de Detalle de Estudiante en la Pagina'
        },
        updateDetailEstudentPage: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Estudiante en la Pagina'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Estudiante en la Pagina'
    })
}

module.exports = detailEstudentPage