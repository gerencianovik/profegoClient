const DetalleClase = (sequelize, type) => {
    return sequelize.define('DetalleClase',{
        idDetalleClase: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Detalle de Clase'
        },
        rangoEdadClase: type.STRING,
        createDetailDetalleClasee: {
            type: type.STRING,
            comment: 'Crear de Detalle de Clase'
        },
        updateDetalleClase: {
            type: type.STRING,
            comment: 'Actualizar de Detalle de Clase'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de Clase'
    })
}

module.exports = DetalleClase