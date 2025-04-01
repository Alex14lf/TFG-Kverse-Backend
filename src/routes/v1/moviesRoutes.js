const moviesRouter = require("express").Router();

const moviesController = require('../../controllers/moviesController')

moviesRouter.get("/", moviesController.getMovies)
moviesRouter.get("/active", moviesController.getActiveMovies)
moviesRouter.get("/:id", moviesController.getMovieById)
moviesRouter.get("/api/:id_api", moviesController.getMovieByIdApi)

module.exports = moviesRouter;