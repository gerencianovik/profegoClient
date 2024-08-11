const estudent = (sequelize, type) =>{
    return sequelize.define('student',{
        idEstudent: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Estudinates'
        },
        photoEstudent: {
            type: type.STRING,
            comment: 'Foto de Estudinates'
        },
        completeNameEstudent: {
            type: type.STRING,
            comment: 'Nombre de Estudinates'
        },
        emailEstudent: {
            type: type.STRING,
            comment: 'Correo de Estudinates'
        },
        celularEstudent: {
            type: type.STRING,
            comment: 'Celular de Estudinates'
        },
        usernameEstudent: {
            type: type.STRING,
            comment: 'Sub nombre de Estudinates'
        },
        passwordEstudent: {
            type: type.STRING,
            comment: 'Contraseña de Estudinates'
        },
        stateEstudent: {
            type: type.STRING,
            comment: 'Estado de Estudinates'
        },
        createStudent: {
            type: type.STRING,
            comment: 'Creacion de Estudiante'
        },
        updateStudent: {
            type: type.STRING,
            comment: 'Actualizacion de Estudiante'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Estudinates'
    })
}

module.exports = estudent