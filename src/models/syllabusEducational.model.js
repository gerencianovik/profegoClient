const syllabusEducational = (sequelize, type) =>{
    return sequelize.define('syllabusEducational',{
        idsyllabusEducational : {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Contenido Curricular'
        },
        namesyllabusEducational: {
            type: type.STRING,
            comment: 'Nombre de Contenido Curricular'
        },
        objetivesyllabusEducational:{
            type: type.TEXT,
            comment: 'objetivo de Contenido Curricular'
        },
        moduleCurrucularContentCourse: {
            type: type.STRING,
            comment: 'Modulo de Contenido Curricular'
        },
        themesyllabusEducational: {
            type: type.STRING,
            comment: 'Tema de Contenido Curricular'
        },
        timesyllabusEducational: {
            type: type.STRING,
            comment: 'Tiempo de Contenido Curricular'
        },
        datesyllabusEducational: {
            type: type.STRING,
            comment: 'Date de Contenido Curricular'
        },
        observationsyllabusEducational: {
            type: type.STRING,
            comment: 'Observaciones de Contenido Curricular'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Contenido Curricular'
    })
}

module.exports = syllabusEducational