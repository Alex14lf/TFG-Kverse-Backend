const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../database/models/Usuario");
require("dotenv").config();

const login = async (email, password) => {
  try {
    console.log("🔍 Buscando usuario en la base de datos...");
    const user = await Usuario.findOne({ where: { email } });

    // Si el usuario no existe, devolver el mismo mensaje genérico
    if (!user) {
      console.log("❌ Usuario no encontrado");
      throw new Error("Usuario o contraseña incorrectos");
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta");
      throw new Error("Usuario o contraseña incorrectos");
    }

    console.log("✅ Usuario autenticado con éxito");

    // Generar token
    const token = jwt.sign({ id: user.id_usuario, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { message: "Login exitoso", token };
  } catch (error) {
    throw error; // Pasamos el error al controlador
  }
};


const signUp = async (email, password, dni, nombre, apellidos, telefono, fecha_nacimiento) => {
  try {
    console.log("🔍 Buscando usuario en la base de datos...");

    // Verificar si el email ya está registrado
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      console.log("❌ El correo electrónico ya está registrado");
      throw new Error("El correo electrónico ya está registrado");
    }

    // Crear el nuevo usuario (la contraseña se hashea automáticamente por el hook del modelo)
    const newUser = await Usuario.create({
      email,
      password,  // No es necesario hashear la contraseña, Sequelize lo hace automáticamente
      dni,
      nombre,
      apellidos,
      telefono,
      fecha_nacimiento,
    });

    console.log("✅ Usuario registrado con éxito");
    return { message: "Registro exitoso", user: newUser }; // Retornar el usuario creado
  } catch (error) {
    throw error; // Pasamos el error al controlador
  }
};

module.exports = {
  login,
  signUp,
};
