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

    // Revisamos si el error es una validación para enviarlo correctamente al cliente
    if (error.name === 'SequelizeValidationError') {
      // Aquí mapeamos los errores para que cada campo tenga su error
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path] = err.message;  // Usamos el nombre del campo como clave y el mensaje como valor
        return acc;
      }, {});

      // Enviamos los errores como un objeto con la clave del campo y el mensaje de error
      return res.status(400).json({ errors });
    } else {
      res.status(500).json({ message: "Error interno del servidor" }); // Si el error no es de validación
    }
  }
};


module.exports = {
    login,
    signUp,
};
