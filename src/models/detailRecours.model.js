const detailRecoursClass = (sequelize, type) =>{
    return sequelize.define('detailRecoursClass',{
        idDetailRecoursClass: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Campo Unico de Detalle del Recurso de la Clase'
        },
        createDetailRecoursClass: {
            type: type.STRING,
            comment: 'Crear de Detalle del Recurso de la Clase'
        },
        updateDetailRecoursClass: {
            type: type.STRING,
            comment: 'Actualizar de Detalle del Recurso de la Clase'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle del Recurso de la Clase'
    })
}

module.exports = detailRecoursClass