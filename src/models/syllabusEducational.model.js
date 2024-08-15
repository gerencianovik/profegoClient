const syllabusEducational = (sequelize, type) =>{
    return sequelize.define('syllabusEducational',{
        idsyllabusEducational : {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Contenido Curricular'
        },
        objetivesyllabusEducational:{
            type: type.TEXT,
            comment: 'objetivo de Contenido Curricular'
        },
        observationsyllabusEducational: {
            type: type.STRING,
            comment: 'Observaciones de Contenido Curricular'
        },
        stateSyllabusEducational: {
            type: type.STRING,
            comment: 'estado de Contenido Curricular'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Contenido Curricular'
    })
}

module.exports = syllabusEducational