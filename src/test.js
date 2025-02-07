const sequelize = require("./database/db");
const Usuario = require('./database/models/Usuario'); // La ruta correcta
const { Op } = require("sequelize");

async function crearUsuario() {
    const t = await sequelize.transaction(); // Iniciar la transacción
    try {
        // Intentar crear el usuario dentro de la transacción
        const nuevoUsuario = await Usuario.create({
            DNI: '02042564L',
            nombre: 'Alex',
            apellidos: 'Pérez García',
            email: '443t4.perez@mail.com',
            fecha_nac: '1990-05-20',
            telefono: '609573332',
            password: 'Password12345' // Esta será la contraseña que se hasheará
        }, { transaction: t });

        // Si todo sale bien, hacer commit de la transacción
        await t.commit();

        console.log('Usuario creado con éxito:', nuevoUsuario);
        console.log('Contraseña hasheada:', nuevoUsuario.password); // Ver el hash de la contraseña
    } catch (error) {
        // Si hay un error, hacer rollback de la transacción
        await t.rollback();
        await sequelize.query('ALTER TABLE `Usuarios` AUTO_INCREMENT = 1;');
        console.error('Error al crear el usuario:', error);
    }
}

crearUsuario();
