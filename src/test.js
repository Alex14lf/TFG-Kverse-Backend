const sequelize = require("./database/db");
const Usuario = require('./database/models/Usuario');

async function crearUsuario() {
    try {
        const nuevoUsuario = await Usuario.create({
            dni: '17141563L',
            nombre: 'Alex',
            apellidos: 'Pérez García',
            email: '44221a1qt4.pererz@mail.com',
            fecha_nacimiento: '1990-05-20',
            telefono: '601014302',
            password: 'Password12345' 
        });
        // console.log('Usuario creado con éxito:', nuevoUsuario); //CONTIENE METADATOS
        console.log('Usuario creado con éxito:', nuevoUsuario.get({ plain: true })); //SOLO EL OBJETO
    } catch (error) {
        await sequelize.query('ALTER TABLE `Usuarios` AUTO_INCREMENT = 1;');
        console.error('Error al crear el usuario:', error);
    }
}
crearUsuario();
