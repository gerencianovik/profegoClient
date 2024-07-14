const teacherDetail = (sequelize, type) =>{
    return sequelize.define('teacherDetail',{
        idTeacherDetail:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rangeAgeTeacher: {
            type: type.STRING,
            comment: 'Rando de edad de Profesor'
        },
        subjetTeacher:{
            type: type.STRING,
            comment: 'materias del maestro'
        }
    }, {
        timestamps: false,
        comment: 'Tabla de Profesor'
    })
}

module.exports = teacherDetail