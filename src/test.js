const sequelize = require("./database/db");
const Usuario = require('./database/models/Usuario');

//PRUEBA DE CREAR UN USUARIO

async function crearUsuario() {
    try {
        await sequelize.authenticate(); // Verifica conexión
        console.log("✅ Conectado a la base de datos.");

        const nuevoUsuario = await Usuario.create({
            dni: '07601563L',
            nombre: 'Alejandro',
            apellidos: 'Lopez Fernandez',
            email: 'alex@gmail.com',
            fecha_nacimiento: '1990-05-20',
            telefono: '691014302',
            password: 'Kverse123' // Se hasheará automáticamente por el hook
        });

        console.log('✅ Usuario creado con éxito:', nuevoUsuario.get({ plain: true }));

    } catch (error) {
        console.error('❌ Error al crear el usuario:', error.message);
        
        // Si el error es de duplicidad, informa
        if (error.name === "SequelizeUniqueConstraintError") {
            console.error("⚠️ Error: Algun campo ya está en uso.");
        }

    } finally {
        await sequelize.close(); // Cierra la conexión al finalizar
        console.log("🔒 Conexión cerrada.");
    }
}

crearUsuario();

// PRUEBA DE QUE NO SE ACTUALIZA LA CONTRASEÑA AL HACER UN UPDATE DE OTRO CAMPO

// const testUpdatePassword = async () => {
//     await sequelize.sync({ force: false }); // NO BORRA DATOS

//     // 1️⃣ Buscar el usuario que creaste
//     let user = await Usuario.findOne({ where: { email: 'perez@gmail.com' } });

//     console.log("🔹 Contraseña antes de actualizar:", user.password);

//     // 2️⃣ Guardamos la contraseña original
//     const originalPassword = user.password;

//     // 3️⃣ Intentamos actualizar otro campo (nombre)
//     user.nombre = "Alejandro";  
//     await user.save();

//     // 4️⃣ Buscar el usuario nuevamente para verificar su contraseña
//     const updatedUser = await Usuario.findByPk(user.id_usuario);

//     console.log("🔹 Contraseña después de actualizar nombre:", updatedUser.password);

//     // 5️⃣ Comprobar si la contraseña cambió o se mantuvo igual
//     if (originalPassword === updatedUser.password) {
//         console.log("✅ La contraseña se mantiene igual al actualizar otro campo.");
//     } else {
//         console.log("❌ ERROR: La contraseña cambió sin motivo.");
//     }

//     await sequelize.close(); // Cierra la conexión a la BD
// };

// // Ejecutar la prueba
// testUpdatePassword();