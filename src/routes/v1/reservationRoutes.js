const express = require("express");
const router = express.Router();
const { crearReserva, deleteReserva } = require("../../controllers/reservationController");

router.post("/", crearReserva);
router.delete("/:idReserva", deleteReserva);

module.exports = router;
