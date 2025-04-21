const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(cors());

//conexion a la base de datos
const sequelize = require("./database/db");
require('./database/associations')

//middleware
app.use(express.json())

const updateMoviesRouter = require("./routes/v1/updateMoviesRoutes")
app.use("/v1/cine/updateMovies", updateMoviesRouter)
const moviesRouter = require("./routes/v1/moviesRoutes")
app.use("/v1/cine/movies", moviesRouter)
const authRouter = require("./routes/v1/authRoutes")
app.use("/v1/cine/", authRouter)
const showtimesRouter = require("./routes/v1/showtimesRoutes")
app.use("/v1/cine/showtimes", showtimesRouter)
const reservationRoutes = require("./routes/v1/reservationRoutes");
app.use("/v1/cine/reservas", reservationRoutes);
const reservationSeatsRoutes = require("./routes/v1/reservationSeatsRoutes");
app.use("/v1/cine/reservaAsientos", reservationSeatsRoutes);
const ticketRoutes = require("./routes/v1/ticketRoutes");
app.use("/v1/cine/tickets", ticketRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} 🚀🚀`)
    sequelize
        .sync({ force: false })
        .then(() => console.log("Conexion correcta a la base de datos Kverse 👍👍"))
        .then(() => console.log("Tablas sincronizadas ✅✅"))
        .catch((error) => console.log("Error: " + error + "❌❌"))
})