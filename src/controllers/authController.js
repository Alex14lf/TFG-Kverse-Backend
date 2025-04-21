const AuthService = require("../services/authServices");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await AuthService.login(email, password);
        res.status(200).json(result); // 200 para respuesta exitosa
    } catch (error) {
        console.error("❌ Error en login:", error.message); // Registra el error en la consola
        res.status(400).json({ message: "Usuario o contraseña incorrectos" }); // Mensaje de error
    }
};


const signUp = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body);

    const { email, password, dni, nombre, apellidos, telefono, fecha_nacimiento } = req.body;

    // Llamamos al servicio para registrar al nuevo usuario
    const result = await AuthService.signUp(email, password, dni, nombre, apellidos, telefono, fecha_nacimiento);

    // Enviamos la respuesta exitosa
    res.status(201).json(result); // 201 para respuesta de creación exitosa
  } catch (error) {
    console.error("❌ Error en signUp:", error.message);

    // Si el error es una validación de Sequelize, devolvemos los errores específicos de cada campo
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;  // Usamos el nombre del campo como clave y el mensaje como valor
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    // Si el error es un error relacionado con el correo electrónico ya registrado
    if (error.message === "El correo electrónico ya está registrado") {
      return res.status(400).json({ error: error.message });
    }

    // En caso de cualquier otro error general
    res.status(500).json({ message: "Error interno del servidor" }); // Si el error no es de validación ni un correo ya registrado
  }
};



module.exports = {
    login,
    signUp,
};
