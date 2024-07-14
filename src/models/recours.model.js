const recours = (sequelize, type) =>{
    return sequelize.define('recours', {
        idRecours:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: "Campo unico de Recurso del Curso"
        },
        nameRecours: {
           type: type.STRING,
           comment: 'Nombre de Recurso del Curso' 
        },
        descriptionRecourse: {
            type: type.TEXT,
            comment: 'Descripcion de Recurso del Curso'
        },
        quantyRecours: {
            type: type.STRING,
            comment: 'Cantidad de Recurso del Curso'
        },
        valueRecours: {
            type: type.STRING,
            comment: 'Valor de Recurso del Curso'
        },
        typeRecurs: {
            type: type.STRING,
            comment: 'tipo de Recurso'
        },
        stateRecours: {
            type: type.STRING,
            comment: 'Estado de Recurso del Curso'
        },
        createRecours: {
            type: type.STRING,
            comment: 'Crear de Recurso del Curso'
        },
        updateRecursCourse: {
            type: type.STRING,
            comment: 'Actualizar de Recurso del Curso'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Recurso del Curso'
    })
}

module.exports = recours