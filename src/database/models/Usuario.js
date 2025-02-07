const sequelize = require("../db");
const { Model, DataTypes } = require("sequelize");
const userHooks = require('../hooks/userHooks');

class Usuario extends Model { }

Usuario.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dni: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo DNI no puede ser nulo"
            },
            len: {
                args: [9, 20],
                msg: "El campo DNI debe tener entre 9 y 20 caracteres"
            },
            isDniValido(value) {
                const dniRegex = /^\d{8}[A-Za-z]$/;
                if (!dniRegex.test(value)) {
                    throw new Error('El DNI debe tener el formato correcto: 8 dígitos seguidos de una letra');
                }
            }
        }
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo nombre no puede ser nulo"
            },
            len: {
                args: [2, 50],
                msg: "El campo nombre debe tener entre 2 y 50 caracteres"
            }
        }
    },
    apellidos: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo apellidos no puede ser nulo"
            },
            len: {
                args: [2, 50],
                msg: "El campo apellidos debe tener entre 2 y 50 caracteres"
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo email no puede ser nulo"
            },
            isEmail: {
                msg: "El campo email debe ser una dirección de email válida"
            }
        }
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El campo fecha de nacimiento no puede ser nulo",
          },
          isDate: {
            msg: "El campo fecha de nacimiento debe ser una fecha válida",
          },
        },
      },
      telefono: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "El campo teléfono no puede ser nulo",
          },
          len: {
            args: [9, 15],
            msg: "El campo teléfono debe tener entre 9 y 15 caracteres",
          },
          isNumeric: {
            msg: "El campo teléfono debe contener solo números",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El campo contraseña no puede ser nulo",
          },
          len: { //NO ES NECESARIO PORQUE LA ALMACENA HASHEADA POR BCRYPT Y TIENE LONGITUD DE 60
            args: [8, 100],
            msg: "La contraseña debe tener al menos 8 caracteres",
          },
        },
      },
}, {
    sequelize,
    modelName: "usuarios",
    timestamps: true,
    createdAt: 'fecha_registro',  // Personalizar el nombre de createdAt
    updatedAt: 'fecha_modificacion',  // Personalizar el nombre de updatedAt
    freezeTableName: true,
    hooks: userHooks,
});

module.exports = Usuario;