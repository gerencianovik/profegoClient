const detailGrpoups = (sequelize, type) =>{
    return sequelize.define('detailGroups',{
        idDetailGroups: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Campo unico de Detalle de grupo'
        },
        createDetailGroups: {
            type: type.STRING,
            comment: 'Create de Detalle de grupo'
        },
        updateDetailGroups: {
            type: type.STRING,
            comment: 'Update de Detalle de grupo'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Detalle de grupo'
    })
}

module.exports = detailGrpoups