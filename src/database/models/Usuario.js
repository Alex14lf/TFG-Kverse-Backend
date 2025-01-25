const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Usuario extends Model { }

Usuario.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DNI: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo DNI no puede ser nulo"
            },
            len: {
                args: [9, 20],
                msg: "El campo DNI debe tener entre 8 y 20 caracteres"
            }
        }
    }
}, {
    sequelize,
    modelName: "usuarios",
    timestamps: false,
    freezeTableName: true
});

module.exports = Usuario;