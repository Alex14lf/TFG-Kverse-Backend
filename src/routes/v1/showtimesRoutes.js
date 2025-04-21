const showtimesRouter = require("express").Router();

const showtimesController = require('../../controllers/showtimesController')

showtimesRouter.get("/:movieId", showtimesController.getFutureShowtimesById)

module.exports = showtimesRouter;