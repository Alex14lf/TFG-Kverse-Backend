const updateMoviesRouter = require("express").Router();

const updateMovies = require('../../controllers/updateMoviesController')

updateMoviesRouter.get("/", updateMovies.getCarteleraAPI)

module.exports = updateMoviesRouter;