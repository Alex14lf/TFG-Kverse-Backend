const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Proyeccion extends Model {}

Proyeccion.init({
    id_proyeccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique:true
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo duración no puede ser nulo"
            },
            isInt: {
                msg: "El campo duración debe ser un número entero"
            },
            min: {
                args: [1],
                msg: "La duración debe ser al menos 1 minuto"
            }
        }
    },
    pelicula_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo película_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo película_id debe ser un número entero"
            }
        },
        references: {
            model: 'peliculas', // Nombre de la tabla 'peliculas'
            key: 'id_pelicula'           // Referencia al campo 'id' de la tabla 'peliculas'
        }
    },
    sala_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo sala_id no puede ser nulo"
            },
            isInt: {
                msg: "El campo sala_id debe ser un número entero"
            }
        }
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo inicio no puede ser nulo"
            },
            isDate: {
                msg: "El campo inicio debe ser una fecha válida"
            }
        }
    }, //PENSANDO SI AÑADIRLO O NO, EN PRINCIPIO NO
    // fecha_fin: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    //     validate: {
    //         notNull: {
    //             msg: "El campo fin no puede ser nulo"
    //         },
    //         isDate: {
    //             msg: "El campo fin debe ser una fecha válida"
    //         },
    //         // Validación de que la fecha de fin sea posterior a la de inicio
    //         isAfter: {
    //             args: () => new Date().toISOString(),
    //             msg: "La fecha de fin debe ser posterior a la fecha de inicio"
    //         }
    //     }
    // }
}, {
    sequelize,
    modelName: "proyecciones",
    timestamps: false,
    freezeTableName: true
});

module.exports = Proyeccion;
