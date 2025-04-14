const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Sala extends Model { }

Sala.init({
    id_sala: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El campo nombre no puede ser nulo"
          },
          len: {
            args: [1, 100],
            msg: "El nombre de la sala debe tener entre 1 y 100 caracteres"
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
