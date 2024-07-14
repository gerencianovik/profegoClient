const coursClassTypy = (sequelize, type) =>{
    return sequelize.define('coursClassType',{
        idCoursClassType: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tipo de clase o curso'
        },
        nameCoursClassType: {
            type: type.STRING,
            comment: 'Nombre de Tipo de clase o curso'
        },
        stateCoursClassType: {
            type: type.STRING,
            comment: 'Estado de Tipo de clase o curso'
        },
        createCoursClassType: {
            type: type.STRING,
            comment: 'Crear de Tipo de clase o curso'
        },
        updateCoursClassType: {
            type: type.STRING,
            comment: 'Actualizar de Tipo de clase o curso'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Tipo de clase o curso'
    })
}

module.exports = coursClassTypy