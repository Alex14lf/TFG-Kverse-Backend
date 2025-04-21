const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Reserva extends Model {}

Reserva.init({
    id_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique:true
    },
    proyeccion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo proyeccion_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo proyeccion_id debe ser un número entero"
            }
        },
        references: {
            model: 'proyecciones', 
            key: 'id_proyeccion'    
        }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo usuario_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo usuario_id debe ser un número entero"
            }
        },
        references: {
            model: 'usuarios',     
            key: 'id_usuario'     
        }
    },
}, {
    sequelize,
    modelName: "reservas",
    timestamps: true,  // Esto añade los campos createdAt y updatedAt automáticamente
    createdAt: 'fecha_reserva',
    freezeTableName: true
});

module.exports = Reserva;
