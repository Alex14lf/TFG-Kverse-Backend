const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");

class Pelicula extends Model { }

Pelicula.init({
    id_pelicula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,  
        validate: {
            notNull: {
                msg: "El campo id_api no puede ser nulo"
            },
            isInt: {
                msg: "El campo id_api debe ser un número entero"
            }
        }
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo título no puede ser nulo"
            },
            len: {
                args: [1, 255],
                msg: "El campo título debe tener entre 1 y 255 caracteres"
            }
        }
    },
    genero: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo género no puede ser nulo"
            },
            len: {
                args: [1, 50],
                msg: "El campo género debe tener entre 1 y 50 caracteres"
            }
        }
    },
    sinopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo sinopsis no puede ser nulo"
            },
            len: {
                args: [10, 1000],
                msg: "La sinopsis debe tener entre 10 y 1000 caracteres"
            }
        }
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
    poster: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo poster no puede ser nulo"
            },
            isUrl: {
                msg: "El campo poster debe ser una URL válida"
            }
        }
    },
    cartel: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo cartel no puede ser nulo"
            },
            isUrl: {
                msg: "El campo cartel debe ser una URL válida"
            }
        }
    },
    fecha_estreno: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El campo fecha de estreno no puede ser nulo",
          },
          isDate: {
            msg: "El campo fecha de estreno debe ser una fecha válida",
          },
        },
      },
    valoracion: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo valoración no puede ser nulo"
            },
            isFloat: {
                msg: "El campo valoración debe ser un número decimal"
            },
            min: {
                args: [1],
                msg: "La valoración debe ser al menos 1"
            },
            max: {
                args: [10],
                msg: "La valoración no puede ser mayor a 10"
            }
        }
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,  // Asume que por defecto la película está disponible
    },
    orden: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: {
                msg: "El campo orden debe ser un número entero"
            },
            min: {
                args: [1],
                msg: "Debe empezar por 1"
            }
        }
    },
}, {
    sequelize,
    modelName: "peliculas",
    timestamps: false,
    freezeTableName: true
});

module.exports = Pelicula;
