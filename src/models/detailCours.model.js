const DetalleCurso = (sequelize, type) => {
    return sequelize.define('DetalleCurso',{
        idDetalleCurso: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Detalle de Curso'
        },
        rangoEdadCurso: type.STRING,
        createDetailCurso: {
            type: type.STRING,
            comment: 'Crear de Detalle de Curso'
        },
        updateDetalleCurso: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Curso'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Curso'
    })
}

module.exports = DetalleCurso