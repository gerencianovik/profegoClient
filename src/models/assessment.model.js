const assessment = (sequelize, type) =>{
    return sequelize.define('assessment',{
        idAssessment: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Evaluacion'
        },
        nameAssessment:{
            type: type.STRING,
            comment: 'Nombre de Evaluacion'
        },
        descriptionAssessment: {
            type: type.STRING,
            comment: 'Descripcion de Evaluacion'
        },
        timeAssessment: {
            type: type.STRING,
            comment: 'Tiempo de Evaluacion'
        },
        dateAssessment: {
            type: type.STRING,
            comment: 'Fecha de Evaluacion'
        },
        qualificationAssessment: {
            type: type.STRING,
            comment: 'Nota de Evaluacion'
        },
        createAssessment: {
            type: type.STRING,
            comment: 'Crear de Evaluacion'
        },
        updateAssessment: {
            type: type.STRING,
            comment: 'Actualizar de Evaluacion'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Evaluacion'
    })
}

module.exports = assessment
