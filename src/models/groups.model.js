const groups = (sequelize, type) =>{
    return sequelize.define('groups',{
        idGroups: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo Unico de Grupo'
        },
        nameGroups: {
            type: type.STRING,
            comment: 'Nombre de Grupo'
        },
        stateGroups: {
            type: type.STRING,
            comment: 'Estado de Grupo'
        },
        createGroups: {
            type: type.STRING,
            comment: 'Crear de Grupo'
        },
        updateGroups: {
            type: type.STRING,
            comment: 'Actualizar de Grupo'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Grupo'
    })
}

module.exports = groups