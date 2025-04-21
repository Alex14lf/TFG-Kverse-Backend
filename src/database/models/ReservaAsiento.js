const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class ReservaAsiento extends Model { }

ReservaAsiento.init({
    id_reservaasiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reserva_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo reserva_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo reserva_id debe ser un número entero"
            }
        },
        references: {
            model: 'reservas', 
            key: 'id_reserva'
        }
    },
    asiento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo asiento_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo asiento_id debe ser un número entero"
            }
        },
        references: {
            model: 'asientos',
            key: 'id_asiento' 
        }
    }
}, {
    sequelize,
    modelName: "reserva_asientos",  
    timestamps: false,
    freezeTableName: true
});


module.exports = ReservaAsiento;
