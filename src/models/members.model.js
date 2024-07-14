const members = (sequelize, type) =>{
    return sequelize.define('members',{
        idMembers: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo nico de Miembros'
        },
        createMenbers: {
            type: type.STRING,
            comment: 'Crear de Miembros'
        },
        updateMembers: {
            type: type.STRING,
            comment: 'Actualizar de Miembros'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Miembros'
    })
}

module.exports = members