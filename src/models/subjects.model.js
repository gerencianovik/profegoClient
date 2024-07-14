const subjects = (sequelize, type) =>{
    return sequelize.define('subjects',{
        idSubject:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Materias'
        },
        nambeSubjects: {
            type: type.STRING,
            comment: 'Nombre de Materias'
        },
        descriptionSubjects: {
            type: type.TEXT,
            comment: 'Descripcion de Materias'
        },
        stateSubjects: {
            type: type.STRING,
            comment: 'Estado de Materias'
        },
        createSubjects: {
            type: type.STRING,
            comment: 'Crear de Materias'
        },
        updateSubjects: {
            type: type.STRING,
            comment: 'Actualizar de Materias'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Materias'
    })
}

module.exports = subjects