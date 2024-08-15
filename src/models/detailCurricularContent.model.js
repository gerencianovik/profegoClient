const detailCurricularContent = (sequelize, type) =>{
    return sequelize.define('detailCurricularContent',{
        idDetailCurricularContent: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Camnpo unico de Detalle del Contenido Curricular del Curso'
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
        createDetailCurrilarContentCours: {
            type: type.STRING,
            comment: 'Crear de Detalle del Contenido Curricular del Curso'
        },
        updateDetailCurricularContent: {
            type: type.STRING,
            comment: 'Actualizar de Detalle del Contenido Curricular del Curso'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle del Contenido Curricular del Curso'
    })
}

module.exports = detailCurricularContent