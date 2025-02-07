const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Sala extends Model { }

Sala.init({
    id_sala: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Asegura que el número de sala sea único
        validate: {
            notNull: {
                msg: "El campo número no puede ser nulo"
            },
            isInt: {
                msg: "El campo número debe ser un valor entero"
            },
            min: {
                args: [1],
                msg: "El número debe ser al menos 1"
            }
        }
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo capacidad no puede ser nulo"
            },
            isInt: {
                msg: "El campo capacidad debe ser un número entero"
            },
            min: {
                args: [1],
                msg: "La capacidad debe ser al menos 1"
            }
        }
    }
}, {
    sequelize,
    modelName: "salas",
    timestamps: false,
    freezeTableName: true
});

module.exports = Sala;
