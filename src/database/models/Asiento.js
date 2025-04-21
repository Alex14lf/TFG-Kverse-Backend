const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Asiento extends Model { }

Asiento.init({
    id_asiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // estado: {
    //     type: DataTypes.STRING(50),
    //     allowNull: false,
    //     validate: {
    //         notNull: {
    //             msg: "El campo estado no puede ser nulo"
    //         },
    //         len: {
    //             args: [1, 50],
    //             msg: "El campo estado debe tener entre 1 y 50 caracteres"
    //         }
    //     }
    // },
    // sala_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     validate: {
    //         notNull: {
    //             msg: "El campo sala_id no puede ser nulo"
    //         },
    //         isInt: {
    //             msg: "El campo sala_id debe ser un número entero"
    //         }
    //     }
    // },
    fila: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo fila no puede ser nulo"
            },
            isInt: {
                msg: "El campo fila debe ser un número entero"
            },
            min: {
                args: [1],
                msg: "El valor de la fila debe ser al menos 1"
            },
            max: {
                args: [8], 
                msg: "El valor de la fila no puede ser mayor a 8"
            }
        }
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo numero no puede ser nulo"
            },
            isInt: {
                msg: "El campo numero debe ser un número entero"
            },
            min: {
                args: [1],
                msg: "El número de asiento debe ser al menos 1"
            },
            max: {
                args: [16], 
                msg: "El número de asiento no puede ser mayor a 16"
            }
        }
    }
}, {
    sequelize,
    modelName: "asientos",
    timestamps: false,
    freezeTableName: true
});

module.exports = Asiento;
