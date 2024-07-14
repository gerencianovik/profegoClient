const detailMaterialsClass = (sequelize, type) =>{
    return sequelize.define('detailMaterialClass',{
        idDetailMaterialClass: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Detalle del Material de la Clase'
        },
        createDetailMaterialClass: {
            type: type.STRING,
            comment: 'Crear de Detalle del Material de la Clase'
        },
        updateDetailMaterialClass: {
            type: type.STRING,
            comment: 'Actualizar de Detalle del Material de la Clase'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle del Material de la Clase'
    })
}

module.exports = detailMaterialsClass