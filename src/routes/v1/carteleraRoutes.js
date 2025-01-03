const carteleraRouter = require("express").Router();

const carteleraController = require('../../controllers/carteleraController')

carteleraRouter.get("/", carteleraController.getCartelera)

module.exports = carteleraRouter;