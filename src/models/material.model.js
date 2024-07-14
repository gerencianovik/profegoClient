const material = (sequelize, type) =>{
    return sequelize.define('material',{
        idMaterial: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Materiales de Clase'
        },
        nameMaterial: {
            type: type.STRING,
            comment: 'Nombre de Materiales de Clase'
        },
        descriptionMaterial: {
            type: type.TEXT,
            comment: 'Description de Materiales de Clase'
        },
        quantyMaterailClass: {
            type: type.STRING,
            comment: 'Cantidad de Materiales de Clase'
        },
        valueMaterial: {
            type: type.STRING,
            comment: 'Valor de Materiales de Clase'
        },
        typeMaterial: {
            type: type.STRING,
            comment: 'tipo de material'
        },
        stateMaterial: {
            type: type.STRING,
            comment: 'Estado de Materiales de Clase'
        },
        createMaterial: {
            type: type.STRING,
            comment: 'Crear de Materiales de Clase'
        },
        updateMaterial: {
            type: type.STRING,
            comment: 'Actualizar de Materiales de Clase'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Materiales de Clase'
    })
}

module.exports = material