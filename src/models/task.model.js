const task = (sequelize, type) =>{
    return sequelize.define('task',{
        idTask: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tareas de clase'
        },
        nameTask: {
            type: type.STRING,
            comment: 'Nombre de Tareas de clase'
        },
        descriptionTask: {
            type: type.TEXT,
            comment: 'Descripcion de Tareas de clase'
        },
        fechaEntrega: {
            type: type.TEXT,
            comment: 'Descripcion de Tareas de clase'
        },
        stateTask: {
            type: type.STRING,
            comment: 'Estado de Tareas de clase'
        },
        CreateTask: {
            type: type.STRING,
            comment: 'Crear de Tareas de clase'
        },
        updateTask: {
            type: type.STRING,
            comment: 'Actualizar de Tareas de clase'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Tareas de clase'
    })
}

module.exports = task