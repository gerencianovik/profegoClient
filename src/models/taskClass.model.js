const taskClass = (sequelize, type) =>{
    return sequelize.define('taskClass',{
        idTaskClass: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Campo unico de Tareas de clase'
        },
        nameTaskClass: {
            type: type.STRING,
            comment: 'Nombre de Tareas de clase'
        },
        descriptionTaskClass: {
            type: type.TEXT,
            comment: 'Descripcion de Tareas de clase'
        },
        stateTaskClass: {
            type: type.STRING,
            comment: 'Estado de Tareas de clase'
        },
        CreateTaskClass: {
            type: type.STRING,
            comment: 'Crear de Tareas de clase'
        },
        updateTaskClass: {
            type: type.STRING,
            comment: 'Actualizar de Tareas de clase'
        },
    }, {
        timestamps: false,
        comment: 'Tabla de Tareas de clase'
    })
}

module.exports = taskClass