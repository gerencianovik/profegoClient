const ask = (sequelize, type) => {
    return sequelize.define('preguntas', {
        idTareas: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Campo Único de Preguntas'
        },
        questionAsk: {
            type: type.STRING,
            comment: 'Pregunta de Preguntas'
        },
        stateAsk: {
            type: type.STRING,
            comment: 'Estado de Preguntas'
        },
        timeAsk: {
            type: type.STRING,
            comment: 'Tiempo de Preguntas'
        },
        assessmentIdAssessment: {
            type: type.INTEGER,
            allowNull: true,
            comment: 'ID de Evaluación',
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Preguntas'
    });
};

module.exports = ask