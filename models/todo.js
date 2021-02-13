module.exports - function(sequelize, DataTypes){
    const Todo = sequelize.define('todo', {
        text: DataTypes.STRING, 
        complete: {
           type: DataTypes.BOOLEAN,
           default: false
        }
    })
    return Todo
}