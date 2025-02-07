const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

//conexion a la base de datos
const sequelize = require("./database/db");
require('./database/associations')

//middleware
app.use(express.json())

const carteleraRouter = require("./routes/v1/carteleraRoutes")
app.use("/v1/cine/cartelera", carteleraRouter)

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} 🚀🚀`)
    sequelize
        .sync({ force: true })
        .then(() => console.log("Conexion correcta a la base de datos Kverse 👍👍"))
        .then(() => console.log("Tablas sincronizadas ✅✅"))
        .catch((error) => console.log("Error: " + error + "❌❌"))
})