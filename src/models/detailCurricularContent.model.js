const detailCurricularContent = (sequelize, type) =>{
    return sequelize.define('detailCurricularContent',{
        idDetailCurricularContent: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Camnpo unico de Detalle del Contenido Curricular del Curso'
        },
        subTopicsDetailCurricularContent: {
            type: type.STRING,
            comment: 'SubTemas de Detalle del Contenido Curricular del Curso'
        },
        activitisDetailCurricularContent: {
            type: type.TEXT,
            comment: 'Actividades de Detalle del Contenido Curricular del Curso'
        },
        abilitisDetailCurricularContent: {
            type: type.TEXT,
            comment: 'Habilidades de Detalle del Contenido Curricular del Curso'
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